#!/usr/bin/env python3
"""Generate bundled ITU spelling clips with Kokoro-82M (Apache 2.0), voice bm_george (en-GB).

Hyphen-free prompt spellings were chosen so en-GB phonemes match the official
ITU-R M.1677 / Appendix 14 pronunciations (verified with kokoro/espeak phonemizer).
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "media" / "spell"
WAV = Path("/tmp/spell-wav")
MODEL = Path(os.environ.get("KOKORO_MODEL", "/tmp/kokoro-models/kokoro-v1.0.onnx"))
VOICES = Path(os.environ.get("KOKORO_VOICES", "/tmp/kokoro-models/voices-v1.0.bin"))
VOICE = "bm_george"
SPEED = 0.9
SR = 24000

# Official ITU pronunciation via hyphen-free spellings that yield the right phonemes.
LETTERS: list[tuple[str, str, str | None]] = [
    ("a", "Al fah", None),
    ("b", "Brah voh", None),
    ("c", "Char lee", None),
    ("d", "Dell tah", None),
    ("e", "Eck oh", None),
    ("f", "Foks trot", None),
    ("g", "Golf", None),
    ("h", "Hoh tel", None),
    ("i", "In dee ah", None),
    ("j", "Jew lee ett", None),
    ("k", "Kilo", None),
    ("l", "Lee mah", None),
    ("m", "Mike", None),
    ("n", "Noh vem ber", None),
    ("o", "Oss cah", None),
    ("q", "Kebeck", "kˈɛ bˈɛk"),  # text "Kebeck" is close; phonemes keep two clear syllables
    ("p", "Pah pah", None),
    ("r", "Row me oh", None),
    ("s", "See air rah", None),
    ("t", "Tango", None),
    ("u", "You nee form", None),
    ("v", "Vik tah", None),
    ("w", "Wiss key", None),
    ("x", "Ecks ray", None),
    ("y", "Yang key", None),
    ("z", "Zulu", None),
]
ITU_DIGITS = [
    "Nah dah zay roh",
    "Oo nah wun",
    "Beece soh too",
    "Tay rah tree",
    "Kar tay fower",
    "Pan tah five",
    "Sock see six",
    "Say tay seven",
    "Ock toh eight",
    "Noh vay niner",
]
PLAIN_DIGITS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]


def trim(audio: np.ndarray, sr: int, pad_ms: int = 60) -> np.ndarray:
    a = np.asarray(audio, dtype=np.float32)
    if a.ndim > 1:
        a = a.mean(axis=1).astype(np.float32)
    peak = np.max(np.abs(a)) or 1.0
    thr = max(0.01 * peak, 0.003)
    idx = np.where(np.abs(a) > thr)[0]
    if len(idx) == 0:
        return a
    pad = int(sr * pad_ms / 1000)
    lo = max(0, int(idx[0]) - pad)
    hi = min(len(a), int(idx[-1]) + pad + 1)
    out = a[lo:hi]
    # gentle fade
    fade = min(int(sr * 0.008), max(1, len(out) // 20))
    if fade > 1:
        out = out.copy()
        out[:fade] *= np.linspace(0, 1, fade, dtype=np.float32)
        out[-fade:] *= np.linspace(1, 0, fade, dtype=np.float32)
    peak = np.max(np.abs(out)) or 1.0
    if peak > 0.95:
        out = out * (0.95 / peak)
    return out


def encode_mp3(wav: Path, mp3: Path) -> None:
    mp3.parent.mkdir(parents=True, exist_ok=True)
    subprocess.check_call(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", str(wav),
            "-ac", "1", "-ar", "22050",
            "-c:a", "libmp3lame", "-b:a", "32k",
            str(mp3),
        ]
    )


def main() -> int:
    if not MODEL.exists() or not VOICES.exists():
        print("Missing Kokoro model files", MODEL, VOICES, file=sys.stderr)
        return 1
    from kokoro_onnx import Kokoro

    k = Kokoro(str(MODEL), str(VOICES))
    WAV.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []

    def synth(key: str, file_stem: str, text: str, phonemes: str | None = None) -> dict:
        if phonemes:
            audio, sr = k.create(phonemes, voice=VOICE, speed=SPEED, lang="en-gb", is_phonemes=True)
            used = phonemes
            kind = "phonemes"
        else:
            audio, sr = k.create(text, voice=VOICE, speed=SPEED, lang="en-gb")
            used = text
            kind = "text"
        audio = trim(np.asarray(audio, dtype=np.float32), sr)
        dur = float(len(audio) / sr)
        rms = float(np.sqrt(np.mean(np.square(audio)))) if len(audio) else 0.0
        wav = WAV / f"{file_stem}.wav"
        sf.write(wav, audio, sr)
        mp3 = OUT / f"{file_stem}.mp3"
        encode_mp3(wav, mp3)
        rec = {
            "key": key,
            "file": f"{file_stem}.mp3",
            "text": text,
            "used": used,
            "kind": kind,
            "duration_s": round(dur, 3),
            "rms": round(rms, 4),
            "bytes": mp3.stat().st_size,
        }
        manifest.append(rec)
        flag = "OK" if dur >= 0.28 and rms >= 0.02 else "WARN"
        print(f"{flag} {file_stem:14} {dur:5.2f}s rms={rms:.3f} {mp3.stat().st_size:5d}B  {text}")
        return rec

    # Keep Q after P in alphabet order in the list above — already mixed, that's fine.
    for letter, text, ph in LETTERS:
        synth("L-" + letter.upper(), f"l-{letter}", text, ph)
    for i, text in enumerate(ITU_DIGITS):
        synth(f"D-{i}", f"d-{i}", text)
    for i, text in enumerate(PLAIN_DIGITS):
        synth(f"P-{i}", f"p-{i}", text)
    synth("M-.", "m-decimal", "Day see mal")
    synth("M--", "m-hyphen", "Hyphen")

    (OUT / "manifest.json").write_text(json.dumps({
        "engine": "Kokoro-82M",
        "voice": VOICE,
        "lang": "en-GB",
        "license": "Apache-2.0 (https://huggingface.co/hexgrad/Kokoro-82M)",
        "speed": SPEED,
        "format": "mp3 22050 Hz mono 32 kbps",
        "clips": manifest,
    }, indent=2) + "\n")
    total = sum(x["bytes"] for x in manifest)
    print(f"TOTAL {len(manifest)} clips, {total} bytes ({total/1024:.1f} KiB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
