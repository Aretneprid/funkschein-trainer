import data from "./dictations.json";
import type { Dictation } from "./types";

export const DICTATIONS: Dictation[] = data as Dictation[];

export function dictationsFor(cert: "SRC" | "UBI"): Dictation[] {
  return DICTATIONS.filter((d) => d.cert === cert);
}

export function dictationById(id: string): Dictation | undefined {
  return DICTATIONS.find((d) => d.id === id);
}

export const DICT_SOURCES =
  "Texte eigens formuliert für diese App (keine amtlichen Seefunktexte und keine fremden Kursinhalte). Verfahren nach ITU-VO Funk, IMO SMCP und Sprechfunktafel; Prüfungsform nach ELWIS Durchführungsrichtlinien Funkbetriebszeugnisse bzw. ABVT / BinSchSprFunkV.";
