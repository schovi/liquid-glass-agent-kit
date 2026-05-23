import SwiftUI

// MARK: - Morphing

struct MorphingSection: View {
    @Namespace private var ns
    @State private var expanded = false
    @State private var variant: ChipVariant = .reply

    var body: some View {
        VStack(alignment: .leading, spacing: Tokens.Spacing.panelGap) {
            SectionHeader(
                eyebrow: "Patterns",
                title: "Morphing",
                lede: "Glass elements should morph — not pop — when they appear, disappear, or swap shape. Requires a single GlassEffectContainer, a shared @Namespace with per-identity glassEffectID, and an animated state change."
            )

            ComponentCard(title: "Expand · one capsule grows into a row") {
                // Container spacing 4 < HStack spacing 16 so items render as
                // cleanly separate capsules at rest. The metaball "tail"
                // merge happens only mid-animation, which is the intent.
                GlassEffectContainer(spacing: 4) {
                    HStack(spacing: Tokens.Spacing.panelGap) {
                        Button {
                            withAnimation(Tokens.Easing.spring) {
                                expanded.toggle()
                            }
                        } label: {
                            Label(expanded ? "Collapse" : "Expand",
                                  systemImage: expanded ? "chevron.left.2" : "chevron.right.2")
                                .labelStyle(.titleAndIcon)
                        }
                        .buttonStyle(.glass)
                        .buttonBorderShape(.capsule)
                        .controlSize(.large)
                        .glassEffectID("toggle", in: ns)

                        if expanded {
                            IconActionButton(systemImage: "pencil", id: "edit", namespace: ns)
                            IconActionButton(systemImage: "square.and.arrow.up", id: "share", namespace: ns)
                            IconActionButton(systemImage: "trash", id: "delete", namespace: ns)
                        }
                    }
                    .padding(Tokens.Spacing.controlGap)
                }
            }

            ComponentCard(title: "Swap · capsule trades shape across two states") {
                GlassEffectContainer(spacing: 4) {
                    HStack {
                        Spacer()
                        Button {
                            withAnimation(Tokens.Easing.standard(duration: Tokens.Duration.fast)) {
                                variant.toggle()
                            }
                        } label: {
                            Label(variant.label, systemImage: variant.symbol)
                                .labelStyle(.titleAndIcon)
                                .padding(.horizontal, 4)
                        }
                        .buttonStyle(.glassProminent)
                        .buttonBorderShape(.capsule)
                        .tint(variant.tint)
                        .glassEffectID("swap", in: ns)
                        Spacer()
                    }
                    .padding(Tokens.Spacing.controlGap)
                }
            }

            Text("The morph only runs when participants share one GlassEffectContainer, share one @Namespace, and the state change is wrapped in withAnimation. Reduced Motion collapses the morph to a cross-fade automatically.")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
    }
}

private struct IconActionButton: View {
    let systemImage: String
    let id: String
    let namespace: Namespace.ID

    var body: some View {
        Button { } label: {
            Image(systemName: systemImage)
                .frame(width: 44, height: 44)
        }
        .buttonStyle(.glass)
        .buttonBorderShape(.capsule)
        .controlSize(.large)
        .glassEffectID(id, in: namespace)
    }
}

private enum ChipVariant {
    case reply, send

    var label: String {
        switch self {
        case .reply: return "Reply"
        case .send: return "Send"
        }
    }

    var symbol: String {
        switch self {
        case .reply: return "arrowshape.turn.up.left"
        case .send: return "paperplane.fill"
        }
    }

    var tint: Color {
        switch self {
        case .reply: return .indigo
        case .send: return .green
        }
    }

    mutating func toggle() {
        self = (self == .reply) ? .send : .reply
    }
}

// MARK: - Command palette (⌘K)

struct CommandPaletteSection: View {
    @State private var isOpen = false

