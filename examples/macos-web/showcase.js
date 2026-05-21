// Thread-1 reactivity for the Liquid Glass web showcase.
//
// Mirrors the native NavigationSplitView selection behavior:
// clicking a sidebar item (or scrolling into a section) marks the matching
// row selected and rewrites the inspector to describe that section.
//
// No framework — single ES module, ~80 lines. The static surface markup
// stays in index.html so audit-liquid-glass-html.mjs still works against
// the raw DOM.

const SECTIONS = {
  materials:       { label: "Materials",          variant: "Regular", surfaceRule: "Foundational tokens; renderer-agnostic." },
  shape:           { label: "Shape",              variant: "Regular", surfaceRule: "Foundational tokens; renderer-agnostic." },
  spacing:         { label: "Spacing",            variant: "Regular", surfaceRule: "Foundational tokens; renderer-agnostic." },
  typography:      { label: "Typography",         variant: "Regular", surfaceRule: "Foundational tokens; renderer-agnostic." },
  motion:          { label: "Motion",             variant: "Regular", surfaceRule: "Foundational tokens; renderer-agnostic." },
  buttons:         { label: "Buttons",            variant: "Regular", surfaceRule: "Floating layer; Regular glass on capsule." },
  controls:        { label: "Controls",           variant: "Regular", surfaceRule: "Floating layer; Regular glass on capsule." },
  surfaces:        { label: "Content surfaces",   variant: "Regular", surfaceRule: "Content layer; SOLID — glass forbidden." },
  "sheet-section": { label: "Sheet",              variant: "Regular", surfaceRule: "Modal surface; Regular glass auto on partial detent." },
  rules:           { label: "Where glass belongs", variant: "Regular", surfaceRule: "Reference documentation." },
  "anti-patterns": { label: "Anti-patterns",      variant: "Regular", surfaceRule: "Reference documentation." },
  "clear-variant": { label: "Clear variant",      variant: "Clear",   surfaceRule: "Clear glass; requires dim layer behind." },
};

// Variant-driven values come straight from the spec.
const VARIANT_TOKENS = {
  Regular: { blur: "40 px", saturation: "180 %" },
  Clear:   { blur: "28 px", saturation: "160 %" },
};

const sidebarItems = document.querySelectorAll(".lg-sidebar__item");
const inspectorFields = {
  section:     document.querySelector('[data-inspector="section"]'),
  variant:     document.querySelector('[data-inspector="variant"]'),
  blur:        document.querySelector('[data-inspector="blur"]'),
  saturation:  document.querySelector('[data-inspector="saturation"]'),
  surfaceRule: document.querySelector('[data-inspector="surfaceRule"]'),
};

function select(sectionId, { scroll = false } = {}) {
  const meta = SECTIONS[sectionId];
  if (!meta) return;

  for (const item of sidebarItems) {
    const target = item.getAttribute("href")?.slice(1);
    if (target === sectionId) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  }

  inspectorFields.section.textContent = meta.label;
  inspectorFields.variant.textContent = meta.variant;
  inspectorFields.blur.textContent = VARIANT_TOKENS[meta.variant].blur;
  inspectorFields.saturation.textContent = VARIANT_TOKENS[meta.variant].saturation;
  inspectorFields.surfaceRule.textContent = meta.surfaceRule;

  if (scroll) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

for (const item of sidebarItems) {
  item.addEventListener("click", (event) => {
    const target = item.getAttribute("href")?.slice(1);
    if (!target || !SECTIONS[target]) return;
    event.preventDefault();
    select(target, { scroll: true });
  });
}

// Scroll spy on the content column so plain scroll also updates state.
const content = document.querySelector(".lg-content");
const observed = Object.keys(SECTIONS)
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (content && observed.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) select(visible.target.id);
    },
    { root: content, rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
  );
  observed.forEach((el) => observer.observe(el));
}
