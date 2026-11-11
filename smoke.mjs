import { chromium } from "playwright-core";
const URL = process.env.SMOKE_URL || "http://localhost:4173/";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const res = [];

async function goBack(p) {
  await p.getByRole("button", { name: "‹ Zurück" }).first().click();
  const leave = p.getByRole("button", { name: "Verlassen" });
  if (await leave.count()) await leave.click();
  await p.waitForTimeout(150);
}

for (const [w, h, tag] of [[1280, 800, "desktop"], [360, 640, "phone"]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
  await p.goto(URL, { waitUntil: "networkidle" });
  const shot = async (n) => p.screenshot({ path: `shots/${tag}-${n}.png` });
  await shot("01-start");
  await p.getByRole("button", { name: /SRC/ }).first().click();
  await shot("02-areas");
  const scroll = await p.evaluate(() => document.documentElement.scrollHeight > window.innerHeight + 1);
  for (const [area, n] of [["Erklären", "03-erklaeren"], ["Prüfungsfragen", "04-fragen"], ["Theorieprüfung", "05-pruefung"], ["Funkgerät", "06-funkgeraet"]]) {
    await p.getByRole("button", { name: new RegExp("^" + area) }).first().click();
    await p.waitForTimeout(200);
    await shot(n);
    if (area === "Prüfungsfragen") {
      await p.locator("main, body").locator("button").filter({ hasText: /Fragen ·/ }).first().click();
      await p.waitForTimeout(200);
      const before = await p.evaluate(() => localStorage.getItem("funkschein-trainer-v1") || "");
      await p.locator("button").filter({ hasText: /^[A-D].{15,}/ }).first().click().catch(async () => {
        const btns = p.locator("button[type=button]"); await btns.nth(8).click();
      });
      await p.waitForTimeout(200);
      await shot("04b-frage-beantwortet");
      const after = await p.evaluate(() => localStorage.getItem("funkschein-trainer-v1") || "");
      res.push(`${tag}: progress saved ${after.length > before.length || after !== before}`);
      await goBack(p);
    }
    if (area === "Funkgerät") {
      await p.locator("button").filter({ hasText: "Gerät frei bedienen" }).click();
      await p.waitForTimeout(200); await shot("07-geraet");
      await goBack(p);
      await p.locator("button").filter({ hasText: "Funkverkehr üben" }).click();
      await p.locator("button").filter({ hasText: /MAYDAY/ }).first().click();
      await p.waitForTimeout(200); await shot("08-simulator");
      await goBack(p);
      await goBack(p);
    }
    await goBack(p);
  }
  const sw = await p.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return !!r; });
  const man = await p.evaluate(async () => { const l = document.querySelector("link[rel=manifest]"); if (!l) return null; const j = await (await fetch(l.href)).json(); return j.name + "|" + j.icons.length; });
  res.push(`${tag}: SW=${sw} manifest=${man} pageScroll=${scroll} errors=${JSON.stringify(errs)}`);
  await ctx.close();
}
const ctx = await b.newContext(); const p = await ctx.newPage();
await p.goto(URL, { waitUntil: "networkidle" }); await p.waitForTimeout(1500); await p.reload({ waitUntil: "networkidle" });
await ctx.setOffline(true); await p.reload(); const ok = await p.getByText("Funkschein-Trainer").first().isVisible();
res.push("offline reload renders: " + ok);
await b.close();
console.log(res.join("\n"));
