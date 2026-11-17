import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export type StepKey = { id: string; act: "press" | "hold" | "hold1" | "hold3" | "rotate" | "cap" };

type Props = {
  keys: StepKey[];
  lcd?: string;
  accent: string;
  dark: boolean;
  fam: string;
};

const CSS = `
@keyframes fsTap { 0%,20%{opacity:0;transform:scale(.5)} 40%,65%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(.8)} }
@keyframes fsGlow { 0%,100%{opacity:.35} 50%{opacity:1} }
@keyframes fsCap { 0%,12%{transform:rotate(0deg)} 28%,88%{transform:rotate(-72deg)} 100%{transform:rotate(0deg)} }
@keyframes fsRot { 0%{transform:rotate(-40deg)} 50%{transform:rotate(50deg)} 100%{transform:rotate(-40deg)} }
@keyframes fsRing { from{stroke-dashoffset:88} to{stroke-dashoffset:0} }
@keyframes fsLcd { 0%,25%{opacity:.4} 40%,100%{opacity:1} }
`;

const POS: Record<string, { x: number; y: number; r?: number; soft?: number; mic?: boolean }> = {
  pwr: { x: 78, y: 168 },
  vol: { x: 78, y: 168 },
  distress: { x: 238, y: 40 },
  cap: { x: 238, y: 40 },
  ent: { x: 238, y: 86 },
  chup: { x: 238, y: 112 },
  chdn: { x: 238, y: 136 },
  menu: { x: 238, y: 160 },
  clear: { x: 238, y: 184 },
  left: { x: 92, y: 118 },
  right: { x: 188, y: 118 },
  "16c": { x: 332, y: 86, mic: true },
  ptt: { x: 300, y: 70, mic: true },
  michl: { x: 358, y: 86, mic: true },
  micup: { x: 346, y: 118, mic: true },
  micdn: { x: 346, y: 146, mic: true },
  hilo: { x: 156, y: 118, soft: 2 },
  chan: { x: 188, y: 118, soft: 3 },
  dw: { x: 124, y: 118, soft: 1 },
  alarmoff: { x: 92, y: 118, soft: 0 },
  cancel: { x: 92, y: 118, soft: 0 },
  continue: { x: 124, y: 118, soft: 1 },
  finish: { x: 156, y: 118, soft: 2 },
  exit: { x: 188, y: 118, soft: 3 },
  back: { x: 188, y: 118, soft: 3 },
  call: { x: 156, y: 118, soft: 2 },
  resend: { x: 92, y: 118, soft: 0 },
  pause: { x: 124, y: 118, soft: 1 },
  resume: { x: 124, y: 118, soft: 1 },
  info: { x: 188, y: 118, soft: 3 },
  chg: { x: 156, y: 118, soft: 2 },
};

const SOFT_NAME: Record<string, string> = {
  hilo: "HI/LO",
  chan: "CHAN",
  dw: "DW",
  alarmoff: "ALARM OFF",
  cancel: "CANCEL",
  continue: "CONTINUE",
  finish: "FINISH",
  exit: "EXIT",
  back: "BACK",
  call: "CALL",
  resend: "RESEND",
  pause: "PAUSE",
  resume: "RESUME",
  info: "INFO",
  chg: "CHG",
};

function durOf(a: StepKey["act"]): number {
  if (a === "cap") return 1100;
  if (a === "hold3") return 2600;
  if (a === "hold1") return 1400;
  if (a === "hold") return 1200;
  if (a === "rotate") return 1400;
  return 900;
}

