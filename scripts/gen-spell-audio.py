#!/usr/bin/env python3
"""Generate bundled spelling and position clips.

English: Kokoro-82M (Apache 2.0), voice bm_daniel (en-GB), speed 1.0.
Natural word prompts (Alpha, Bravo, …); Quebec uses “Keh-beck”.
Digits: everyday Zero…Nine (Nine, not Niner). ITU code words stay as
long-press clips.

German (UBI position terms): Piper de_DE-thorsten-medium (dataset CC0,
Thorsten Müller / rhasspy piper-voices).
"""
from __future__ import annotations

import json
import math
import os
import re
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "media" / "spell"
WAV = Path("/tmp/spell-wav")
MODEL = Path(os.environ.get("KOKORO_MODEL", "/tmp/kokoro-models/kokoro-v1.0.onnx"))
VOICES = Path(os.environ.get("KOKORO_VOICES", "/tmp/kokoro-models/voices-v1.0.bin"))
PIPER_MODEL = Path(os.environ.get("PIPER_DE_MODEL", "/tmp/piper-de/de_DE-thorsten-medium.onnx"))
VOICE = os.environ.get("KOKORO_VOICE", "bm_daniel")
SPEED = float(os.environ.get("KOKORO_SPEED", "1.0"))
SR = 24000
BITRATE = "48k"

# Natural English words. Only Quebec is respelt so Kokoro keeps two clear syllables.
LETTERS: list[tuple[str, str, str | None]] = [
    ("a", "Alpha", None),
    ("b", "Bravo", None),
    ("c", "Charlie", None),
    ("d", "Delta", None),
    ("e", "Echo", None),
    ("f", "Foxtrot", None),
    ("g", "Golf", None),
    ("h", "Hotel", None),
    ("i", "India", None),
    ("j", "Juliett", None),
    ("k", "Kilo", None),
    ("l", "Lima", None),
    ("m", "Mike", None),
    ("n", "November", None),
    ("o", "Oscar", None),
    ("p", "Papa", None),
    ("q", "Keh-beck", None),
    ("r", "Romeo", None),
    ("s", "Sierra", None),
    ("t", "Tango", None),
    ("u", "Uniform", None),
    ("v", "Victor", None),
    ("w", "Whiskey", None),
    ("x", "X-ray", None),
    ("y", "Yankee", None),
    ("z", "Zulu", None),
]
# ITU long-press prompts (hyphen-free so phonemes stay close to Appendix 14).
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

# SRC position terms (same English voice).
SRC_TERMS: list[tuple[str, str, str]] = [
    ("T-degrees", "t-degrees", "Degrees"),
    ("T-minutes", "t-minutes", "Minutes"),
    ("T-decimal", "t-decimal", "Decimal"),
    ("T-point", "t-point", "Point"),
    ("T-north", "t-north", "North"),
    ("T-south", "t-south", "South"),
    ("T-east", "t-east", "East"),
    ("T-west", "t-west", "West"),
    ("T-utc", "t-utc", "U T C"),
    ("T-position", "t-position", "Position"),
    ("T-bearing", "t-bearing", "Bearing"),
    ("T-distance", "t-distance", "Distance"),
    ("T-nautical-miles", "t-nautical-miles", "Nautical miles"),
    ("T-latitude", "t-latitude", "Latitude"),
    ("T-longitude", "t-longitude", "Longitude"),
]

# UBI German position terms + digits for the worked example.
DE_TERMS: list[tuple[str, str, str]] = [
    ("DE-position", "de-position", "Position"),
    ("DE-kilometer", "de-kilometer", "Kilometer"),
    ("DE-stromkilometer", "de-stromkilometer", "Stromkilometer"),
    ("DE-rheinkilometer", "de-rheinkilometer", "Rheinkilometer"),
    ("DE-zuberg", "de-zuberg", "zu Berg"),
    ("DE-zutal", "de-zutal", "zu Tal"),
    ("DE-rechtesufer", "de-rechtesufer", "rechtes Ufer"),
    ("DE-linkesufer", "de-linkesufer", "linkes Ufer"),
    ("DE-komma", "de-komma", "Komma"),
    ("DE-bei", "de-bei", "bei"),
    ("DE-ortslage", "de-ortslage", "Ortslage"),
]
DE_DIGITS = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"]


