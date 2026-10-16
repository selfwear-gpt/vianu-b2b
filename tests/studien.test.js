// Seam: Studien-Download (assets/js/studien.js). Prüfung der E-Mail-Adresse.
const test = require("node:test");
const assert = require("node:assert/strict");
const { emailGueltig } = require("../assets/js/studien.js");

test("gültige Adressen", () => {
  for (const a of ["max@firma.de", "a.b@sub.firma.co.uk", " max@firma.de ", "vor+nach@firma.com"]) assert.equal(emailGueltig(a), true, a);
});

test("ungültige Adressen", () => {
  for (const a of ["", "max", "max@", "@firma.de", "max@firma", "max@firma.d", "max @firma.de", "max@@firma.de", null, undefined, "a@b.c".repeat(60)]) assert.equal(emailGueltig(a), false, String(a));
});
