/* Lokaler Ersatz für "grok/canvas": gleiche API, gleiches Aussehen, Hell/Dunkel per prefers-color-scheme */
import { useState, useEffect, useMemo, useRef, useCallback, useReducer, Fragment } from "react";
import type { ReactNode, CSSProperties, ChangeEvent } from "react";
export { useState, useEffect, useMemo, useRef, useCallback, useReducer, Fragment };
export type { ReactNode, CSSProperties } from "react";

const fontStack = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
const fs = (size: number, lh: number) => ({ fontSize: size, lineHeight: lh + "px" });
const base = {
  font: { family: fontStack, mono, heading1: fs(30, 38), heading2: fs(22, 30), heading3: fs(18, 26), body1: fs(15, 22), body2: fs(14, 20), subtext: fs(13, 18), label: fs(12, 16), code: fs(13, 18), metric: fs(28, 34) },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  radius: { sm: 6, md: 8, lg: 12, xl: 16, full: 9999 },
  motion: { hover: "150ms", easing: "cubic-bezier(.2,.8,.2,1)" },
};
const light = {
  ...base,
  bg: { base: "#ffffff", elevated: "#ffffff", subtle: "#f3f5f8" },
  text: { primary: "#14181f", secondary: "#4a5463", tertiary: "#5c6572", success: "#13804a", warning: "#a15c00", danger: "#c42b2b", accent: "#1f5fd6" },
  border: { subtle: "#e6e9ef", default: "#d3d8e0", strong: "#a9b1bd", focus: "#1f5fd6" },
  fill: { accentSubtle: "#eaf1fe", successSubtle: "#e8f6ee", dangerSubtle: "#fdecec", warningSubtle: "#fff4e0" },
  dataviz: { categorical: ["#2f6fe4", "#e0a800", "#17a7c4"], other: "#9aa3af", negative: "#d64545", singleSeriesRest: "#bcd0f7" },
};
const dark = {
  ...base,
  bg: { base: "#0f1216", elevated: "#171b21", subtle: "#20252d" },
  text: { primary: "#eef1f5", secondary: "#b3bcc8", tertiary: "#808a98", success: "#4cc985", warning: "#f0b04a", danger: "#ff6b6b", accent: "#7aa7ff" },
  border: { subtle: "#262c35", default: "#343b46", strong: "#56606e", focus: "#7aa7ff" },
  fill: { accentSubtle: "#1a2a47", successSubtle: "#143524", dangerSubtle: "#3d1a1a", warningSubtle: "#3a2a10" },
  dataviz: { categorical: ["#6b9bff", "#f2c14e", "#4fd1e8"], other: "#6b7380", negative: "#ff7b7b", singleSeriesRest: "#2c3f63" },
};
export type GrokTheme = typeof light;

export function useGrokTheme(): GrokTheme {
  const q = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const [isDark, setDark] = useState<boolean>(q ? q.matches : false);
  useEffect(() => {
    if (!q) return;
    const f = (e: MediaQueryListEvent) => setDark(e.matches);
    q.addEventListener("change", f);
    return () => q.removeEventListener("change", f);
  }, []);
  useEffect(() => {
    document.body.style.background = (isDark ? dark : light).bg.base;
  }, [isDark]);
  return isDark ? dark : light;
}

const lab = (t: GrokTheme): CSSProperties => ({ fontFamily: t.font.family, ...t.font.label, color: t.text.secondary });
const field = (t: GrokTheme): CSSProperties => ({ fontFamily: t.font.family, ...t.font.body2, color: t.text.primary, background: t.bg.elevated, border: "1px solid " + t.border.default, borderRadius: t.radius.md, padding: "10px 12px", minHeight: 44, minWidth: 0, width: "100%", boxSizing: "border-box" });
const wrap: CSSProperties = { display: "flex", flexDirection: "column", gap: 4, minWidth: 140, flex: "1 1 160px" };