def trim(audio: np.ndarray, sr: int, pad_ms: int = 50) -> np.ndarray:
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
    out = a[lo:hi].copy()
    fade = min(int(sr * 0.010), max(1, len(out) // 20))
    if fade > 1:
        out[:fade] *= np.linspace(0, 1, fade, dtype=np.float32)
        out[-fade:] *= np.linspace(1, 0, fade, dtype=np.float32)
    peak = np.max(np.abs(out)) or 1.0
    if peak > 0.95:
        out = out * (0.95 / peak)
    return out


def _loudnorm_stats(wav: Path) -> dict[str, str]:
    proc = subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-i", str(wav),
            "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json",
            "-f", "null", "-",
        ],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    m = re.search(r"\{[^{}]*\}", proc.stdout[proc.stdout.rfind("{") :] if "{" in proc.stdout else "")
    if not m:
        # fall back: try last JSON-looking block
        start = proc.stdout.rfind("{")
        end = proc.stdout.rfind("}")
        if start >= 0 and end > start:
            raw = proc.stdout[start : end + 1]
        else:
            return {}
    else:
        raw = m.group(0)
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    keys = (
        "input_i", "input_tp", "input_lra", "input_thresh",
        "target_offset",
    )
    return {k: str(data[k]) for k in keys if k in data}


def _finite_db(value: str | None) -> bool:
    if value is None:
        return False
    try:
        v = float(value)
    except ValueError:
        return False
    return math.isfinite(v) and -70 <= v <= 70


def encode_mp3(wav: Path, mp3: Path) -> None:
    mp3.parent.mkdir(parents=True, exist_ok=True)
    stats = _loudnorm_stats(wav)
    if (
        stats
        and _finite_db(stats.get("input_i"))
        and _finite_db(stats.get("input_tp"))
        and _finite_db(stats.get("target_offset"))
        and _finite_db(stats.get("input_thresh"))
    ):
        af = (
            "loudnorm=I=-16:TP=-1.5:LRA=11:"
            f"measured_I={stats['input_i']}:"
            f"measured_LRA={stats['input_lra']}:"
            f"measured_TP={stats['input_tp']}:"
            f"measured_thresh={stats['input_thresh']}:"
            f"offset={stats.get('target_offset', '0')}:"
            "linear=true"
        )
    else:
        # Very short words (e.g. “bei”) can yield -inf integrated loudness.
        af = "loudnorm=I=-16:TP=-1.5:LRA=11"
    subprocess.check_call(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", str(wav),
            "-af", af,
            "-ac", "1", "-ar", "22050",
            "-c:a", "libmp3lame", "-b:a", BITRATE,
            str(mp3),
        ]
    )


