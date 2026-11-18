/** Versioned media folders so a new voice cannot be served from an old SW/HTTP cache. */
export const SPELL_CLIP_DIR = "media/spell/v3/";
export const DICT_CLIP_DIR = "media/dict/v1/";
export const VOCAB_CLIP_DIR = "media/vocab/v1/";

export function mediaUrl(rel: string): string {
  const base = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) ? String(import.meta.env.BASE_URL) : "./";
  const prefix = base.endsWith("/") ? base : base + "/";
  const path = rel.replace(/^\//, "");
  return new URL(prefix + path, typeof document !== "undefined" ? document.baseURI : prefix).href;
}

export function spellClipUrl(file: string): string {
  return mediaUrl(SPELL_CLIP_DIR + file);
}

let clipAudio: HTMLAudioElement | null = null;
let clipOnEnd: (() => void) | null = null;
let clipSeqTimer: number | null = null;
let audioUnlocked = false;

function getClipAudio(): HTMLAudioElement | null {
  if (typeof document === "undefined") return null;
  if (clipAudio && clipAudio.isConnected) return clipAudio;
  const a = document.createElement("audio");
  a.setAttribute("data-spell-audio", "1");
  a.preload = "auto";
  (a as any).playsInline = true;
  a.style.display = "none";
  document.body.appendChild(a);
  clipAudio = a;
  return a;
}

export function stopClip(): void {
  if (clipSeqTimer != null) {
    window.clearTimeout(clipSeqTimer);
    clipSeqTimer = null;
  }
  clipOnEnd = null;
  if (!clipAudio) return;
  try {
    clipAudio.onended = null;
    clipAudio.onerror = null;
    clipAudio.pause();
    clipAudio.removeAttribute("src");
    clipAudio.load();
  } catch (_e) {
    /* */
  }
}

export function unlockAudio(): void {
  if (audioUnlocked) return;
  audioUnlocked = true;
  const a = getClipAudio();
  if (!a) return;
  try {
    const unlockSrc = spellClipUrl("p-6.mp3");
    a.muted = true;
    a.src = unlockSrc;
    const finish = () => {
      if (a.muted && (a.getAttribute("src") === unlockSrc || /p-6\.mp3(?:\?|$)/.test(a.src || ""))) {
        try { a.pause(); a.currentTime = 0; } catch (_e) { /* */ }
      }
      try { a.muted = false; } catch (_e) { /* */ }
    };
    const p = a.play();
    if (p && typeof p.then === "function") p.then(finish).catch(finish);
    else finish();
  } catch (_e) {
    try { a.muted = false; } catch (_e2) { /* */ }
  }
}

export function playMedia(rel: string, onEnd?: () => void): Promise<"ok" | "fail"> {
  const a = getClipAudio();
  if (!a) return Promise.resolve("fail");
  stopClip();
  return new Promise((resolve) => {
    let settled = false;
    const finish = (res: "ok" | "fail") => {
      if (settled) return;
      settled = true;
      resolve(res);
    };
    clipOnEnd = onEnd || null;
    a.muted = false;
    a.src = mediaUrl(rel);
    a.onended = () => {
      a.onended = null;
      a.onerror = null;
      const cb = clipOnEnd;
      clipOnEnd = null;
      if (cb) cb();
    };
    a.onerror = () => {
      a.onended = null;
      a.onerror = null;
      finish("fail");
    };
    try {
      const p = a.play();
      if (p && typeof p.then === "function") p.then(() => finish("ok")).catch(() => finish("fail"));
      else finish("ok");
    } catch (_e) {
      finish("fail");
    }
  });
}

export function playClip(file: string, onEnd?: () => void): Promise<"ok" | "fail"> {
  return playMedia(SPELL_CLIP_DIR + file, onEnd);
}

export function playClipSeq(files: string[], onEnd?: () => void, onFail?: () => void): void {
  if (files.length === 0) {
    if (onFail) onFail();
    return;
  }
  const next = (i: number) => {
    if (i >= files.length) {
      if (onEnd) onEnd();
      return;
    }
    playClip(files[i], () => {
      clipSeqTimer = window.setTimeout(() => next(i + 1), 120);
    }).then((res) => {
      if (res !== "ok") {
        if (i === 0 && onFail) onFail();
        else if (onEnd) onEnd();
      }
    });
  };
  next(0);
}

export function playDictation(id: string, speed: "n" | "s", onEnd?: () => void): Promise<"ok" | "fail"> {
  return playMedia(DICT_CLIP_DIR + id + "-" + speed + ".mp3", onEnd);
}

export function playVocabClip(id: string, onEnd?: () => void): Promise<"ok" | "fail"> {
  return playMedia(VOCAB_CLIP_DIR + id + ".mp3", onEnd);
}