export function Button({ label, onClick, variant, disabled }: { label: string; onClick: () => void; variant?: "primary" | "quiet"; disabled?: boolean }) {
  const t = useGrokTheme();
  const p = variant === "primary";
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{ fontFamily: t.font.family, ...t.font.body2, fontWeight: t.weight.semibold, padding: "10px 16px", minHeight: 44, boxSizing: "border-box", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: t.radius.full, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.45 : 1, border: p ? "1px solid " + t.text.accent : variant === "quiet" ? "1px solid transparent" : "1px solid " + t.border.default, background: p ? t.text.accent : variant === "quiet" ? "transparent" : t.bg.elevated, color: p ? t.bg.base : t.text.primary }}>
      {label}
    </button>
  );
}
export function Input({ label, value, onChange, placeholder, type }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: "text" | "number" }) {
  const t = useGrokTheme();
  return (
    <label style={wrap}>
      {label ? <span style={lab(t)}>{label}</span> : null}
      <input type={type || "text"} value={value} placeholder={placeholder} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} style={field(t)} />
    </label>
  );
}
type Opt<T extends string> = T | { value: T; label: string };
export function Select<T extends string = string>({ label, options, value, onChange, placeholder, disabled }: { label?: string; options: readonly Opt<T>[]; value: T; onChange: (v: T) => void; placeholder?: string; disabled?: boolean }) {
  const t = useGrokTheme();
  return (
    <label style={wrap}>
      {label ? <span style={lab(t)}>{label}</span> : null}
      <select value={value} disabled={disabled} onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as T)} style={field(t)}>
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o: Opt<T>) => {
          const v = typeof o === "string" ? o : o.value;
          return <option key={v} value={v}>{typeof o === "string" ? o : o.label}</option>;
        })}
      </select>
    </label>
  );
}
export function Toggle({ label, value, onChange, disabled }: { label?: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  const t = useGrokTheme();
  return (
    <button type="button" role="switch" aria-checked={value} disabled={disabled} onClick={() => onChange(!value)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer", padding: "10px 8px", minHeight: 44, boxSizing: "border-box", fontFamily: t.font.family, ...t.font.body2, color: t.text.primary }}>
      <span style={{ width: 36, height: 20, borderRadius: 10, background: value ? t.text.accent : t.border.default, position: "relative", transition: "background 150ms" }}>
        <span style={{ position: "absolute", top: 2, left: value ? 18 : 2, width: 16, height: 16, borderRadius: 8, background: "#fff", transition: "left 150ms" }} />
      </span>
      {label}
    </button>
  );
}
export function Status({ tone, children }: { tone?: "success" | "warning" | "danger" | "accent" | "neutral"; children: ReactNode }) {
  const t = useGrokTheme();
  const c = tone === "success" ? t.text.success : tone === "warning" ? t.text.warning : tone === "danger" ? t.text.danger : tone === "accent" ? t.text.accent : t.text.secondary;
  const bg = tone === "success" ? t.fill.successSubtle : tone === "warning" ? t.fill.warningSubtle : tone === "danger" ? t.fill.dangerSubtle : tone === "accent" ? t.fill.accentSubtle : t.bg.subtle;
  return <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6, padding: "2px 10px", borderRadius: t.radius.full, background: bg, color: c, fontFamily: t.font.family, ...t.font.label, fontWeight: t.weight.semibold }}>{children}</span>;
}
export function Callout({ lead, tone, children }: { lead?: string; tone?: "info" | "success" | "warning" | "danger"; children?: ReactNode }) {
  const t = useGrokTheme();
  const c = tone === "success" ? t.text.success : tone === "warning" ? t.text.warning : tone === "danger" ? t.text.danger : tone === "info" ? t.text.accent : t.border.strong;
  return (
    <div style={{ borderLeft: "4px solid " + c, background: t.bg.subtle, borderRadius: t.radius.md, padding: "10px 14px", fontFamily: t.font.family, ...t.font.body2, color: t.text.primary }}>
      {lead ? <strong style={{ marginRight: 6 }}>{lead}</strong> : null}
      {children}
    </div>
  );
}
type LI = string | { text: ReactNode; items?: readonly LI[] };
export function BulletList({ items }: { items: readonly LI[]; marker?: "pro" | "con" }) {
  const t = useGrokTheme();
  const r = (xs: readonly LI[]): ReactNode => (
    <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6, fontFamily: t.font.family, ...t.font.body2, color: t.text.primary }}>
      {xs.map((x: LI, i: number) => (typeof x === "string" ? <li key={i}>{x}</li> : <li key={i}>{x.text}{x.items ? r(x.items) : null}</li>))}
    </ul>
  );
  return <>{r(items)}</>;
}
export function LinkCards({ links }: { links: readonly { title: string; site?: string; date?: string; href: string }[]; numbered?: boolean }) {
  const t = useGrokTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {links.map((l: { title: string; site?: string; href: string }) => (
        <a key={l.href + l.title} href={l.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", flexDirection: "column", gap: 2, padding: "10px 12px", border: "1px solid " + t.border.subtle, borderRadius: t.radius.lg, background: t.bg.elevated, textDecoration: "none" }}>
          <span style={{ fontFamily: t.font.family, ...t.font.body2, fontWeight: t.weight.semibold, color: t.text.primary }}>{l.title}</span>
          {l.site ? <span style={{ fontFamily: t.font.family, ...t.font.label, color: t.text.tertiary }}>{l.site}</span> : null}
        </a>
      ))}
    </div>
  );
}
export function Segmented<T extends string = string>({ options, value, onChange }: { options: readonly (T | { value: T; label: string })[]; value: T; onChange: (v: T) => void }) {
  const t = useGrokTheme();
  return (
    <div role="tablist" style={{ display: "inline-flex", flexWrap: "wrap", gap: 2, padding: 2, borderRadius: t.radius.full, background: t.bg.subtle, border: "1px solid " + t.border.subtle }}>
      {options.map((o: T | { value: T; label: string }) => {
        const v = typeof o === "string" ? o : o.value;
        const on = v === value;
        return (
          <button key={v} type="button" role="tab" aria-selected={on} onClick={() => onChange(v)} style={{ border: "none", cursor: "pointer", padding: "10px 14px", minHeight: 44, boxSizing: "border-box", borderRadius: t.radius.full, background: on ? t.bg.elevated : "transparent", boxShadow: on ? "0 1px 2px rgba(0,0,0,.15)" : "none", color: t.text.primary, fontFamily: t.font.family, ...t.font.subtext, fontWeight: on ? t.weight.semibold : t.weight.regular }}>
            {typeof o === "string" ? o : o.label}
          </button>
        );
      })}
    </div>
  );
}
