// Inspector data + renderer + selection-driven updater.
// Mirrors examples/macos-native-swift/Sources/LiquidGlassShowcase/Inspector.swift
// and the surfaceRule(for:) branches in App.swift.

const FOUNDATIONS = "Foundational tokens; renderer-agnostic.";
const FLOATING    = "Floating layer; Regular glass on capsule.";
const CONTENT     = "Content layer; SOLID — glass forbidden.";
const MODAL       = "Modal surface; Regular glass auto on partial detent.";
const REFERENCE   = "Reference documentation.";
const CLEAR       = "Clear glass; requires dim layer behind.";

export const SECTION_META = {
  materials:        { label: "Materials",         variant: "Regular", surfaceRule: FOUNDATIONS },
  shape:            { label: "Shape",             variant: "Regular", surfaceRule: FOUNDATIONS },
  spacing:          { label: "Spacing",           variant: "Regular", surfaceRule: FOUNDATIONS },
  typography:       { label: "Typography",        variant: "Regular", surfaceRule: FOUNDATIONS },
  motion:           { label: "Motion",            variant: "Regular", surfaceRule: FOUNDATIONS },
  buttons:          { label: "Buttons",           variant: "Regular", surfaceRule: FLOATING },
  controls:         { label: "Controls",          variant: "Regular", surfaceRule: FLOATING },
  "inputs-overlays":{ label: "Inputs & overlays", variant: "Regular", surfaceRule: FLOATING },
  "forms-lists":    { label: "Forms & lists",     variant: "Regular", surfaceRule: CONTENT },
  surfaces:         { label: "Content surfaces",  variant: "Regular", surfaceRule: CONTENT },
  "sheet-section":  { label: "Sheet",             variant: "Regular", surfaceRule: MODAL },
  rules:            { label: "Where glass belongs", variant: "Regular", surfaceRule: REFERENCE },
  "anti-patterns":  { label: "Anti-patterns",     variant: "Regular", surfaceRule: REFERENCE },
  "clear-variant":  { label: "Clear variant",     variant: "Clear",   surfaceRule: CLEAR },
};

const VARIANT_TOKENS = {
  Regular: { blur: "40 px", saturation: "180 %" },
  Clear:   { blur: "28 px", saturation: "160 %" },
};

const FIELDS = [
  { label: "Section",       bind: "section" },
  { label: "Renderer",      static: "css (backdrop-filter)" },
  { label: "Variant",       bind: "variant" },
  { label: "Blur",          bind: "blur" },
  { label: "Saturation",    bind: "saturation" },
  { label: "Outer radius",  static: "28 px (concentric to toolbar pill)" },
  { label: "Surface rule",  bind: "surfaceRule" },
  { label: "Accessibility", static: "reduced-transparency · prefers-contrast · reduced-motion" },
  { label: "Source spec",   static: "spec/liquid-glass.profile.yaml" },
];

function fieldMarkup({ label, bind, static: staticValue }) {
  const valueAttrs = bind ? ` data-inspector="${bind}"` : "";
  const initial = staticValue ?? "";
  return `
    <div class="lg-inspector__group">
      <div class="lg-inspector__label">${label}</div>
      <div class="lg-inspector__value"${valueAttrs}>${initial}</div>
    </div>
  `;
}

export function renderInspector(container) {
  container.innerHTML = FIELDS.map(fieldMarkup).join("");
}

export function updateInspector(sectionId) {
  const meta = SECTION_META[sectionId];
  if (!meta) return;
  const tokens = VARIANT_TOKENS[meta.variant];
  setField("section",     meta.label);
  setField("variant",     meta.variant);
  setField("blur",        tokens.blur);
  setField("saturation",  tokens.saturation);
  setField("surfaceRule", meta.surfaceRule);
}

function setField(name, value) {
  const el = document.querySelector(`[data-inspector="${name}"]`);
  if (el) el.textContent = value;
}
