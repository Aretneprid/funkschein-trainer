#!/usr/bin/env python3
"""Generate bundled dictation and vocabulary clips.

English: Kokoro-82M, voice bm_daniel (en-GB).
  Dictations: speed 1.0 (normal) and 0.8 (slow).
  Vocabulary: speed 1.0 only.
German (UBI Textaufnahme): Piper de_DE-thorsten-medium.
  Normal length_scale=1.0; slow length_scale=1.25 (~0.8×).

Encoding matches scripts/gen-spell-audio.py: mono 22050 Hz, 48k MP3,
loudnorm I=-16 LUFS, TP=-1.5 dB, trimmed, short fade.
"""
from __future__ import annotations

import argparse
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
sys.path.insert(0, str(ROOT / "scripts"))

# learn-content.py has a hyphen; import via loader
def _load_content():
    import importlib.util
    path = ROOT / "scripts" / "learn-content.py"
    spec = importlib.util.spec_from_file_location("learn_content", path)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(mod)
    return mod.DICTATIONS, mod.VOCAB

DICTATIONS, VOCAB = _load_content()

DICT_OUT = ROOT / "public" / "media" / "dict" / "v1"
VOCAB_OUT = ROOT / "public" / "media" / "vocab" / "v1"
WAV = Path("/tmp/learn-wav")
MODEL = Path(os.environ.get("KOKORO_MODEL", "/tmp/kokoro-models/kokoro-v1.0.onnx"))
VOICES = Path(os.environ.get("KOKORO_VOICES", "/tmp/kokoro-models/voices-v1.0.bin"))
PIPER_MODEL = Path(os.environ.get("PIPER_DE_MODEL", "/tmp/piper-de/de_DE-thorsten-medium.onnx"))
VOICE = os.environ.get("KOKORO_VOICE", "bm_daniel")
SR_EN = 24000
BITRATE = "48k"

# Spoken forms used only for TTS, never shown as model transcripts.
EN_PHRASE = [
    ("MAYDAY RELAY", "Mayday Relay"),
    ("MAYDAY", "Mayday"),
    ("PAN PAN", "Pahn pahn"),
    ("SÉCURITÉ", "Say-cure-ee-tay"),
    ("SECURITE", "Say-cure-ee-tay"),
    ("SEELONCE MAYDAY", "Say-lonce Mayday"),
    ("SEELONCE FEENEE", "Say-lonce fee-nay"),
]

EN_WORD = {
    "UTC": "U T C",
    "ETA": "E T A",
    "ETD": "E T D",
    "MMSI": "M M S I",
    "AIS": "A I S",
    "INTERCO": "Interco",
    "MRCC": "M R C C",
    "DSC": "D S C",
    "GMDSS": "G M D S S",
    "NAVTEX": "Navtex",
    "EPIRB": "E P I R B",
    "SART": "Sart",
    "WX": "W X",
    "NX": "N X",
    "LT": "L T",
    "SOLAS": "Solas",
}

DE_PHRASE = [
    ("ATIS", "Atis"),
    ("NIF", "N I F"),
    ("MMSI", "M M S I"),
    ("DSC", "D S C"),
]


def spoken_en(text: str) -> str:
    out = text
    for a, b in EN_PHRASE:
        out = re.sub(re.escape(a), b, out, flags=re.IGNORECASE)
    def cap_name(m: re.Match[str]) -> str:
        w = m.group(0)
        if w in ("MAYDAY", "RELAY", "PAN", "UTC", "ETA", "ETD", "MMSI"):
            return w
        if len(w) >= 3:
            return w.title()
        return w
    out = re.sub(r"\b[A-Z]{3,}\b", cap_name, out)
    # isolated known abbreviations
    def abbr(m: re.Match[str]) -> str:
        w = m.group(0)
        return EN_WORD.get(w, EN_WORD.get(w.upper(), w))
    out = re.sub(r"\b(" + "|".join(sorted(EN_WORD, key=len, reverse=True)) + r")\b", abbr, out, flags=re.IGNORECASE)
    # light pauses after sentence ends already present; add a comma after repeated names
    out = re.sub(r" {2,}", " ", out)
    return out.strip()


