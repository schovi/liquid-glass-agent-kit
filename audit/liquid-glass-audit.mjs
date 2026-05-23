#!/usr/bin/env node
// Static auditor for Liquid Glass web output (HTML, CSS, JS template strings).
//
// Usage:
//   node audit/liquid-glass-audit.mjs <file-or-dir> [more...]
//
// Exits 0 when no findings, 1 when any anti-pattern is detected.
// Heuristic regex scanner, dependency-free. Catches the common agent
// mistakes A1-A10 documented in spec/rules/anti-patterns.md.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, resolve } from "node:path";

const ALLOWED_BLUR_PX = new Set([0, 28, 40]);
const ALLOWED_SATURATION_PCT = new Set([100, 140, 160, 180]);
const ALLOWED_RADIUS_PX = new Set([0, 12, 16, 24, 28, 32]);
const ALLOWED_CAPSULE_RADIUS = new Set([9999]);
const ALLOWED_TIERS = new Set(["T0", "T1", "T2", "T3"]);

// A27 — icon-only glass actions must carry an accessible name. The class
// patterns below name the showcase's icon-only buttons; any element with one
// of these classes that ships without aria-label / aria-labelledby / title
// fails WCAG 4.1.2. The list is conservative: spec-compliant markup uses
// these class names; consumers who invent their own icon-only class names
// will not be caught by A27 statically.
const ICON_ONLY_CLASSES = /(lg-icon-button|lg-toolbar-pill__item|lg-floating-hud__item|lg-sidebar-toggle|lg-stepper__button|lg-toolbar-button)/;

// B1 — Performance budget. Per spec/tokens/material.yaml budget.max.
// A live-blurred surface is any element carrying class "lg-glass" whose role
// is liveBlur:true in spec/tokens/material.yaml. Elements opted out via
// data-role="windowBackground" or data-role="content" (liveBlur:false) are
// excluded. Per-file proxy for the "per visible pane" rule.
// See spec/rules/performance-budget.md.
const GLASS_BUDGET_MAX = 6;

// Roles whose `liveBlur:` is false in spec/tokens/material.yaml. Elements
// declaring one of these via data-role do not count against B1.
const SOLID_ROLES = new Set(["windowBackground", "content"]);

const findings = [];

function record(file, id, message, snippet) {
  findings.push({ file, id, message, snippet: snippet?.slice(0, 120) ?? "" });
}

function walk(target) {
  const stat = statSync(target);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(target)) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      walk(join(target, entry));
    }
    return;
  }
  const ext = extname(target);
  // HTML and CSS are the original scan targets. ES modules (.js / .mjs)
  // are scanned too because data-driven showcases (see examples/macos-web)
  // keep repeating glass markup in template strings; the same regex
  // patterns work on those strings, so audit coverage stays intact.
  if (![".html", ".htm", ".css", ".js", ".mjs"].includes(ext)) return;
  audit(target, readFileSync(target, "utf8"));
}

function audit(file, src) {
  checkGlassOnGlass(file, src);
  checkGlassBehindBodyText(file, src);
  checkRandomMaterialValues(file, src);
  checkCapsuleMiscalculation(file, src);
  checkMixedVariants(file, src);
  checkUnreadableClear(file, src);
  checkAccessibilityFallbacks(file, src);
  checkInventedAppleTerminology(file, src);
  checkBudget(file, src);
  checkTierDeclaration(file, src);
  checkFocusVisible(file, src);
  checkIconOnlyAccessibleName(file, src);
}

// A1 and A2 share a depth scan so they reflect real nesting, not source order.
function scanNesting(file, src) {
  const stack = [];
  const voidEls = new Set(["br", "hr", "img", "input", "meta", "link", "source", "wbr"]);
  const tagRe = /<(\/?)(\w[\w-]*)\b([^>]*)>/g;
  let m;
  while ((m = tagRe.exec(src))) {
    const [, closing, tag, attrs] = m;
    const lower = tag.toLowerCase();
    if (closing) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === lower) { stack.splice(i, 1); break; }
      }
      continue;
    }
    const isGlass = /class\s*=\s*"[^"]*\blg-glass\b[^"]*"/.test(attrs);
    const insideGlass = stack.some((s) => s.glass);
    if (isGlass && insideGlass) {
      record(file, "A1", "Glass-on-glass: lg-glass nested inside lg-glass.", m[0]);
    }
    if (["p", "article", "section"].includes(lower) && insideGlass) {
      record(file, "A2", `<${lower}> nested inside an lg-glass element; glass belongs in the floating layer.`, m[0]);
    }
    if (!/\/>$/.test(m[0]) && !voidEls.has(lower)) {
      stack.push({ tag: lower, glass: isGlass });
    }
  }
}

function checkGlassOnGlass(file, src)         { scanNesting(file, src); }
function checkGlassBehindBodyText()           { /* covered by scanNesting */ }

