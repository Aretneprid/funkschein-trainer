import type { DictProgress, Star, VocabProgress } from "./types";

export const DICT_STORE = "funkschein-trainer-dict-v1";
export const VOCAB_STORE = "funkschein-trainer-vocab-v1";

function read<T>(key: string): Record<string, T> {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const d = JSON.parse(raw);
    return d && typeof d === "object" ? d as Record<string, T> : {};
  } catch (_e) {
    return {};
  }
}

function write<T>(key: string, val: Record<string, T>): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch (_e) {
    /* quota / private mode */
  }
}

export function loadDictProg(): Record<string, DictProgress> {
  return read<DictProgress>(DICT_STORE);
}

export function saveDictProg(all: Record<string, DictProgress>): void {
  write(DICT_STORE, all);
}

export function patchDict(id: string, patch: Partial<DictProgress>): Record<string, DictProgress> {
  const all = loadDictProg();
  all[id] = { ...(all[id] || {}), ...patch };
  saveDictProg(all);
  return all;
}

export function loadVocabProg(): Record<string, VocabProgress> {
  return read<VocabProgress>(VOCAB_STORE);
}

export function saveVocabProg(all: Record<string, VocabProgress>): void {
  write(VOCAB_STORE, all);
}

export function patchVocab(id: string, patch: Partial<VocabProgress>): Record<string, VocabProgress> {
  const all = loadVocabProg();
  all[id] = { ...(all[id] || {}), ...patch };
  saveVocabProg(all);
  return all;
}

export function recordVocabAnswer(id: string, correct: boolean): Record<string, VocabProgress> {
  const all = loadVocabProg();
  const cur = all[id] || {};
  const seen = (cur.seen || 0) + 1;
  const ok = (cur.ok || 0) + (correct ? 1 : 0);
  const bad = (cur.bad || 0) + (correct ? 0 : 1);
  const weak = bad >= ok && seen >= 1;
  let stars: Star | undefined = cur.stars;
  if (correct && (stars === undefined || stars === 1)) stars = 3;
  if (correct && ok >= 3 && bad === 0) stars = 5;
  if (!correct) stars = 1;
  all[id] = { ...cur, seen, ok, bad, weak, stars };
  saveVocabProg(all);
  return all;
}

export const STARS: Star[] = [1, 3, 5];

export function starLabel(s: Star | undefined): string {
  if (s === 5) return "sicher";
  if (s === 3) return "geht so";
  if (s === 1) return "noch unsicher";
  return "ohne Bewertung";
}
