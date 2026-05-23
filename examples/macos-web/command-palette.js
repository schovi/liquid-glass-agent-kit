// Command palette — Cmd-K floating action launcher.
// Geometry / motion / keyboard model from spec/components/command-palette.yaml
// and spec/patterns/command-palette.md. The palette itself sits on the `hud`
// material role.

const COMMANDS = [
  { id: "open-materials",    label: "Jump to Materials",         shortcut: "⌘1", section: "materials" },
  { id: "open-shape",        label: "Jump to Shape",             shortcut: "⌘2", section: "shape" },
  { id: "open-spacing",      label: "Jump to Spacing",           shortcut: "⌘3", section: "spacing" },
  { id: "open-typography",   label: "Jump to Typography",        shortcut: "⌘4", section: "typography" },
  { id: "open-motion",       label: "Jump to Motion",            shortcut: "⌘5", section: "motion" },
  { id: "open-buttons",      label: "Jump to Buttons",                            section: "buttons" },
  { id: "open-controls",     label: "Jump to Controls",                           section: "controls" },
  { id: "open-inputs",       label: "Jump to Inputs & overlays",                  section: "inputs-overlays" },
  { id: "open-forms",        label: "Jump to Forms & lists",                      section: "forms-lists" },
  { id: "open-morphing",     label: "Jump to Morphing pattern",                   section: "morphing" },
  { id: "open-scroll-edges", label: "Jump to Scroll edge effects",                section: "scroll-edge-effects" },
  { id: "open-sheet",        label: "Open the New entry sheet",  shortcut: "⌘N", action: "open-sheet" },
  { id: "toggle-appearance", label: "Toggle light / dark appearance",             action: "toggle-theme" },
  { id: "export-tokens",     label: "Export design tokens (demo)", shortcut: "⌥⌘E", action: "noop" },
  { id: "share",             label: "Share showcase link",        shortcut: "⌘⇧S", action: "noop" },
  { id: "about",             label: "About Liquid Glass",                         action: "noop" },
];

const STATE = {
  open: false,
  query: "",
  selected: 0,
  trigger: null,        // element to restore focus to on close
  filtered: COMMANDS,
};

let dom = null;

export function initCommandPalette({ onJumpTo, onAction }) {
  dom = {
    overlay: document.getElementById("lg-command-palette"),
    scrim: document.querySelector("#lg-command-palette .lg-command-palette__scrim"),
    panel: document.querySelector("#lg-command-palette .lg-command-palette__panel"),
    input: document.querySelector("#lg-command-palette .lg-command-palette__input"),
    list: document.querySelector("#lg-command-palette .lg-command-palette__list"),
  };
  if (!dom.overlay) return;

  dom.input.addEventListener("input", (event) => {
    STATE.query = event.target.value;
    STATE.selected = 0;
    renderList();
  });
  dom.input.addEventListener("keydown", onInputKeydown);
  dom.scrim.addEventListener("click", close);
  dom.panel.addEventListener("keydown", trapTab);

  document.addEventListener("keydown", (event) => {
    const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
    if (isCmdK) {
      event.preventDefault();
      toggle();
    } else if (event.key === "Escape" && STATE.open) {
      event.preventDefault();
      close();
    }
  });

  // Public hooks for the section's "Open palette" demo button.
  dom._handlers = { onJumpTo, onAction };
}

export function openCommandPalette() {
  open();
}

function toggle() {
  if (STATE.open) close();
  else open();
}

function open() {
  if (!dom?.overlay || STATE.open) return;
  STATE.open = true;
  STATE.trigger = document.activeElement;
  STATE.query = "";
  STATE.selected = 0;
  dom.input.value = "";
  renderList();
  dom.overlay.removeAttribute("hidden");
  // Force reflow so the transition runs from the closed state.
  void dom.overlay.offsetWidth;
  dom.overlay.dataset.state = "open";
  dom.input.focus();
}

function close() {
  if (!dom?.overlay || !STATE.open) return;
  STATE.open = false;
  dom.overlay.dataset.state = "closed";
  // Wait for exit transition before hiding so the panel doesn't snap away.
  setTimeout(() => {
    if (!STATE.open) dom.overlay.setAttribute("hidden", "");
  }, 200);
  if (STATE.trigger && typeof STATE.trigger.focus === "function") STATE.trigger.focus();
}

function onInputKeydown(event) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    STATE.selected = (STATE.selected + 1) % Math.max(1, STATE.filtered.length);
    renderList();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    const len = Math.max(1, STATE.filtered.length);
    STATE.selected = (STATE.selected - 1 + len) % len;
    renderList();
  } else if (event.key === "Enter") {
    event.preventDefault();
    runSelected();
  }
}

function trapTab(event) {
  if (event.key !== "Tab") return;
  // The palette has one focusable element (the input). Trap by always
  // returning focus to it.
  event.preventDefault();
  dom.input.focus();
}

function filter(commands, query) {
  const q = query.trim().toLowerCase();
  if (!q) return commands;
  return commands.filter((cmd) => cmd.label.toLowerCase().includes(q));
}

function renderList() {
  STATE.filtered = filter(COMMANDS, STATE.query);
  if (STATE.filtered.length === 0) {
    dom.list.innerHTML = `<li class="lg-command-palette__empty" role="option" aria-disabled="true">No matches</li>`;
    dom.input.setAttribute("aria-activedescendant", "");
    return;
  }
  if (STATE.selected >= STATE.filtered.length) STATE.selected = 0;
  dom.list.innerHTML = STATE.filtered.map((cmd, index) => {
    const selected = index === STATE.selected;
    return `
      <li
        id="lg-command-palette-option-${cmd.id}"
        class="lg-command-palette__item${selected ? " lg-command-palette__item--selected" : ""}"
        role="option"
        aria-selected="${selected}"
        data-id="${cmd.id}"
      >
        <span class="lg-command-palette__item-label">${cmd.label}</span>
        ${cmd.shortcut ? `<span class="lg-command-palette__shortcut">${cmd.shortcut}</span>` : ""}
      </li>
    `;
  }).join("");
  const activeId = `lg-command-palette-option-${STATE.filtered[STATE.selected].id}`;
  dom.input.setAttribute("aria-activedescendant", activeId);
  // Hover and click also run/select.
  for (const li of dom.list.querySelectorAll(".lg-command-palette__item")) {
    li.addEventListener("mouseenter", () => {
      const id = li.dataset.id;
      const idx = STATE.filtered.findIndex((cmd) => cmd.id === id);
      if (idx >= 0 && idx !== STATE.selected) { STATE.selected = idx; renderList(); }
    });
    li.addEventListener("click", () => {
      const id = li.dataset.id;
      const idx = STATE.filtered.findIndex((cmd) => cmd.id === id);
      if (idx >= 0) { STATE.selected = idx; runSelected(); }
    });
  }
}

function runSelected() {
  const cmd = STATE.filtered[STATE.selected];
  if (!cmd) return;
  close();
  if (cmd.section) {
    dom._handlers?.onJumpTo?.(cmd.section);
  } else if (cmd.action) {
    dom._handlers?.onAction?.(cmd.action);
  }
}