// A3 — Random material values in CSS.
function checkRandomMaterialValues(file, src) {
  if (extname(file) !== ".css" && !/<style[\s>]/i.test(src)) return;

  const blurRe = /backdrop-filter\s*:[^;]*?blur\(\s*(\d+(?:\.\d+)?)px\s*\)/g;
  let m;
  while ((m = blurRe.exec(src))) {
    const px = Number(m[1]);
    if (!ALLOWED_BLUR_PX.has(px)) {
      record(file, "A3", `Off-token blur value blur(${px}px); allowed: ${[...ALLOWED_BLUR_PX].join(", ")}px.`, m[0]);
    }
  }

  const satRe = /saturate\(\s*(\d+(?:\.\d+)?)%\s*\)/g;
  while ((m = satRe.exec(src))) {
    const pct = Number(m[1]);
    if (!ALLOWED_SATURATION_PCT.has(pct)) {
      record(file, "A3", `Off-token saturate(${pct}%); allowed: ${[...ALLOWED_SATURATION_PCT].join(", ")}%.`, m[0]);
    }
  }
}

// A5 — Capsule miscalculation. Covers three cases:
//   1. CSS rule:       .lg-capsule { ...; border-radius: Xpx; ... }
//   2. inline HTML:    <... class="...lg-capsule..." style="...border-radius: Xpx..."
//   3. element + rule: <... class="...lg-capsule..."> followed by a border-radius: Xpx
function checkCapsuleMiscalculation(file, src) {
  const reCss = /\.lg-capsule\b[^{}]*\{[^}]*?border-radius\s*:\s*(\d+)px/g;
  const reInlineStyle = /class\s*=\s*"[^"]*\blg-capsule\b[^"]*"[^>]*?style\s*=\s*"[^"]*?border-radius\s*:\s*(\d+)px/g;
  const reAfter = /class\s*=\s*"[^"]*\blg-capsule\b[^"]*"[^>]*>[\s\S]{0,2000}?border-radius\s*:\s*(\d+)px/g;

  for (const re of [reCss, reInlineStyle, reAfter]) {
    let m;
    while ((m = re.exec(src))) {
      const px = Number(m[1]);
      if (!ALLOWED_CAPSULE_RADIUS.has(px)) {
        record(file, "A5", `Capsule has border-radius: ${px}px; must be 9999px.`, m[0]);
      }
    }
  }
}

// A7 — Mixed variants in one surface or group.
function checkMixedVariants(file, src) {
  const re = /<[^>]*class\s*=\s*"[^"]*\blg-glass--regular\b[^"]*"[^>]*>[\s\S]{0,4000}?lg-glass--clear/g;
  if (re.test(src)) {
    record(file, "A7", "Mixed Regular and Clear glass detected inside one group.", "");
  }
}

// A8 — Clear glass without a dim layer.
function checkUnreadableClear(file, src) {
  const clearRe = /<([^>]*?)class\s*=\s*"([^"]*\blg-glass--clear\b[^"]*)"([^>]*)>/g;
  let m;
  while ((m = clearRe.exec(src))) {
    const attrs = `${m[1]} ${m[3]}`;
    const hasDim = /data-dim\s*=\s*"true"/.test(attrs);
    if (!hasDim && !/\blg-dim\b/.test(src)) {
      record(file, "A8", "Clear glass without data-dim=\"true\" or a sibling .lg-dim layer.", m[0]);
    }
  }
}

// A9 — Missing accessibility fallback in CSS.
function checkAccessibilityFallbacks(file, src) {
  if (extname(file) !== ".css") return;
  const missing = [];
  if (!/prefers-reduced-transparency/.test(src)) missing.push("prefers-reduced-transparency");
  if (!/prefers-contrast/.test(src))             missing.push("prefers-contrast");
  if (!/prefers-reduced-motion/.test(src))       missing.push("prefers-reduced-motion");
  for (const id of missing) {
    record(file, "A9", `Missing @media (${id}) fallback.`);
  }
}

// A10 — Invented Apple terminology.
function checkInventedAppleTerminology(file, src) {
  const re = /(apple[\s-]?official|apple[\s-]?certified|licensed\s+by\s+apple)/i;
  const m = re.exec(src);
  if (m) {
    record(file, "A10", `Invented Apple endorsement phrase: "${m[1]}".`);
  }
}

