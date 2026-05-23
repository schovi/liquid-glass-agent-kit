// Renderer-tier picker for the Liquid Glass web showcase.
//
// Implements the selection policy from spec/rules/web-renderer-tiers.md and
// spec/tokens/material.yaml `tierSelection`. Runs once at page load.
//
// The picker writes `data-tier` to `<html>` so CSS can cascade off it, and
// also stamps `data-tier` on every existing `.lg-glass` element so that the
// auditor sees the tier at the markup level (the A25 check requires it).

const TIER_ORDER = ["T0", "T1", "T2", "T3"];

// Author opt-in surface. Tools embedding the showcase can pre-set
// `<html data-tier-request="T2">` to ask for a higher tier. URL query
// `?tier=T0|T1|T2|T3` wins for demo / inspector use.
function readRequest() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("tier");
  if (fromQuery && TIER_ORDER.includes(fromQuery)) return fromQuery;
  const fromAttr = document.documentElement.dataset.tierRequest;
  if (fromAttr && TIER_ORDER.includes(fromAttr)) return fromAttr;
  return null;
}

function detectChromium() {
  const brands = navigator.userAgentData?.brands ?? [];
  return brands.some((entry) =>
    /Chromium|Google Chrome|Microsoft Edge/i.test(entry.brand),
  );
}

function supportsBackdropFilter() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return (
    CSS.supports("backdrop-filter", "blur(40px)") ||
    CSS.supports("-webkit-backdrop-filter", "blur(40px)")
  );
}

function supportsWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch (_error) {
    return false;
  }
}

export function selectTier({
  reducedTransparency = matchMedia("(prefers-reduced-transparency: reduce)").matches,
  request = readRequest(),
} = {}) {
  if (reducedTransparency)   return "T0";
  if (!supportsBackdropFilter()) return "T0";

  if (request === "T3" && supportsWebGL2()) return "T3";
  if (request === "T2" && detectChromium()) return "T2";
  if (request === "T0")                     return "T0";
  if (request === "T1")                     return "T1";

  return "T1";
}

export function applyTier(tier) {
  document.documentElement.dataset.tier = tier;
  for (const el of document.querySelectorAll(".lg-glass, [class*=' lg-glass--'], [class^='lg-glass--']")) {
    el.dataset.tier = tier;
  }
}

export function initTier() {
  const tier = selectTier();
  applyTier(tier);

  matchMedia("(prefers-reduced-transparency: reduce)").addEventListener(
    "change",
    (event) => applyTier(selectTier({ reducedTransparency: event.matches })),
  );

  return tier;
}
