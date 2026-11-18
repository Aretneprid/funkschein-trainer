export type DiffMark = { t: string; k: "ok" | "bad" | "miss" | "extra" };

function normWords(s: string): string[] {
  return s
    .replace(/[’']/g, "'")
    .replace(/[.,;:!?()[\]„“”«»…]/g, " ")
    .replace(/—|–/g, " ")
    .replace(/ß/g, "ss")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

/** Word-level LCS alignment of the user transcript against the model. */
export function wordDiff(user: string, model: string): DiffMark[] {
  const a = normWords(user);
  const b = normWords(model);
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const out: DiffMark[] = [];
  let i = n;
  let j = m;
  const rev: DiffMark[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      rev.push({ t: b[j - 1], k: "ok" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rev.push({ t: b[j - 1], k: "miss" });
      j--;
    } else {
      rev.push({ t: a[i - 1], k: "extra" });
      i--;
    }
  }
  for (let k = rev.length - 1; k >= 0; k--) out.push(rev[k]);
  return out;
}

/** Accept either side of " / " or " bzw. " as a typed answer. */
export function typedMatches(user: string, expected: string): boolean {
  const u = normWords(user).join(" ");
  if (!u) return false;
  const variants = expected.split(/\s*(?:\/|bzw\.?|oder)\s*/i).map((x) => normWords(x).join(" ")).filter(Boolean);
  variants.push(normWords(expected).join(" "));
  if (variants.some((v) => v === u)) return true;
  // allow dropping a leading article
  const strip = (s: string) => s.replace(/^(der|die|das|den|dem|des|ein|eine|einem|einen|eines|the|a|an)\s+/, "");
  const us = strip(u);
  return variants.some((v) => strip(v) === us);
}
