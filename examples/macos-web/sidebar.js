// Sidebar data + renderer for the Liquid Glass web showcase.
// Mirrors examples/macos-native-swift/Sources/LiquidGlassShowcase/Sidebar.swift.

export const SIDEBAR_GROUPS = [
  {
    label: "Foundations",
    items: [
      { id: "materials",  icon: "◐",  label: "Materials",  badge: 2 },
      { id: "shape",      icon: "◯",  label: "Shape" },
      { id: "spacing",    icon: "▤",  label: "Spacing" },
      { id: "typography", icon: "Aa", label: "Typography" },
      { id: "motion",     icon: "⤳",  label: "Motion" },
    ],
  },
  {
    label: "Components",
    items: [
      { id: "buttons",       icon: "▣", label: "Buttons" },
      { id: "controls",      icon: "▥", label: "Controls" },
      { id: "surfaces",      icon: "▦", label: "Surfaces" },
      { id: "sheet-section", icon: "⤒", label: "Sheet" },
    ],
  },
  {
    label: "Reference",
    items: [
      { id: "rules",         icon: "✓", label: "Rules" },
      { id: "anti-patterns", icon: "✕", label: "Anti-patterns" },
      { id: "clear-variant", icon: "◌", label: "Clear variant" },
    ],
  },
];

function itemMarkup({ id, icon, label, badge }) {
  const badgeMarkup = badge != null
    ? `<span class="lg-sidebar__badge">${badge}</span>`
    : "";
  return `
    <a class="lg-sidebar__item" href="#${id}">
      <span class="lg-sidebar__icon" aria-hidden="true">${icon}</span>
      <span>${label}</span>
      ${badgeMarkup}
    </a>
  `;
}

function groupMarkup({ label, items }) {
  return `
    <div class="lg-sidebar__section">
      <h2 class="lg-sidebar__heading">${label}</h2>
      ${items.map(itemMarkup).join("")}
    </div>
  `;
}

export function renderSidebar(container) {
  container.innerHTML = SIDEBAR_GROUPS.map(groupMarkup).join("");
}
