import data from "./vocab.json";
import type { VocabEntry, VocabTopic } from "./types";

type FileShape = { topics: VocabTopic[]; entries: VocabEntry[] };
const file = data as FileShape;

export const VOCAB_TOPICS: VocabTopic[] = file.topics.slice().sort((a, b) => a.order - b.order);
export const VOCAB: VocabEntry[] = file.entries;

export function vocabInTopic(topicId: string): VocabEntry[] {
  return VOCAB.filter((v) => v.topic === topicId);
}

export function vocabById(id: string): VocabEntry | undefined {
  return VOCAB.find((v) => v.id === id);
}

export const VOCAB_SOURCES =
  "Eigene Auswahl gebräuchlicher Seefunk- und SMCP-Wendungen mit deutschen Entsprechungen, angelehnt an IMO Standard Marine Communication Phrases und die Betriebsverfahren der ITU-VO Funk. Keine Übernahme fremder Vokabellisten.";