export function StepAnim({ keys, lcd, accent, dark, fam }: Props): ReactNode {
  const [play, setPlay] = useState(true);
  const [t0, setT0] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!document.getElementById("fs-step-anim-css")) {
      const s = document.createElement("style");
      s.id = "fs-step-anim-css";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);
  useEffect(() => {
    if (!play) return;
    const id = window.setInterval(() => setNow(Date.now()), 50);
    return () => window.clearInterval(id);
  }, [play]);

  const timeline = useMemo(() => {
    let t = 400;
    const items = keys.map((k) => {
      const start = t;
      const d = durOf(k.act);
      t += d + 180;
      return { k, start, end: start + d };
    });
    return { items, total: t + 1200 };
  }, [keys]);

  const elapsed = (now - t0) % Math.max(timeline.total, 1);
  const active = timeline.items.find((x) => elapsed >= x.start && elapsed < x.end);
  const passed = elapsed > (timeline.items.length ? timeline.items[timeline.items.length - 1].end : 0);
  const softs = (() => {
    const out = ["SCAN", "DW", "HI/LO", "CHAN"];
    const used = keys.filter((k) => SOFT_NAME[k.id]);
    used.forEach((k, i) => {
      const slot = POS[k.id] && POS[k.id].soft !== undefined ? (POS[k.id].soft as number) : i % 4;
      out[slot] = SOFT_NAME[k.id];
    });
    return out;
  })();

  const body = dark ? "#1c222b" : "#2c333d";
  const body2 = dark ? "#151a20" : "#22282f";
  const ink = "#d7dde6";
  const mute = "#8b93a0";
  const lcdBg = "#07160c";
  const lcdFg = "#8CFF7A";
  const lcdLines = (lcd || "16").split("\n");
  const showLcd = !keys.length || passed || (active && active.k.act !== "cap");

  const glow = (id: string): boolean => !!active && active.k.id === id;
  const actOf = (id: string): StepKey["act"] | null => (active && active.k.id === id ? active.k.act : null);

  const mark = (id: string, x: number, y: number, rx = 16): ReactNode => {
    if (!glow(id) && !(id === "distress" && actOf("cap"))) return null;
    const a = actOf(id) || (id === "distress" ? actOf("cap") : null);
    const ring = a === "hold1" || a === "hold3";
    const lab = a === "hold3" ? "3 s halten" : a === "hold1" ? "1 s halten" : a === "hold" ? "halten" : a === "rotate" ? "drehen" : a === "cap" ? "Kappe öffnen" : "drücken";
    return (
      <g style={{ pointerEvents: "none" }}>
        <rect x={x - rx} y={y - rx} width={rx * 2} height={rx * 2} rx={8} fill={accent} opacity={0.22} style={{ animation: play ? "fsGlow 700ms ease-in-out infinite" : "none" }} />
        {ring ? (
          <circle cx={x} cy={y} r={rx + 6} fill="none" stroke="#ffd24a" strokeWidth={3} strokeDasharray="88" strokeLinecap="round" style={{ animation: play ? `fsRing ${a === "hold3" ? 2.4 : 1.2}s linear forwards` : "none" }} />
        ) : a === "rotate" ? null : (
          <circle cx={x + 10} cy={y + 10} r={7} fill="#ffd24a" stroke="#14181f" strokeWidth={1.5} style={{ animation: play ? "fsTap 900ms ease-in-out infinite" : "none", transformOrigin: `${x + 10}px ${y + 10}px` }} />
        )}
      </g>
    );
  };

  const btn = (x: number, y: number, w: number, h: number, label: string, id?: string, fs = 7): ReactNode => {
    const lines = label.length > 6 && label.indexOf(" ") > 0 ? label.split(" ") : [label];
    const fs2 = lines.length > 1 || label.length > 5 ? 6.5 : fs;
    return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={glow(id || "") ? "#3a4658" : "#1a1f26"} stroke={glow(id || "") ? "#ffd24a" : "#4a5360"} strokeWidth={glow(id || "") ? 2 : 1} />
      {lines.map((ln, i) => (
        <text key={i} x={x + w / 2} y={y + h / 2 + 2.5 - (lines.length - 1) * 4 + i * 8} textAnchor="middle" fontSize={fs2} fontFamily={fam} fontWeight={700} fill={ink}>{ln}</text>
      ))}
    </g>
    );
  };

  const wrap: CSSProperties = { flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column", gap: 6 };
  if (!keys.length && !lcd) return null;

  return (
    <div style={wrap}>
      <svg viewBox="0 0 400 208" role="img" aria-label={"Geräteanimation: " + keys.map((k) => k.id).join(", ")} style={{ width: "100%", height: "auto", maxHeight: "min(220px, 34vh)", display: "block", flex: "1 1 auto" }}>
        <rect x={8} y={8} width={262} height={192} rx={14} fill={body} stroke={body2} strokeWidth={2} />
        <rect x={20} y={28} width={36} height={70} rx={6} fill={body2} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={24} y={36 + i * 12} width={28} height={3} rx={1} fill="#4c5664" />)}
        <text x={38} y={108} textAnchor="middle" fontSize={6} fontFamily={fam} fill={mute}>SPEAKER</text>
        <rect x={66} y={22} width={140} height={72} rx={5} fill="#0a0e0c" stroke="#1c2a20" />
        <rect x={70} y={26} width={132} height={64} rx={3} fill={lcdBg} />
        <g style={{ animation: showLcd && play ? "fsLcd 800ms ease-out" : "none", opacity: showLcd ? 1 : 0.35 }}>
          <text x={78} y={48} fontSize={22} fontFamily={fam} fontWeight={700} fill={lcdFg}>{lcdLines[0]}</text>
          {lcdLines[1] ? <text x={78} y={66} fontSize={11} fontFamily={fam} fontWeight={600} fill={lcdFg}>{lcdLines[1]}</text> : <text x={148} y={48} fontSize={11} fontFamily={fam} fill="#5aaa58">INT</text>}
          {lcdLines[2] ? <text x={78} y={80} fontSize={10} fontFamily={fam} fill="#5aaa58">{lcdLines[2]}</text> : <text x={178} y={80} fontSize={10} fontFamily={fam} fill="#5aaa58">{lcdLines[0] === "16" || /TX|RX/.test(lcd || "") ? "" : ""}</text>}
        </g>
        {softs.map((lab, i) => {
          const ids = Object.keys(SOFT_NAME).filter((id) => SOFT_NAME[id] === lab);
          const hit = ids.find((id) => glow(id)) || ids[0];
          return (
            <g key={i}>
              {btn(68 + i * 35, 102, 33, 26, lab, hit, 7)}
              {hit ? mark(hit, 84 + i * 35, 115, 15) : null}
            </g>
          );
        })}
        {/* DISTRESS + cap */}
        <g>
          <rect x={218} y={24} width={40} height={28} rx={4} fill="#7a3a08" stroke="#c47a20" />
          <text x={238} y={42} textAnchor="middle" fontSize={5.5} fontFamily={fam} fontWeight={800} fill="#ffd8a0">DISTRESS</text>
          {mark("distress", 238, 38, 20)}
          <g style={{ transformOrigin: "218px 22px", animation: (glow("cap") || (active && active.k.id === "distress" && keys.some((k) => k.id === "cap" || k.act === "cap"))) && play ? "fsCap 2.6s ease-in-out infinite" : keys.some((k) => k.id === "cap" || k.act === "cap") && active && (active.k.id === "distress" || active.k.id === "cap") ? "fsCap 2.6s ease-in-out infinite" : "none" }}>
            <rect x={216} y={16} width={44} height={14} rx={3} fill="#6b7380" stroke="#9aa3b0" />
            <rect x={218} y={18} width={40} height={6} rx={2} fill="#9aa3b0" />
          </g>
          {glow("cap") || glow("distress") ? mark("cap", 238, 22, 16) : null}
        </g>
        {btn(218, 76, 40, 18, "ENT", "ent")}
        {mark("ent", 238, 85, 14)}
        {btn(218, 100, 40, 18, "∧ CH", "chup")}
        {mark("chup", 238, 109, 14)}
        {btn(218, 124, 40, 18, "∨ CH", "chdn")}
        {mark("chdn", 238, 133, 14)}
        {btn(218, 148, 40, 18, "MENU", "menu")}
        {mark("menu", 238, 157, 14)}
        {btn(218, 172, 40, 18, "CLEAR", "clear")}
        {mark("clear", 238, 181, 14)}
        {/* knob */}
        <g>
          <circle cx={78} cy={168} r={22} fill="#1a1f26" stroke={glow("vol") || glow("pwr") ? "#ffd24a" : "#6b7380"} strokeWidth={glow("vol") || glow("pwr") ? 3 : 2} />
          <circle cx={78} cy={168} r={14} fill="#2c333d" />
          <line x1={78} y1={168} x2={78} y2={156} stroke={ink} strokeWidth={2} strokeLinecap="round" style={{ transformOrigin: "78px 168px", animation: (actOf("vol") === "rotate" || actOf("pwr") === "rotate") && play ? "fsRot 1.4s ease-in-out infinite" : "none" }} />
          <text x={78} y={198} textAnchor="middle" fontSize={6} fontFamily={fam} fill={mute}>VOL/SQL·PWR</text>
          {actOf("vol") === "rotate" || actOf("pwr") === "rotate" ? (
            <g fill="none" stroke="#ffd24a" strokeWidth={2} strokeLinecap="round">
              <path d="M60 156 A22 22 0 0 1 96 156" markerEnd="url(#fsArr)" />
            </g>
          ) : null}
          {mark("pwr", 78, 168, 24)}
          {mark("vol", 78, 168, 24)}
        </g>
        <defs>
          <marker id="fsArr" viewBox="0 0 8 8" refX={6} refY={4} markerWidth={6} markerHeight={6} orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="#ffd24a" />
          </marker>
        </defs>
        {/* handset */}
        <rect x={286} y={28} width={106} height={160} rx={16} fill={body} stroke={body2} strokeWidth={2} />
        <rect x={294} y={40} width={28} height={70} rx={6} fill={glow("ptt") ? "#1f5fd6" : "#1a3a8a"} stroke={glow("ptt") ? "#ffd24a" : "#4a7dff"} />
        <text x={308} y={78} textAnchor="middle" fontSize={8} fontFamily={fam} fontWeight={800} fill="#fff" transform="rotate(-90 308 78)">PTT</text>
        {mark("ptt", 308, 75, 18)}
        {btn(330, 44, 26, 20, "16/C", "16c", 6)}
        {mark("16c", 343, 54, 14)}
        {btn(360, 44, 24, 20, "H/L", "michl", 6)}
        {mark("michl", 372, 54, 14)}
        {btn(330, 72, 54, 18, "∧", "micup", 8)}
        {mark("micup", 357, 81, 12)}
        {btn(330, 94, 54, 18, "∨", "micdn", 8)}
        {mark("micdn", 357, 103, 12)}
        <circle cx={357} cy={140} r={16} fill={body2} />
        <text x={357} y={174} textAnchor="middle" fontSize={6} fontFamily={fam} fill={mute}>MIKROFON</text>
      </svg>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flex: "0 0 auto" }}>
        <span style={{ fontFamily: fam, fontSize: 14, fontWeight: 600, color: "#ffd24a", minHeight: 20 }}>
          {active ? (actOf(active.k.id) === "hold3" ? "3 s halten" : actOf(active.k.id) === "hold1" ? "1 s halten" : actOf(active.k.id) === "hold" ? "Taste halten" : actOf(active.k.id) === "rotate" ? "Regler drehen" : actOf(active.k.id) === "cap" ? "Schutzkappe öffnen" : "Drücken") + (SOFT_NAME[active.k.id] ? ": " + SOFT_NAME[active.k.id] : active.k.id === "distress" ? ": DISTRESS" : active.k.id === "ptt" ? ": PTT" : active.k.id === "16c" ? ": 16/C" : active.k.id === "pwr" || active.k.id === "vol" ? ": VOL/SQL·PWR" : "") : (passed ? "So sieht das Display danach aus." : "")}
        </span>
        <button
          type="button"
          onClick={() => {
            if (play) {
              setPlay(false);
            } else {
              setT0(Date.now());
              setNow(Date.now());
              setPlay(true);
            }
          }}
          style={{ minHeight: 44, minWidth: 44, padding: "8px 14px", borderRadius: 999, border: "1px solid " + accent, background: "transparent", color: accent, fontFamily: fam, fontWeight: 600, fontSize: 15, cursor: "pointer" }}
        >
          {play ? "Pause" : "Animation wiederholen"}
        </button>
      </div>
    </div>
  );
}
