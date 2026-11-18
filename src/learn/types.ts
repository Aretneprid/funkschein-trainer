export type Cert = "SRC" | "UBI";

export type DictationKind = "listen" | "translate";

export type Dictation = {
  id: string;
  cert: Cert;
  kind: DictationKind;
  topic: string;
  title: string;
  en?: string;
  de: string;
};

export type VocabTopic = { id: string; title: string; order: number };

export type VocabEntry = {
  id: string;
  topic: string;
  en: string;
  de: string;
  hint?: string;
};

export type Star = 1 | 3 | 5;

export type DictProgress = {
  stars?: Star;
  transcript?: string;
  translation?: string;
};

export type VocabProgress = {
  stars?: Star;
  seen?: number;
  ok?: number;
  bad?: number;
  weak?: boolean;
};

export type BookSection = {
  id: string;
  title: string;
  paras: string[];
  source?: string;
  lesson?: string;
  certHint?: "SRC" | "UBI";
};

export type BookChapter = {
  id: string;
  title: string;
  cert: Cert | "BOTH";
  teaser: string;
  sections: BookSection[];
};
