import {
  Button,
  Callout,
  Input,
  Segmented,
  Status,
  useEffect,
  useGrokTheme,
  useMemo,
  useState,
} from "../canvas";
import type { CSSProperties, ReactNode } from "../canvas";
import { unlockAudio, playDictation, playVocabClip, stopClip } from "../mediaAudio";
import { DICT_SOURCES, dictationById, dictationsFor } from "./dictations";
import { VOCAB, VOCAB_SOURCES, VOCAB_TOPICS, vocabInTopic } from "./vocab";
import { chaptersFor, chapterById, allIndex, searchBook } from "./handbook";
import { wordDiff, typedMatches } from "./diff";
import {
  STARS,
  loadDictProg,
  patchDict,
  loadVocabProg,
  patchVocab,
  recordVocabAnswer,
  starLabel,
} from "./progress";
import type { Cert, Dictation, Star, VocabEntry } from "./types";

function txt(t: ReturnType<typeof useGrokTheme>, style: "heading3" | "body1" | "body2" | "subtext" | "label", color: string, weight?: number): CSSProperties {
  const base = style === "heading3" ? t.font.heading3 : style === "body1" ? t.font.body1 : style === "body2" ? t.font.body2 : style === "label" ? t.font.label : t.font.subtext;
  return { fontFamily: t.font.family, ...base, color, fontWeight: weight };
}

function card(t: ReturnType<typeof useGrokTheme>, children: ReactNode, extra?: CSSProperties): ReactNode {
  return (
    <div style={{ background: t.bg.elevated, border: "1px solid " + t.border.default, borderRadius: t.radius.lg, padding: 12, display: "flex", flexDirection: "column", gap: 8, ...extra }}>
      {children}
    </div>
  );
}

function Area({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 0 32px" }}>{children}</div>;
}

function StarRow({ value, onChange, label }: { value?: Star; onChange: (s: Star) => void; label?: string }) {
  const t = useGrokTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label ? <span style={txt(t, "label", t.text.secondary)}>{label}</span> : null}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {STARS.map((s) => (
          <Button key={s} label={s === 1 ? "★" : s === 3 ? "★★★" : "★★★★★"} variant={value === s ? "primary" : undefined} onClick={() => onChange(s)} />
        ))}
      </div>
      <span style={txt(t, "subtext", t.text.tertiary)}>{starLabel(value)}</span>
    </div>
  );
}

function AreaBox({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
  const t = useGrokTheme();
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={txt(t, "label", t.text.secondary)}>{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          try { e.currentTarget.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (_e) { /* */ }
        }}
        style={{
          fontFamily: t.font.family,
          ...t.font.body2,
          color: t.text.primary,
          background: t.bg.elevated,
          border: "1px solid " + t.border.default,
          borderRadius: t.radius.md,
          padding: "10px 12px",
          minHeight: rows * 22 + 24,
          width: "100%",
          boxSizing: "border-box",
          resize: "vertical",
        }}
      />
    </label>
  );
}

function DiffView({ user, model }: { user: string; model: string }) {
  const t = useGrokTheme();
  const marks = useMemo(() => wordDiff(user, model), [user, model]);
  if (!user.trim()) return null;
  return (
    <p style={{ ...txt(t, "body2", t.text.primary), lineHeight: 1.55, margin: 0 }}>
      {marks.map((m, i) => {
        const color = m.k === "ok" ? t.text.success : m.k === "miss" ? t.text.danger : t.text.warning;
        const deco = m.k === "miss" ? "underline dashed" : m.k === "extra" ? "line-through" : "none";
        return (
          <span key={i} style={{ color, textDecoration: deco, marginRight: 4 }}>
            {m.t}
          </span>
        );
      })}
    </p>
  );
}

/* ---------------- Hördiktate ---------------- */