def main() -> int:
    if not MODEL.exists() or not VOICES.exists():
        print("Missing Kokoro model files", MODEL, VOICES, file=sys.stderr)
        return 1
    if not PIPER_MODEL.exists():
        print("Missing Piper German model", PIPER_MODEL, file=sys.stderr)
        return 1

    from kokoro_onnx import Kokoro
    from piper import PiperVoice

    k = Kokoro(str(MODEL), str(VOICES))
    # British vs American
    lang = "en-gb" if VOICE.startswith("b") else "en-us"
    piper = PiperVoice.load(str(PIPER_MODEL))
    WAV.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: list[dict] = []

    def write_clip(key: str, file_stem: str, text: str, audio: np.ndarray, sr: int, used: str, kind: str, engine: str) -> dict:
        audio = trim(np.asarray(audio, dtype=np.float32), sr)
        dur = float(len(audio) / sr) if sr else 0.0
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
            "engine": engine,
            "duration_s": round(dur, 3),
            "rms": round(rms, 4),
            "bytes": mp3.stat().st_size,
        }
        manifest.append(rec)
        flag = "OK" if dur >= 0.22 and rms >= 0.01 else "WARN"
        print(f"{flag} {file_stem:22} {dur:5.2f}s rms={rms:.3f} {mp3.stat().st_size:5d}B  {text}")
        return rec

    def synth_en(key: str, file_stem: str, text: str, phonemes: str | None = None) -> dict:
        if phonemes:
            audio, sr = k.create(phonemes, voice=VOICE, speed=SPEED, lang=lang, is_phonemes=True)
            used, kind = phonemes, "phonemes"
        else:
            audio, sr = k.create(text, voice=VOICE, speed=SPEED, lang=lang)
            used, kind = text, "text"
        return write_clip(key, file_stem, text, audio, sr, used, kind, f"Kokoro-82M/{VOICE}")

    def synth_de(key: str, file_stem: str, text: str) -> dict:
        chunks: list[np.ndarray] = []
        sr = 22050
        with wave.open(str(WAV / f"{file_stem}-raw.wav"), "wb") as wf:
            piper.synthesize_wav(text, wf)
        audio, sr = sf.read(WAV / f"{file_stem}-raw.wav", dtype="float32")
        return write_clip(key, file_stem, text, audio, sr, text, "text", "Piper de_DE-thorsten-medium")

    for letter, text, ph in LETTERS:
        synth_en("L-" + letter.upper(), f"l-{letter}", text, ph)
    for i, text in enumerate(ITU_DIGITS):
        synth_en(f"D-{i}", f"d-{i}", text)
    for i, text in enumerate(PLAIN_DIGITS):
        synth_en(f"P-{i}", f"p-{i}", text)
    synth_en("M-.", "m-decimal", "Decimal")
    synth_en("M-.-itu", "d-decimal", "Day see mal")
    synth_en("M--", "m-hyphen", "Hyphen")
    for key, stem, text in SRC_TERMS:
        synth_en(key, stem, text)
    for key, stem, text in DE_TERMS:
        synth_de(key, stem, text)
    for i, text in enumerate(DE_DIGITS):
        synth_de(f"DE-{i}", f"de-{i}", text)

    (OUT / "manifest.json").write_text(json.dumps({
        "engine": "Kokoro-82M + Piper",
        "voice": VOICE,
        "lang": "en-GB",
        "speed": SPEED,
        "german_voice": "de_DE-thorsten-medium",
        "german_license": "CC0 (https://github.com/thorstenMueller/Thorsten-Voice, rhasspy/piper-voices MODEL_CARD)",
        "license": "Kokoro-82M Apache-2.0 (https://huggingface.co/hexgrad/Kokoro-82M); German clips CC0",
        "format": f"mp3 22050 Hz mono {BITRATE}, loudnorm I=-16 LUFS TP=-1.5",
        "clips": manifest,
    }, indent=2, ensure_ascii=False) + "\n")
    (OUT / "README.md").write_text(
        "# Bundled spelling and position clips\n\n"
        f"- English: Kokoro-82M, voice `{VOICE}`, speed {SPEED}, en-GB. License: Apache 2.0.\n"
        "  Natural word prompts (Alpha, Bravo, …). Quebec is prompted as “Keh-beck”.\n"
        "  Everyday digits Zero…Nine (Nine, not Niner). ITU code words are long-press only.\n"
        "- German (UBI positions): Piper `de_DE-thorsten-medium` (22.05 kHz). Dataset: Thorsten Voice, CC0.\n"
        "  See https://github.com/thorstenMueller/Thorsten-Voice and the Piper MODEL_CARD.\n"
        f"- Encoding: mono 22050 Hz, {BITRATE} MP3, loudness normalised to about −16 LUFS, trimmed, short fade, true peak ≤ −1.5 dB.\n"
    )
    total = sum(x["bytes"] for x in manifest)
    print(f"TOTAL {len(manifest)} clips, {total} bytes ({total/1024:.1f} KiB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