    var body: some View {
        VStack(alignment: .leading, spacing: Tokens.Spacing.panelGap) {
            SectionHeader(
                eyebrow: "Patterns",
                title: "Command palette (⌘K)",
                lede: "Floating action launcher on the hud material role. Toggle with ⌘K. The palette panel is glass; items inside are solid rows (no glass-on-glass). Use .overlay(alignment: .top) + .glassEffect(.regular, in: .rect(cornerRadius: 16)) — not .searchable, which lives in the toolbar."
            )

            ComponentCard(title: "Press the button or ⌘K") {
                Button {
                    withAnimation(Tokens.Easing.standard(duration: Tokens.Duration.base)) {
                        isOpen = true
                    }
                } label: {
                    Label("Open command palette", systemImage: "command")
                }
                .buttonStyle(.glassProminent)
                .buttonBorderShape(.capsule)
                .controlSize(.large)
                .keyboardShortcut("k", modifiers: .command)
            }

            Text("Geometry: width 640, max-height 480, top offset 96. Outer radius 16, item radius 12 (concentric). Input 44 tall, item 44 tall. Spring enter 240 ms, standard exit 160 ms. Reduced Motion collapses to opacity-only fade automatically.")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
        .overlay(alignment: .top) {
            if isOpen {
                CommandPalettePanel(isOpen: $isOpen)
                    .padding(.top, Tokens.Spacing.sectionGap)
                    .transition(.scale(scale: 0.96).combined(with: .opacity))
            }
        }
    }
}

private struct PaletteCommand: Identifiable, Hashable {
    let id: String
    let label: String
    let shortcut: String?
}

private struct CommandPalettePanel: View {
    @Binding var isOpen: Bool
    @State private var query: String = ""
    @State private var selectedIndex: Int = 0
    @FocusState private var inputFocused: Bool

    private let commands: [PaletteCommand] = [
        .init(id: "jump-materials",   label: "Jump to Materials",         shortcut: "⌘1"),
        .init(id: "jump-shape",       label: "Jump to Shape",             shortcut: "⌘2"),
        .init(id: "jump-typography",  label: "Jump to Typography",        shortcut: "⌘3"),
        .init(id: "open-sheet",       label: "Open New entry sheet",      shortcut: "⌘N"),
        .init(id: "toggle-appearance", label: "Toggle light / dark appearance", shortcut: nil),
        .init(id: "export-tokens",    label: "Export design tokens",      shortcut: "⌥⌘E"),
        .init(id: "share",            label: "Share showcase link",       shortcut: "⌘⇧S"),
        .init(id: "about",            label: "About Liquid Glass",        shortcut: nil),
    ]

    private var filtered: [PaletteCommand] {
        let q = query.trimmingCharacters(in: .whitespaces).lowercased()
        if q.isEmpty { return commands }
        return commands.filter { $0.label.lowercased().contains(q) }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            TextField("Type a command…", text: $query)
                .textFieldStyle(.plain)
                .font(.title3)
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .focused($inputFocused)
                .onChange(of: query) { _, _ in selectedIndex = 0 }
                .onKeyPress(.upArrow) {
                    if !filtered.isEmpty {
                        selectedIndex = (selectedIndex - 1 + filtered.count) % filtered.count
                    }
                    return .handled
                }
                .onKeyPress(.downArrow) {
                    if !filtered.isEmpty {
                        selectedIndex = (selectedIndex + 1) % filtered.count
                    }
                    return .handled
                }
                .onKeyPress(.return) {
                    runSelected()
                    return .handled
                }
                .onKeyPress(.escape) {
                    close()
                    return .handled
                }

            ScrollView {
                LazyVStack(spacing: 2) {
                    ForEach(Array(filtered.enumerated()), id: \.element.id) { index, cmd in
                        CommandRow(
                            command: cmd,
                            isSelected: index == selectedIndex
                        )
                        .contentShape(Rectangle())
                        .onTapGesture {
                            selectedIndex = index
                            runSelected()
                        }
                        .onHover { hovering in
                            if hovering { selectedIndex = index }
                        }
                    }
                    if filtered.isEmpty {
                        Text("No matches")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                            .padding(.vertical, 12)
                    }
                }
            }
            .frame(maxHeight: 360)

            HStack(spacing: Tokens.Spacing.controlGap) {
                KeyHint("↑↓"); Text("navigate")
                KeyHint("⏎");  Text("run")
                KeyHint("Esc"); Text("close")
            }
            .font(.caption2)
            .foregroundStyle(.tertiary)
            .padding(.horizontal, 12)
            .padding(.top, 2)
            .padding(.bottom, 4)
        }
        .padding(8)
        .frame(width: 640)
        .frame(maxHeight: 480)
        .glassEffect(.regular, in: .rect(cornerRadius: Tokens.Radius.md))
        .onAppear { inputFocused = true }
    }