export function DictationHome({ cert, ubiKind, onOpen }: { cert: Cert; ubiKind?: "voll" | "ergaenzung" | null; onOpen: (id: string) => void }) {
  const t = useGrokTheme();
  const list = dictationsFor(cert);
  const [prog, setProg] = useState(loadDictProg);
  useEffect(() => { setProg(loadDictProg()); }, [cert]);
  const listen = list.filter((d) => d.kind === "listen");
  const trans = list.filter((d) => d.kind === "translate");
  const rated = list.filter((d) => prog[d.id]?.stars).length;

  const group = (items: Dictation[], heading: string, sub: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div>
        <div style={txt(t, "heading3", t.text.primary, t.weight.semibold)}>{heading}</div>
        <div style={txt(t, "subtext", t.text.secondary)}>{sub}</div>
      </div>
      {items.map((d) => {
        const st = prog[d.id]?.stars;
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => onOpen(d.id)}
            style={{
              textAlign: "left",
              background: t.bg.elevated,
              color: t.text.primary,
              border: "1px solid " + t.border.default,
              borderRadius: t.radius.lg,
              padding: "12px 14px",
              minHeight: 56,
              cursor: "pointer",
              fontFamily: t.font.family,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span style={txt(t, "body1", t.text.primary, t.weight.semibold)}>{d.title}</span>
            <span style={txt(t, "subtext", t.text.secondary)}>{d.topic}{st ? " · " + starLabel(st) : ""}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <Area>
      <Callout lead="Prüfungsform" tone="info">
        {cert === "SRC"
          ? "Amtlicher SRC-Sprachteil (Theorie, ELWIS Durchführungsrichtlinien § 5.2 / 6.2.1): einen englischen Funkspruch aufnehmen und ins Deutsche übersetzen (15 Min.), danach einen deutschen Seefunktext schriftlich ins Englische übertragen (15 Min.). Phonetik erlaubt; ohne Hilfsmittel."
          : "UBI-Vollprüfung (ABVT): praktische Textaufnahme (deutscher Text wird vorgelesen, Namen werden buchstabiert) und Textabgabe. Die Übungen hier trainieren die Textaufnahme."}
      </Callout>
      {cert === "UBI" && ubiKind === "ergaenzung" ? (
        <Callout lead="Ergänzungsprüfung" tone="warning">
          Wer bereits SRC, LRC, ROC, GOC oder UBZ besitzt, hat laut VkBl. 2003 S. 97 bzw. BinSchSprFunkV Anlage 4 Nr. 5 im praktischen Teil der Ergänzungsprüfung keinen eigenen Abschnitt Textaufnahme/Textabgabe. Die Texte bleiben als Übung für die Vollprüfung sinnvoll.
        </Callout>
      ) : null}
      <span style={txt(t, "subtext", t.text.tertiary)}>{rated} von {list.length} bewertet · {DICT_SOURCES}</span>
      {group(listen, cert === "SRC" ? "Hören und übersetzen (Englisch → Deutsch)" : "Textaufnahme (Deutsch)", cert === "SRC" ? "Audio in Normalgeschwindigkeit und langsamer, dann Mitschrift und Übersetzung." : "Thorsten-Stimme, Normal- und Langsamfassung, dann Mitschrift.")}
      {trans.length ? group(trans, "Schriftlich Deutsch → Englisch", "Wie im zweiten Teil des amtlichen Sprachteils: ohne Audio den deutschen Text ins Englische übertragen.") : null}
    </Area>
  );
}

export function DictationItem({ id, onPlayed }: { id: string; onPlayed?: () => void }) {
  const t = useGrokTheme();
  const d = dictationById(id);
  const [prog, setProg] = useState(loadDictProg);
  const rec = prog[id] || {};
  const [transcript, setTranscript] = useState(rec.transcript || "");
  const [translation, setTranslation] = useState(rec.translation || "");
  const [reveal, setReveal] = useState(false);
  const [playing, setPlaying] = useState<"n" | "s" | "">("");
  const [audioFail, setAudioFail] = useState(false);

  useEffect(() => {
    const p = loadDictProg()[id] || {};
    setTranscript(p.transcript || "");
    setTranslation(p.translation || "");
    setReveal(false);
    setPlaying("");
    setAudioFail(false);
    return () => { stopClip(); };
  }, [id]);

  if (!d) return <Status tone="danger">Dieser Text ist nicht vorhanden.</Status>;

  const isListen = d.kind === "listen";
  const modelIn = isListen ? (d.cert === "SRC" ? d.en || "" : d.de) : d.de;
  const modelOut = d.cert === "SRC" ? (isListen ? d.de : d.en || "") : "";
  const compareAgainst = isListen ? modelIn : (d.en || "");
  const userCompare = isListen ? transcript : translation;

  const play = (speed: "n" | "s") => {
    unlockAudio();
    setAudioFail(false);
    setPlaying(speed);
    playDictation(d.id, speed, () => setPlaying("")).then((res) => {
      if (res !== "ok") {
        setPlaying("");
        setAudioFail(true);
      } else if (onPlayed) onPlayed();
    });
  };

  const persist = (patch: { transcript?: string; translation?: string; stars?: Star }) => {
    setProg(patchDict(d.id, patch));
  };

  return (
    <Area>
      {isListen ? (
        card(t, <>
          <span style={txt(t, "label", t.text.secondary)}>Audio</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Button label={playing === "n" ? "Spielt …" : "Normale Geschwindigkeit"} variant="primary" onClick={() => play("n")} />
            <Button label={playing === "s" ? "Spielt …" : "Langsamer"} onClick={() => play("s")} />
            {playing ? <Button label="Stopp" variant="quiet" onClick={() => { stopClip(); setPlaying(""); }} /> : null}
          </div>
          {audioFail ? <Status tone="warning">Audio konnte nicht geladen werden. Datei später erneut versuchen oder App aktualisieren.</Status> : null}
          <span style={txt(t, "subtext", t.text.tertiary)}>{d.cert === "SRC" ? "Stimme: bm_daniel (en-GB), klare Normalsprache." : "Stimme: Thorsten (Deutsch), klare Normalsprache."}</span>
        </>)
      ) : (
        card(t, <span style={txt(t, "body2", t.text.primary)}>{d.de}</span>)
      )}
      {isListen ? (
        <AreaBox label={d.cert === "SRC" ? "Mitschrift (Englisch)" : "Mitschrift (Deutsch)"} value={transcript} onChange={(v) => { setTranscript(v); persist({ transcript: v }); }} rows={6} />
      ) : null}
      {d.cert === "SRC" ? (
        <AreaBox
          label={isListen ? "Übersetzung ins Deutsche" : "Übersetzung ins Englische"}
          value={translation}
          onChange={(v) => { setTranslation(v); persist({ translation: v }); }}
          rows={6}
        />
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button label={reveal ? "Musterlösung verbergen" : "Musterlösung zeigen"} variant="primary" onClick={() => setReveal(!reveal)} />
      </div>
      {reveal ? card(t, <>
        {isListen ? (
          <>
            <span style={txt(t, "label", t.text.secondary)}>Muster-Mitschrift</span>
            <span style={txt(t, "body2", t.text.primary)}>{modelIn}</span>
            {userCompare.trim() ? (
              <>
                <span style={txt(t, "label", t.text.secondary)}>Vergleich der Mitschrift (Wortvergleich)</span>
                <DiffView user={userCompare} model={compareAgainst} />
                <span style={txt(t, "subtext", t.text.tertiary)}>Grün: getroffen · Rot unterstrichen: gefehlt · Gelb durchgestrichen: zusätzlich</span>
              </>
            ) : null}
          </>
        ) : null}
        {d.cert === "SRC" && modelOut ? (
          <>
            <span style={txt(t, "label", t.text.secondary)}>{isListen ? "Muster-Übersetzung (Deutsch)" : "Muster-Übersetzung (Englisch)"}</span>
            <span style={txt(t, "body2", t.text.primary)}>{modelOut}</span>
            {!isListen && translation.trim() ? (
              <>
                <span style={txt(t, "label", t.text.secondary)}>Vergleich der Übersetzung</span>
                <DiffView user={translation} model={modelOut} />
              </>
            ) : null}
          </>
        ) : null}
      </>) : null}
      <StarRow label="Eigene Bewertung" value={rec.stars} onChange={(s) => persist({ stars: s })} />
      <span style={txt(t, "subtext", t.text.tertiary)}>{DICT_SOURCES}</span>
    </Area>
  );
}

/* ---------------- Vokabeln ---------------- */

export function VocabHome({ onOpen, onQuiz }: { onOpen: (topic: string) => void; onQuiz: (topic: string) => void }) {
  const t = useGrokTheme();
  const [prog, setProg] = useState(loadVocabProg);
  useEffect(() => { setProg(loadVocabProg()); }, []);
  return (
    <Area>
      <Callout lead="SRC-Sprachteil" tone="info">
        Thematischer Wortschatz für den englischen Seefunk, zum Durchsehen und als Quiz in beide Richtungen. Tippe auf das Lautsprecher-Zeichen, um die englische Aussprache zu hören (gebündelte Aufnahme, normale Geschwindigkeit).
      </Callout>
      <span style={txt(t, "subtext", t.text.tertiary)}>{VOCAB.length} Einträge in {VOCAB_TOPICS.length} Themen · {VOCAB_SOURCES}</span>
      {VOCAB_TOPICS.map((tp) => {
        const entries = vocabInTopic(tp.id);
        const rated = entries.filter((e) => prog[e.id]?.stars);
        const weak = entries.filter((e) => prog[e.id]?.weak || prog[e.id]?.stars === 1);
        const avg = rated.length ? rated.reduce((s, e) => s + (prog[e.id].stars || 0), 0) / rated.length : 0;
        return (
          <div key={tp.id} style={{ background: t.bg.elevated, border: "1px solid " + t.border.default, borderRadius: t.radius.lg, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div>
              <div style={txt(t, "body1", t.text.primary, t.weight.semibold)}>{tp.title}</div>
              <div style={txt(t, "subtext", t.text.secondary)}>
                {entries.length} Wörter · {rated.length} bewertet{rated.length ? " · Schnitt " + avg.toFixed(1) + " ★" : ""}{weak.length ? " · " + weak.length + " schwach" : ""}
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Button label="Liste" onClick={() => onOpen(tp.id)} />
              <Button label="Quiz" variant="primary" onClick={() => onQuiz(tp.id)} />
            </div>
          </div>
        );
      })}
    </Area>
  );
}

function Hear({ id }: { id: string }) {
  const [fail, setFail] = useState(false);
  return (
    <Button
      label={fail ? "Kein Audio" : "▶︎ EN"}
      variant="quiet"
      onClick={() => {
        unlockAudio();
        setFail(false);
        playVocabClip(id).then((res) => { if (res !== "ok") setFail(true); });
      }}
    />
  );
}

export function VocabBrowse({ topicId, onQuiz }: { topicId: string; onQuiz: () => void }) {
  const t = useGrokTheme();
  const topic = VOCAB_TOPICS.find((x) => x.id === topicId);
  const entries = vocabInTopic(topicId);
  const [prog, setProg] = useState(loadVocabProg);
  const [onlyWeak, setOnlyWeak] = useState(false);
  const shown = onlyWeak ? entries.filter((e) => prog[e.id]?.weak || prog[e.id]?.stars === 1) : entries;
  if (!topic) return <Status tone="danger">Thema nicht gefunden.</Status>;
  return (
    <Area>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button label="Quiz zu diesem Thema" variant="primary" onClick={onQuiz} />
        <Button label={onlyWeak ? "Alle zeigen" : "Nur schwache"} onClick={() => setOnlyWeak(!onlyWeak)} />
      </div>
      {shown.map((e) => (
        <div key={e.id} style={{ background: t.bg.elevated, border: "1px solid " + t.border.default, borderRadius: t.radius.md, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={txt(t, "body1", t.text.primary, t.weight.semibold)}>{e.en}</span>
            <Hear id={e.id} />
          </div>
          <span style={txt(t, "body2", t.text.secondary)}>{e.de}</span>
          {e.hint ? <span style={txt(t, "subtext", t.text.tertiary)}>{e.hint}</span> : null}
          <StarRow value={prog[e.id]?.stars} onChange={(s) => setProg(patchVocab(e.id, { stars: s, weak: s === 1 }))} />
        </div>
      ))}
      {shown.length === 0 ? <Status tone="neutral">Keine schwachen Wörter in diesem Thema.</Status> : null}
    </Area>
  );
}

export function VocabQuiz({ topicId }: { topicId: string }) {
  const t = useGrokTheme();
  const topic = VOCAB_TOPICS.find((x) => x.id === topicId);
  const pool = vocabInTopic(topicId);
  const [dir, setDir] = useState<"en-de" | "de-en">("en-de");
  const [mode, setMode] = useState<"mc" | "type">("mc");
  const [queue, setQueue] = useState<VocabEntry[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [okCount, setOkCount] = useState(0);
  const [done, setDone] = useState(false);
  const [choices, setChoices] = useState<string[]>([]);

  const shuffle = (list: VocabEntry[]) => list.slice().sort(() => Math.random() - 0.5);

  const start = (d = dir, m = mode) => {
    const q = shuffle(pool).slice(0, Math.min(10, pool.length));
    setQueue(q);
    setI(0);
    setPicked(null);
    setTyped("");
    setOkCount(0);
    setDone(false);
    if (q[0]) setChoices(makeChoices(q[0], d, pool));
  };

  useEffect(() => { start(); }, [topicId]);

  const cur = queue[i];
  const prompt = cur ? (dir === "en-de" ? cur.en : cur.de) : "";
  const expected = cur ? (dir === "en-de" ? cur.de : cur.en) : "";

  const finishAnswer = (correct: boolean) => {
    if (!cur) return;
    recordVocabAnswer(cur.id, correct);
    if (correct) setOkCount((n) => n + 1);
  };

  const goNext = () => {
    if (i + 1 >= queue.length) setDone(true);
    else {
      const n = i + 1;
      setI(n);
      setPicked(null);
      setTyped("");
      setChoices(makeChoices(queue[n], dir, pool));
    }
  };

  if (!topic) return <Status tone="danger">Thema nicht gefunden.</Status>;
  if (!cur && !done) return <Status tone="neutral">Quiz wird vorbereitet …</Status>;

  if (done) {
    return (
      <Area>
        <div style={txt(t, "heading3", t.text.primary, t.weight.semibold)}>Runde beendet</div>
        <Status tone={okCount >= Math.ceil(queue.length * 0.8) ? "success" : "warning"}>{okCount} von {queue.length} richtig in „{topic.title}“.</Status>
        <Button label="Noch eine Runde" variant="primary" onClick={() => start()} />
      </Area>
    );
  }

  const revealed = mode === "mc" ? picked !== null : picked !== null;

  return (
    <Area>
      <div style={txt(t, "subtext", t.text.secondary)}>Frage {i + 1} von {queue.length} · {okCount} richtig</div>
      <Segmented options={[{ value: "en-de" as const, label: "EN → DE" }, { value: "de-en" as const, label: "DE → EN" }]} value={dir} onChange={(v) => { setDir(v); start(v, mode); }} />
      <Segmented options={[{ value: "mc" as const, label: "Auswahl" }, { value: "type" as const, label: "Tippen" }]} value={mode} onChange={(v) => { setMode(v); start(dir, v); }} />
      {card(t, <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={txt(t, "body1", t.text.primary, t.weight.semibold)}>{prompt}</span>
          {dir === "en-de" && cur ? <Hear id={cur.id} /> : null}
        </div>
        {dir === "de-en" && cur ? <Hear id={cur.id} /> : null}
      </>)}
      {mode === "mc" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {choices.map((c) => {
            const isAns = c === expected;
            const show = picked !== null;
            const tone = show && isAns ? t.fill.successSubtle : show && c === picked && !isAns ? t.fill.dangerSubtle : t.bg.elevated;
            return (
              <button
                key={c}
                type="button"
                disabled={picked !== null}
                onClick={() => {
                  setPicked(c);
                  finishAnswer(c === expected);
                }}
                style={{
                  textAlign: "left",
                  minHeight: 44,
                  padding: "10px 12px",
                  borderRadius: t.radius.md,
                  border: "1px solid " + t.border.default,
                  background: tone,
                  color: t.text.primary,
                  fontFamily: t.font.family,
                  ...t.font.body2,
                  cursor: picked ? "default" : "pointer",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <Input label="Antwort" value={typed} onChange={setTyped} placeholder={dir === "en-de" ? "deutsche Entsprechung" : "English term"} />
          {revealed ? (
            <Status tone={typedMatches(typed, expected) ? "success" : "danger"}>
              {typedMatches(typed, expected) ? "Richtig." : "Muster: " + expected}
            </Status>
          ) : (
            <Button
              label="Prüfen"
              variant="primary"
              disabled={!typed.trim()}
              onClick={() => {
                const good = typedMatches(typed, expected);
                setPicked(good ? "ok" : "bad");
                finishAnswer(good);
              }}
            />
          )}
        </>
      )}
      {revealed ? <Button label={i + 1 >= queue.length ? "Auswertung" : "Weiter"} variant="primary" onClick={goNext} /> : null}
    </Area>
  );
}

function makeChoices(item: VocabEntry, dir: "en-de" | "de-en", pool: VocabEntry[]): string[] {
  const correct = dir === "en-de" ? item.de : item.en;
  const others = pool.filter((x) => x.id !== item.id).map((x) => (dir === "en-de" ? x.de : x.en));
  const uniq = Array.from(new Set(others.filter((x) => x !== correct)));
  const pick: string[] = [];
  const copy = uniq.sort(() => Math.random() - 0.5);
  for (const x of copy) {
    if (pick.length >= 3) break;
    pick.push(x);
  }
  return [correct, ...pick].sort(() => Math.random() - 0.5);
}

/* ---------------- Nachschlagebuch ---------------- */

export function HandbookHome({ cert, onOpen }: { cert: Cert; onOpen: (chapterId: string, sectionId?: string) => void }) {
  const t = useGrokTheme();
  const [q, setQ] = useState("");
  const chapters = chaptersFor(cert);
  const hits = useMemo(() => searchBook(cert, q), [cert, q]);
  const index = useMemo(() => allIndex(cert), [cert]);
  const [showIndex, setShowIndex] = useState(false);

  return (
    <Area>
      <span style={txt(t, "subtext", t.text.secondary)}>
        Kurzes Nachschlagewerk zum {cert === "SRC" ? "Seefunk (SRC)" : "Binnenschifffahrtsfunk (UBI)"}. Eigene, knappe Texte; Fakten wie in den Lektionen, mit Quellenangabe.
      </span>
      <Input label="Suche" value={q} onChange={setQ} placeholder="Begriff, z. B. Mayday, ATIS, Kanal 70" />
      {q.trim().length >= 2 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={txt(t, "label", t.text.secondary)}>{hits.length} Treffer</span>
          {hits.map((h, i) => (
            <button
              key={h.chapterId + h.sectionId + i}
              type="button"
              onClick={() => onOpen(h.chapterId, h.sectionId)}
              style={{ textAlign: "left", background: t.bg.elevated, color: t.text.primary, border: "1px solid " + t.border.default, borderRadius: t.radius.md, padding: "10px 12px", cursor: "pointer", fontFamily: t.font.family }}
            >
              <div style={txt(t, "body2", t.text.primary, t.weight.semibold)}>{h.title}</div>
              <div style={txt(t, "subtext", t.text.tertiary)}>{h.chapter}</div>
              <div style={txt(t, "subtext", t.text.secondary)}>{h.snippet}</div>
            </button>
          ))}
          {hits.length === 0 ? <Status tone="neutral">Kein Treffer. Anderes Stichwort versuchen.</Status> : null}
        </div>
      ) : (
        chapters.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onOpen(c.id)}
            style={{ textAlign: "left", background: t.bg.elevated, color: t.text.primary, border: "1px solid " + t.border.default, borderRadius: t.radius.lg, padding: "12px 14px", minHeight: 56, cursor: "pointer", fontFamily: t.font.family, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <span style={txt(t, "body1", t.text.primary, t.weight.semibold)}>{c.title}</span>
            <span style={txt(t, "subtext", t.text.secondary)}>{c.teaser} · {c.sections.length} Abschnitte</span>
          </button>
        ))
      )}
      <Button label={showIndex ? "Index verbergen" : "Index zeigen"} variant="quiet" onClick={() => setShowIndex(!showIndex)} />
      {showIndex ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {index.map((x) => (
            <button key={x.chapterId + x.sectionId} type="button" onClick={() => onOpen(x.chapterId, x.sectionId)} style={{ textAlign: "left", background: "transparent", border: "none", color: t.text.accent, padding: "8px 0", minHeight: 44, cursor: "pointer", fontFamily: t.font.family, ...t.font.body2 }}>
              {x.chapter}: {x.title}
            </button>
          ))}
        </div>
      ) : null}
    </Area>
  );
}

export function HandbookChapterView({ cert, chapterId, sectionId, onLesson }: { cert: Cert; chapterId: string; sectionId?: string; onLesson?: (lessonId: string) => void }) {
  const t = useGrokTheme();
  const ch = chapterById(chapterId, cert);
  useEffect(() => {
    if (!sectionId) return;
    const el = document.getElementById("book-" + sectionId);
    if (el) el.scrollIntoView({ block: "start" });
  }, [chapterId, sectionId]);
  if (!ch) return <Status tone="warning">Dieses Kapitel gehört zum anderen Zeugnis. Oben SRC oder UBI wählen oder zurück zum Inhaltsverzeichnis.</Status>;
  return (
    <Area>
      {ch.sections.map((s) => (
        <div key={s.id} id={"book-" + s.id} style={{ display: "flex", flexDirection: "column", gap: 8, scrollMarginTop: 8 }}>
          <div style={txt(t, "body1", t.text.primary, t.weight.semibold)}>{s.title}</div>
          {s.paras.map((p, i) => <p key={i} style={{ ...txt(t, "body2", t.text.primary), margin: 0, lineHeight: 1.5 }}>{p}</p>)}
          {s.source ? <span style={txt(t, "subtext", t.text.tertiary)}>Quelle: {s.source}</span> : null}
          {s.lesson && onLesson ? <Button label="Zur Lektion" variant="quiet" onClick={() => onLesson(s.lesson!)} /> : null}
        </div>
      ))}
    </Area>
  );
}

export function bookLinkForLesson(lessonId: string): string | undefined {
  return (requireMap())[lessonId];
}

function requireMap(): Record<string, string> {
  return {
    s1: "grundlagen", s2: "grundlagen", s3: "gmdss", s4: "anlage", s5: "sprechfunk",
    s6: "dsc", s7: "sprechfunk", s8: "navtex", s9: "sprechfunk", s10: "navtex",
    u1: "grundlagen", u2: "binnen", u3: "anlage", u4: "tafel", u5: "sprechfunk",
    u6: "sprechfunk", u7: "binnen", u8: "anlage",
  };
}