def spoken_de(text: str) -> str:
    out = text
    for a, b in DE_PHRASE:
        out = re.sub(rf"\b{re.escape(a)}\b", b, out)
    return out.strip()


def spoken_vocab(en: str) -> str:
    key = en.strip()
    if key in EN_WORD:
        return EN_WORD[key]
    upper = key.upper()
    for a, b in EN_PHRASE:
        if upper == a:
            return b
        if upper.startswith(a + " "):
            return b + spoken_vocab(key[len(a):])
    # "channel sixteen" etc. stay as-is; Title-case all-caps tokens
    return spoken_en(key)


def trim(audio: np.ndarray, sr: int, pad_ms: int = 80) -> np.ndarray:
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
    fade = min(int(sr * 0.012), max(1, len(out) // 20))
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
    start = proc.stdout.rfind("{")
    end = proc.stdout.rfind("}")
    if start < 0 or end <= start:
        return {}
    try:
        data = json.loads(proc.stdout[start : end + 1])
    except json.JSONDecodeError:
        return {}
    keys = ("input_i", "input_tp", "input_lra", "input_thresh", "target_offset")
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


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    out: list[str] = []
    buf = ""
    for p in parts:
        p = p.strip()
        if not p:
            continue
        if len(buf) + len(p) < 220:
            buf = (buf + " " + p).strip()
        else:
            if buf:
                out.append(buf)
            buf = p
    if buf:
        out.append(buf)
    return out or [text]


def concat(chunks: list[np.ndarray], sr: int, gap_ms: int) -> np.ndarray:
    gap = np.zeros(int(sr * gap_ms / 1000), dtype=np.float32)
    parts: list[np.ndarray] = []
    for i, c in enumerate(chunks):
        a = np.asarray(c, dtype=np.float32)
        if a.ndim > 1:
            a = a.mean(axis=1).astype(np.float32)
        parts.append(a)
        if i < len(chunks) - 1:
            parts.append(gap)
    return np.concatenate(parts) if parts else np.zeros(1, dtype=np.float32)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="", help="comma-separated ids, or 'dict' / 'vocab'")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()

    if not MODEL.exists() or not VOICES.exists():
        print("Missing Kokoro model files", MODEL, VOICES, file=sys.stderr)
        return 1
    if not PIPER_MODEL.exists():
        print("Missing Piper German model", PIPER_MODEL, file=sys.stderr)
        return 1

    from kokoro_onnx import Kokoro
    from piper import PiperVoice
    from piper.config import SynthesisConfig

    k = Kokoro(str(MODEL), str(VOICES))
    lang = "en-gb" if VOICE.startswith("b") else "en-us"
    piper = PiperVoice.load(str(PIPER_MODEL))
    WAV.mkdir(parents=True, exist_ok=True)
    DICT_OUT.mkdir(parents=True, exist_ok=True)
    VOCAB_OUT.mkdir(parents=True, exist_ok=True)
    manifest: list[dict] = []

    def write_clip(file_stem: str, out_dir: Path, text: str, spoken: str, audio: np.ndarray, sr: int, engine: str) -> dict | None:
        audio = trim(np.asarray(audio, dtype=np.float32), sr)
        dur = float(len(audio) / sr) if sr else 0.0
        rms = float(np.sqrt(np.mean(np.square(audio)))) if len(audio) else 0.0
        wav = WAV / f"{file_stem}.wav"
        sf.write(wav, audio, sr)
        mp3 = out_dir / f"{file_stem}.mp3"
        encode_mp3(wav, mp3)
        rec = {
            "file": f"{out_dir.name}/{file_stem}.mp3" if False else str(mp3.relative_to(ROOT / "public")),
            "text": text,
            "spoken": spoken,
            "engine": engine,
            "duration_s": round(dur, 3),
            "rms": round(rms, 4),
            "bytes": mp3.stat().st_size,
        }
        manifest.append(rec)
        flag = "OK" if dur >= 0.18 and rms >= 0.008 else "WARN"
        print(f"{flag} {file_stem:36} {dur:6.2f}s rms={rms:.3f} {mp3.stat().st_size:6d}B", flush=True)
        return rec

    def synth_en(text: str, speed: float) -> tuple[np.ndarray, int]:
        chunks: list[np.ndarray] = []
        sr = SR_EN
        for sent in split_sentences(text):
            audio, sr = k.create(sent, voice=VOICE, speed=speed, lang=lang)
            chunks.append(np.asarray(audio, dtype=np.float32))
        gap = 380 if speed < 0.95 else 220
        return concat(chunks, sr, gap), sr

    def synth_de(text: str, length_scale: float) -> tuple[np.ndarray, int]:
        chunks: list[np.ndarray] = []
        sr = 22050
        cfg = SynthesisConfig(length_scale=length_scale)
        for i, sent in enumerate(split_sentences(text)):
            raw = WAV / f"piper-chunk-{i}.wav"
            with wave.open(str(raw), "wb") as wf:
                piper.synthesize_wav(sent, wf, syn_config=cfg)
            audio, sr = sf.read(raw, dtype="float32")
            chunks.append(np.asarray(audio, dtype=np.float32))
        gap = 400 if length_scale > 1.05 else 240
        return concat(chunks, sr, gap), sr

    only = {x.strip() for x in args.only.split(",") if x.strip()}
    want_dict = (not only) or ("dict" in only) or any(d["id"] in only for d in DICTATIONS)
    want_vocab = (not only) or ("vocab" in only) or any(v["id"] in only for v in VOCAB)

    n_done = 0

    def skip(path: Path) -> bool:
        return path.exists() and path.stat().st_size > 400 and not args.force

    if want_dict:
        for d in DICTATIONS:
            if only and "dict" not in only and d["id"] not in only:
                continue
            if d.get("kind") != "listen":
                continue
            for speed_tag, en_speed, de_len in (("n", 1.0, 1.0), ("s", 0.8, 1.25)):
                stem = f"{d['id']}-{speed_tag}"
                mp3 = DICT_OUT / f"{stem}.mp3"
                if skip(mp3):
                    print(f"SKIP {stem}", flush=True)
                    continue
                if d["cert"] == "SRC":
                    spoken = spoken_en(d["en"])
                    audio, sr = synth_en(spoken, en_speed)
                    engine = f"Kokoro-82M/{VOICE}@{en_speed}"
                    write_clip(stem, DICT_OUT, d["en"], spoken, audio, sr, engine)
                else:
                    spoken = spoken_de(d["de"])
                    audio, sr = synth_de(spoken, de_len)
                    engine = f"Piper de_DE-thorsten-medium@{de_len}"
                    write_clip(stem, DICT_OUT, d["de"], spoken, audio, sr, engine)
                n_done += 1
                if args.limit and n_done >= args.limit:
                    break
            if args.limit and n_done >= args.limit:
                break

    if want_vocab and not (args.limit and n_done >= args.limit):
        for v in VOCAB:
            if only and "vocab" not in only and v["id"] not in only:
                continue
            stem = v["id"]
            mp3 = VOCAB_OUT / f"{stem}.mp3"
            if skip(mp3):
                print(f"SKIP {stem}", flush=True)
                continue
            spoken = spoken_vocab(v["en"])
            audio, sr = synth_en(spoken, 1.0)
            write_clip(stem, VOCAB_OUT, v["en"], spoken, audio, sr, f"Kokoro-82M/{VOICE}@1.0")
            n_done += 1
            if args.limit and n_done >= args.limit:
                break

    man_path = WAV / "manifest.json"
    man_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    # also write a combined size report for files on disk
    def folder_stats(p: Path) -> tuple[int, int]:
        files = list(p.glob("*.mp3"))
        return len(files), sum(f.stat().st_size for f in files)
    dn, db = folder_stats(DICT_OUT)
    vn, vb = folder_stats(VOCAB_OUT)
    print(f"NEW this run: {len(manifest)} clips")
    print(f"DICT on disk: {dn} files, {db} bytes ({db/1024/1024:.2f} MiB)")
    print(f"VOCAB on disk: {vn} files, {vb} bytes ({vb/1024/1024:.2f} MiB)")
    print(f"TOTAL audio: {dn+vn} files, {db+vb} bytes ({(db+vb)/1024/1024:.2f} MiB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
