// Entry point for the Liquid Glass web showcase.
// Plays the role of App.swift + ContentView.swift in the native sibling —
// imports data modules, mounts them into the static shell, and wires
// sidebar-click + scroll-spy selection to the inspector.

import { renderSidebar }                  from "./sidebar.js";
import { renderSections }                 from "./sections.js";
import { renderInspector, updateInspector, SECTION_META } from "./inspector.js";
import { initCommandPalette, openCommandPalette } from "./command-palette.js";
import { initTier }                       from "./tier.js";

const sidebarHost   = document.querySelector(".lg-sidebar__sections");
const contentHost   = document.querySelector(".lg-content");
const inspectorHost = document.querySelector(".lg-inspector");

renderSidebar(sidebarHost);
renderSections(contentHost);
renderInspector(inspectorHost);

// Pick a renderer tier (T0–T3) and stamp every existing .lg-glass node.
// Must run after sections/inspector mount so the dynamic glass surfaces
// emitted by sections.js are tagged too. See spec/rules/web-renderer-tiers.md.
const activeTier = initTier();

const sidebarItems = document.querySelectorAll(".lg-sidebar__item");

function select(sectionId, { scroll = false } = {}) {
  if (!SECTION_META[sectionId]) return;

  for (const item of sidebarItems) {
    const target = item.getAttribute("href")?.slice(1);
    if (target === sectionId) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  }

  updateInspector(sectionId);

  if (scroll) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

for (const item of sidebarItems) {
  item.addEventListener("click", (event) => {
    const target = item.getAttribute("href")?.slice(1);
    if (!target || !SECTION_META[target]) return;
    event.preventDefault();
    select(target, { scroll: true });
  });
}

const sections = Object.keys(SECTION_META)
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (contentHost && sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) select(visible.target.id);
    },
    { root: contentHost, rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
  );
  sections.forEach((el) => observer.observe(el));
}

// Initial selection — first sidebar item.
const firstId = Object.keys(SECTION_META)[0];
if (firstId) select(firstId);

// Command palette — wire ⌘K + the demo trigger button in the palette section.
initCommandPalette({
  onJumpTo: (sectionId) => select(sectionId, { scroll: true }),
  onAction: (action) => {
    if (action === "open-sheet") {
      window.location.hash = "open-sheet";
    } else if (action === "toggle-theme") {
      document.documentElement.dataset.theme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    }
  },
});

contentHost?.addEventListener("click", (event) => {
  const target = event.target.closest("[data-open-command-palette]");
  if (target) {
    event.preventDefault();
    openCommandPalette();
  }
});