// B1 — Performance budget exceeded. Counts elements with class "lg-glass"
// per file (proxy for "per visible pane"). HTML and JS template strings are
// both scanned because the showcase emits glass markup from sections.js.
//
// An element is excluded when it carries a data-role whose role has
// `liveBlur: false` in spec/tokens/material.yaml (see SOLID_ROLES above).
function checkBudget(file, src) {
  const ext = extname(file);
  if (![".html", ".htm", ".js", ".mjs"].includes(ext)) return;
  // Match the full opening tag so we can inspect data-role alongside class.
  const tagRe = /<[a-z][^>]*\bclass\s*=\s*["'][^"']*\blg-glass\b[^"']*["'][^>]*>/gi;
  let count = 0;
  let m;
  while ((m = tagRe.exec(src))) {
    const tag = m[0];
    const roleMatch = /\bdata-role\s*=\s*["']([^"']+)["']/.exec(tag);
    if (roleMatch && SOLID_ROLES.has(roleMatch[1])) continue;
    count += 1;
  }
  if (count > GLASS_BUDGET_MAX) {
    record(
      file,
      "B1",
      `Performance budget exceeded: ${count} live-blur lg-glass surfaces in this file; cap is ${GLASS_BUDGET_MAX} per pane. Share sampling (GlassEffectContainer / shared capsule), downgrade non-primary surfaces to solid, or label opaque tints with data-role="windowBackground". See spec/rules/performance-budget.md.`,
    );
  }
}

// A25 — Renderer tier missing or invalid. Every element carrying class
// `lg-glass` (or the variant `lg-glass--regular` / `lg-glass--clear`) MUST
// declare a renderer tier via `data-tier="T0|T1|T2|T3"`. Tier selection
// is page-wide; an element with no tier can't be reasoned about
// statically (which fallback should it carry? which feDisplacementMap
// filter?). See spec/rules/web-renderer-tiers.md.
function checkTierDeclaration(file, src) {
  const ext = extname(file);
  if (![".html", ".htm", ".js", ".mjs"].includes(ext)) return;

  const tagRe = /<[a-z][^>]*\bclass\s*=\s*["'][^"']*\blg-glass(?:--regular|--clear)?\b[^"']*["'][^>]*>/gi;
  let m;
  while ((m = tagRe.exec(src))) {
    const tag = m[0];
    const tierMatch = /\bdata-tier\s*=\s*["']([^"']+)["']/.exec(tag);
    if (!tierMatch) {
      record(file, "A25", "lg-glass element missing data-tier attribute (T0|T1|T2|T3). See spec/rules/web-renderer-tiers.md.", tag);
      continue;
    }
    if (!ALLOWED_TIERS.has(tierMatch[1])) {
      record(file, "A25", `Invalid data-tier="${tierMatch[1]}"; allowed: ${[...ALLOWED_TIERS].join(", ")}.`, tag);
    }
  }
}

// A26 — Focus indicator on interactive glass. WCAG 2.4.7 (focus visible).
// A CSS file that ships .lg-glass rules MUST declare at least one
// :focus-visible rule with an outline. The check is lenient: a global
// `:focus-visible { outline: ... }` rule satisfies it because the cascade
// makes it apply to interactive .lg-glass descendants. We require both the
// :focus-visible selector and an `outline:` declaration close to it to
// avoid false-positives from documentation comments.
function checkFocusVisible(file, src) {
  if (extname(file) !== ".css") return;
  if (!/\blg-glass\b/.test(src)) return;
  if (!/:focus-visible[\s\S]{0,300}\boutline\s*:/m.test(src)) {
    record(
      file,
      "A26",
      "Missing :focus-visible { outline: ... } rule. Interactive .lg-glass elements need a visible focus indicator (WCAG 2.4.7). See spec/rules/accessibility-rules.md.",
    );
  }
}

// A27 — Icon-only glass action missing accessible name. WCAG 4.1.2.
// Buttons (and <summary>) styled with the showcase's icon-only class names
// MUST carry aria-label, aria-labelledby, or title. We scan opening tags
// only; closing tags and inner content are not parsed.
function checkIconOnlyAccessibleName(file, src) {
  const ext = extname(file);
  if (![".html", ".htm", ".js", ".mjs"].includes(ext)) return;
  const tagRe = /<(button|summary)\b[^>]*>/gi;
  let m;
  while ((m = tagRe.exec(src))) {
    const tag = m[0];
    if (!ICON_ONLY_CLASSES.test(tag)) continue;
    if (/\baria-label\s*=/.test(tag)) continue;
    if (/\baria-labelledby\s*=/.test(tag)) continue;
    if (/\btitle\s*=/.test(tag)) continue;
    record(
      file,
      "A27",
      "Icon-only glass action missing accessible name (aria-label / aria-labelledby / title). WCAG 4.1.2. See spec/rules/accessibility-rules.md.",
      tag,
    );
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("usage: liquid-glass-audit.mjs <file-or-dir>...");
    process.exit(2);
  }
  for (const target of args) walk(resolve(target));

  if (findings.length === 0) {
    console.log("OK — no Liquid Glass anti-patterns detected.");
    process.exit(0);
  }
  console.log(`Found ${findings.length} issue(s):\n`);
  for (const f of findings) {
    console.log(`[${f.id}] ${f.file}\n     ${f.message}`);
    if (f.snippet) console.log(`     > ${f.snippet}`);
  }
  process.exit(1);
}

main();