    private func runSelected() {
        guard selectedIndex < filtered.count else { return }
        close()
    }

    private func close() {
        withAnimation(Tokens.Easing.standard(duration: Tokens.Duration.fast)) {
            isOpen = false
        }
    }
}

private struct CommandRow: View {
    let command: PaletteCommand
    let isSelected: Bool

    var body: some View {
        HStack {
            Text(command.label)
                .font(.body)
            Spacer()
            if let shortcut = command.shortcut {
                Text(shortcut)
                    .font(.caption.monospaced())
                    .foregroundStyle(.tertiary)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .frame(minHeight: 44)
        .background(
            RoundedRectangle(cornerRadius: Tokens.Radius.sm, style: .continuous)
                .fill(isSelected ? Color.primary.opacity(0.08) : Color.clear)
        )
    }
}

private struct KeyHint: View {
    let key: String
    init(_ key: String) { self.key = key }
    var body: some View {
        Text(key)
            .font(.caption2.monospaced())
            .padding(.horizontal, 5)
            .padding(.vertical, 1)
            .background(
                RoundedRectangle(cornerRadius: 4, style: .continuous)
                    .fill(Color.primary.opacity(0.06))
            )
    }
}

// MARK: - Scroll edge effects

struct ScrollEdgeEffectsSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: Tokens.Spacing.panelGap) {
            SectionHeader(
                eyebrow: "Patterns",
                title: "Scroll edge effects",
                lede: "How scrolling content fades or hardens beneath floating chrome. .soft (default) on iOS / iPadOS and most macOS scrolling content; .hard for pinned headers, text editors, and inspector panes. One style per edge — never mix soft + hard on adjacent edges."
            )

            HStack(alignment: .top, spacing: Tokens.Spacing.panelGap) {
                EdgeEffectDemo(title: "Soft · default fade", style: .soft)
                EdgeEffectDemo(title: "Hard · sharp shelf", style: .hard)
            }

            Text("Apply edge effects only where a floating chrome element actually sits. Reduced Transparency collapses .soft to a thin line and .hard to a solid divider — the system handles it.")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
    }
}

private struct EdgeEffectDemo: View {
    let title: String
    let style: ScrollEdgeEffectStyle

    var body: some View {
        VStack(alignment: .leading, spacing: Tokens.Spacing.controlGap) {
            Text(title.uppercased())
                .font(.caption.weight(.semibold))
                .tracking(0.06 * 11)
                .foregroundStyle(.secondary)

            ZStack(alignment: .top) {
                ScrollView {
                    VStack(alignment: .leading, spacing: 8) {
                        ForEach(0..<24) { i in
                            HStack {
                                Text("Row \(i + 1)")
                                    .font(.subheadline)
                                Spacer()
                                Text("\(60 - i * 2) min ago")
                                    .font(.footnote)
                                    .foregroundStyle(.secondary)
                            }
                            .padding(.horizontal, Tokens.Spacing.panelGap)
                            .padding(.vertical, 6)
                            Divider()
                        }
                    }
                    .padding(.top, 56)
                }
                .scrollEdgeEffectStyle(style, for: .top)

                GlassEffectContainer(spacing: 4) {
                    HStack(spacing: Tokens.Spacing.controlGap) {
                        Button { } label: { Image(systemName: "line.3.horizontal.decrease") }
                            .buttonStyle(.glass).buttonBorderShape(.capsule)
                        Spacer()
                        Text("Inbox")
                            .font(.subheadline.weight(.semibold))
                        Spacer()
                        Button { } label: { Image(systemName: "ellipsis") }
                            .buttonStyle(.glass).buttonBorderShape(.capsule)
                    }
                    .padding(.horizontal, Tokens.Spacing.controlGap)
                    .padding(.vertical, 6)
                }
                .padding(Tokens.Spacing.controlGap)
            }
            .frame(height: 220)
            .clipShape(RoundedRectangle(cornerRadius: Tokens.Radius.md, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: Tokens.Radius.md, style: .continuous)
                    .strokeBorder(Color.primary.opacity(0.08))
            )
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
