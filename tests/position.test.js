// Seam: Scrollposition beim Neuladen (assets/js/position.js). Reine Regeln ohne Browserbezug.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { wiederherstellen, begrenze, mitPosition, position } = require("../assets/js/position.js");

test("wiederhergestellt wird nur beim Neuladen und beim Zurückgehen, nicht bei neuen Aufrufen", () => {
  assert.equal(wiederherstellen("reload"), true);
  assert.equal(wiederherstellen("back_forward"), true);
  assert.equal(wiederherstellen("navigate"), false);
  assert.equal(wiederherstellen("prerender"), false);
  assert.equal(wiederherstellen(undefined), false);
});

test("die Position bleibt zwischen 0 und dem untersten Stand der Seite", () => {
  assert.equal(begrenze("1500", 4000), 1500);
  assert.equal(begrenze(5000, 4000), 4000);
  assert.equal(begrenze(-20, 4000), 0);
  assert.equal(begrenze("abc", 4000), 0);
  assert.equal(begrenze(null, 4000), 0);
  assert.equal(begrenze(300, -5), 0);
});

test("die Position liegt im Verlaufszustand, vorhandene Felder bleiben", () => {
  assert.equal(position(mitPosition(null, 1234.6)), 1235);
  assert.equal(position(mitPosition({ a: 1 }, 10)), 10);
  assert.equal(mitPosition({ a: 1 }, 10).a, 1);
  for (const leer of [null, undefined, {}, "x", { vianuY: -3 }, { vianuY: "abc" }, { vianuY: null }]) assert.equal(position(leer), null, JSON.stringify(leer));
});

test("das Skript legt nichts im Speicher des Browsers ab", () => {
  const js = fs.readFileSync(path.join(__dirname, "..", "assets/js/position.js"), "utf8").replace(/\/\*[\s\S]*?\*\//, "");
  assert.doesNotMatch(js, /document\.cookie|localStorage|sessionStorage|indexedDB/);
});
