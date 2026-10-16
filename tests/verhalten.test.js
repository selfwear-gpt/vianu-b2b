// Verhalten im Browser: Menü bei Hover, Pilot-Knopf der Umfrage, Chat-Handy (Eingabe, Senden, Neustart).
// Braucht Playwright und Chromium (CHROMIUM_PFAD oder Standardpfad). Ohne beides werden die Tests übersprungen.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

let chromium = null;
try { ({ chromium } = require("playwright")); } catch (e) { try { ({ chromium } = require(path.join(require("node:child_process").execSync("npm root -g").toString().trim(), "playwright"))); } catch (e2) { chromium = null; } }
const PFAD = process.env.CHROMIUM_PFAD || (fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const ROOT = path.join(__dirname, "..");
const url = (f) => "file://" + path.join(ROOT, f);
const ueberspringen = !chromium;

async function mitSeite(f, breite, fn) {
  const b = await chromium.launch(PFAD ? { executablePath: PFAD } : {});
  try {
    const p = await (await b.newContext({ viewport: { width: breite, height: 900 } })).newPage();
    await p.goto(url(f));
    await p.waitForTimeout(300);
    await fn(p);
  } finally { await b.close(); }
}

test("Wer entscheidet mit? öffnet beim Darüberfahren und schließt beim Verlassen", { skip: ueberspringen }, async () => {
  await mitSeite("b2b/personal.html", 1280, async (p) => {
    const knopf = p.locator("[data-auswahl-knopf]");
    assert.equal(await knopf.getAttribute("aria-expanded"), "false");
    await knopf.hover();
    assert.equal(await knopf.getAttribute("aria-expanded"), "true");
    assert.equal(await p.locator("#persona-liste").isVisible(), true);
    await p.mouse.move(600, 600);
    await p.waitForTimeout(400);
    assert.equal(await knopf.getAttribute("aria-expanded"), "false");
  });
});

test("Personal: Pilot anfragen erscheint ab drei beantworteten Fragen", { skip: ueberspringen }, async () => {
  await mitSeite("b2b/personal.html", 1280, async (p) => {
    const knopf = p.locator("[data-umfrage-pilot]");
    const antworten = p.locator("#messwerte .umfrage__antwort");
    assert.equal(await knopf.isHidden(), true);
    await antworten.nth(0).click();
    await antworten.nth(3).click();
    assert.equal(await knopf.isHidden(), true, "nach zwei Antworten noch versteckt");
    await antworten.nth(4).click();
    assert.equal(await knopf.isVisible(), true, "nach drei Antworten sichtbar");
    await knopf.click();
    assert.equal(await p.locator("dialog[open]").count(), 1, "öffnet das Kontaktformular");
  });
});

test("Chat-Handy: erste Nachricht allein, Scrollen zeigt weitere, Neustart setzt zurück, am Ende steht der Link", { skip: ueberspringen }, async () => {
  await mitSeite("b2b/personal.html", 1280, async (p) => {
    const sichtbar = () => p.evaluate(() => document.querySelectorAll("[data-chat] .chat__nachricht:not(.chat__nachricht--aus)").length);
    assert.equal(await p.locator("[data-chat-weiter]").count(), 0, "kein Weiter-Knopf");
    const info = await p.evaluate(() => { const c = document.querySelector("[data-chat]"); return [c.getBoundingClientRect().top + window.scrollY, c.getBoundingClientRect().height]; });
    await p.evaluate(([t]) => window.scrollTo(0, t - 80), info);
    await p.waitForTimeout(1500);
    assert.equal(await sichtbar(), 1, "nur die erste Nachricht");
    await p.evaluate(([t, h]) => window.scrollTo(0, t + (h - innerHeight) * 0.5), info);
    await p.waitForTimeout(4000);
    const mitte = await sichtbar();
    assert.ok(mitte > 1 && mitte < 12, "in der Mitte ein Teil: " + mitte);
    await p.evaluate(([t, h]) => window.scrollTo(0, t + h), info);
    await p.waitForTimeout(9000);
    assert.equal(await p.locator("[data-chat] .chat__link:visible").count(), 1, "am Ende die Link-Nachricht");
    assert.equal(await p.locator("[data-chat]").evaluate((c) => c.classList.contains("chat--fertig")), true, "Chat ist fertig");
    // Der Kreispfeil ersetzt die drei Punkte und startet direkt von vorne
    assert.equal(await p.locator("[data-chat-menue-knopf]").getAttribute("aria-label"), "Chat von vorne starten");
    await p.locator("[data-chat-menue-knopf]").click();
    await p.waitForTimeout(2200);
    assert.equal(await sichtbar(), 1, "nach dem Neustart wieder nur die erste");
    // Menü bei laufendem Chat
    await p.locator("[data-chat-menue-knopf]").click();
    assert.equal(await p.locator("[data-chat-menue]").isVisible(), true);
    await p.locator("[data-chat-neu]").click();
    await p.waitForTimeout(2200);
    assert.equal(await sichtbar(), 1);
  });
});

test("Chat: Hinweis erst nach 3 Sekunden Ruhe, nach dem Ende bleibt der Verlauf stehen und die Strecke schrumpft", { skip: ueberspringen }, async () => {
  await mitSeite("b2b/personal.html", 1280, async (p) => {
    const info = await p.evaluate(() => { const c = document.querySelector("[data-chat]"); return [c.getBoundingClientRect().top + window.scrollY, c.getBoundingClientRect().height]; });
    await p.evaluate(([t]) => window.scrollTo(0, t - 80), info);
    await p.waitForTimeout(1200);
    assert.equal(await p.locator("[data-chat]").evaluate((c) => c.classList.contains("chat--hinweis")), false, "nach 1 Sekunde noch kein Hinweis");
    await p.waitForTimeout(3400);
    assert.equal(await p.locator("[data-chat]").evaluate((c) => c.classList.contains("chat--hinweis")), true, "nach 3 Sekunden Ruhe der Hinweis");
    await p.mouse.wheel(0, 50);
    await p.waitForTimeout(200);
    assert.equal(await p.locator("[data-chat]").evaluate((c) => c.classList.contains("chat--hinweis")), false, "Scrollen blendet ihn aus");
    // ans Ende scrollen und weiter nach unten, dann Strecke kürzen
    await p.evaluate(([t, h]) => window.scrollTo(0, t + h), info);
    await p.waitForTimeout(12000);
    await p.evaluate(([t, h]) => window.scrollTo(0, t + h + 1500), info);
    await p.waitForTimeout(600);
    await p.evaluate(() => window.scrollBy(0, 5));
    await p.waitForTimeout(400);
    const hoehe = await p.locator("[data-chat]").evaluate((c) => Math.round(c.getBoundingClientRect().height));
    assert.ok(hoehe < 1000, "Chat-Strecke ist gekürzt: " + hoehe);
    assert.equal(await p.locator("[data-chat] .chat__nachricht:not(.chat__nachricht--aus)").count(), 12, "Endzustand bleibt stehen");
  });
});

test("Chat im Rahmen ohne Scrollen: kein Selbstlauf, das Mausrad schaltet eine Nachricht weiter", { skip: ueberspringen }, async () => {
  const b = await chromium.launch(PFAD ? { executablePath: PFAD } : {});
  try {
    const p = await (await b.newContext({ viewport: { width: 1100, height: 40000 } })).newPage();
    await p.goto(url("b2b/personal.html"));
    await p.waitForTimeout(6000);
    const sichtbar = () => p.evaluate(() => document.querySelectorAll("[data-chat] .chat__nachricht:not(.chat__nachricht--aus)").length);
    assert.equal(await sichtbar(), 1, "nach sechs Sekunden immer noch nur die erste");
    const box = await p.locator(".chat__fenster").boundingBox();
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await p.mouse.wheel(0, 100);
    await p.waitForTimeout(1300);
    assert.equal(await sichtbar(), 2, "ein Rad-Impuls zeigt genau eine weitere");
  } finally { await b.close(); }
});

test("Chat-Handy: Mikro vergrößert das Feld, Text wird zum Senden und füllt das Formular vor", { skip: ueberspringen }, async () => {
  await mitSeite("b2b/personal.html", 1280, async (p) => {
    const senden = p.locator("[data-chat-senden]");
    const eingabe = p.locator("[data-chat-eingabe]");
    assert.equal(await eingabe.getAttribute("maxlength"), "280");
    await senden.scrollIntoViewIfNeeded();
    await senden.click();
    assert.equal(await p.locator(".chat__eingabe--gross").count(), 1, "Feld ist größer");
    await p.waitForTimeout(1200);
    assert.equal(await p.locator(".chat__eingabe--gross").count(), 0, "nach einer Sekunde wieder normal");
    assert.equal(/chat__senden--text/.test(await senden.getAttribute("class")), false);
    await eingabe.fill("Wir haben 40 Leute im Housekeeping.");
    assert.equal(/chat__senden--text/.test(await senden.getAttribute("class")), true, "Papierflieger bei Text");
    await senden.click();
    assert.equal(await p.locator("dialog[open]").count(), 1, "Formular offen");
    assert.equal(await p.locator('dialog [data-feld="anliegen"]').inputValue(), "Wir haben 40 Leute im Housekeeping.");
  });
});

test("Chat in der Gesamtvorschau: eine versteckte Seite zeigt beim Öffnen nicht schon alle Nachrichten", { skip: ueberspringen || !fs.existsSync(process.env.VORSCHAU || "") }, async () => {
  const b = await chromium.launch(PFAD ? { executablePath: PFAD } : {});
  try {
    const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
    await p.goto("file://" + process.env.VORSCHAU + "#b2b-geschaeftsfuehrung");
    await p.waitForTimeout(400);
    await p.goto("file://" + process.env.VORSCHAU + "#b2b-personal");
    await p.waitForTimeout(800);
    const n = await p.evaluate(() => document.querySelectorAll("[data-seite]:not([hidden]) [data-chat] .chat__nachricht:not(.chat__nachricht--aus)").length);
    assert.equal(n, 0);
  } finally { await b.close(); }
});

test("Studienkarte: Download-Knopf öffnet das Popup, ungültige Adresse bleibt stehen, gültige lädt die PDF unter ihrem Studiennamen", { skip: ueberspringen }, async () => {
  // Der Download-Name gilt nur für Dateien vom selben Ursprung, deshalb läuft die Seite hier über einen kleinen lokalen Server
  const http = require("node:http");
  const typen = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".pdf": "application/pdf", ".woff2": "font/woff2", ".jpg": "image/jpeg" };
  const server = http.createServer((req, res) => {
    const f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end(); }
    res.setHeader("Content-Type", typen[path.extname(f)] || "application/octet-stream");
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const b = await chromium.launch(PFAD ? { executablePath: PFAD } : {});
  try {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
    const p = await ctx.newPage();
    await p.goto("http://127.0.0.1:" + server.address().port + "/b2b/personal.html");
    await p.waitForTimeout(300);
    await p.locator(".studienkarte").first().hover();
    await p.locator("[data-studie-datei]").first().click();
    assert.equal(await p.locator("[data-studie-dialog][open]").count(), 1, "Popup offen");
    await p.locator("[data-studie-email]").fill("kein-mail");
    await p.locator("[data-studie-absenden]").click();
    assert.equal(await p.locator("[data-studie-fehler]").isVisible(), true, "Fehler bei ungültiger Adresse");
    await p.locator("[data-studie-email]").fill("max@firma.de");
    const [dl] = await Promise.all([p.waitForEvent("download"), p.locator("[data-studie-absenden]").click()]);
    assert.match(dl.suggestedFilename(), /^Abdelsalam et al\. 2023 - Frequency and risk factors of musculoskeletal disorders among kitchen workers\.pdf$/);
  } finally { await b.close(); server.close(); }
});
