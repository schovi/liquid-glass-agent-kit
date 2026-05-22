import SwiftUI

// MARK: - Section root

struct InputsOverlaysSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: Tokens.Spacing.panelGap) {
            SectionHeader(
                eyebrow: "Components",
                title: "Inputs & overlays",
                lede: "Popover, menu, search field, toggle, slider, progress, badge, and a floating HUD. Glass is automatic on the menu, popover, and HUD; the rest stay solid because they sit in the content layer or behind text the user is reading."
            )

            PopoverDemo()
            MenuDemo()
            SearchInlineDemo()
            ToggleDemo()
            SliderDemo()
            ProgressDemo()
            BadgeDemo()
            FloatingHUDDemo()
            SystemPrimitivesDemo()
        }
    }
}

// MARK: - Popover

struct PopoverDemo: View {
    @State private var isShown = false

    var body: some View {
        ComponentCard(title: "Popover · Regular glass + arrow") {
            Button {
                isShown.toggle()
            } label: {
                Label("Show details", systemImage: "info.circle")
            }
            .buttonStyle(.glass)
            .controlSize(.large)
            .popover(isPresented: $isShown, arrowEdge: .bottom) {
                VStack(alignment: .leading, spacing: 2) {
                    PopoverRow(icon: "star",              label: "Favorite")
                    PopoverRow(icon: "arrow.down.circle", label: "Download")
                    PopoverRow(icon: "trash",             label: "Delete")
                }
                .padding(8)
                .frame(minWidth: 220)
            }
        }
    }
}

// MARK: - Menu

struct MenuDemo: View {
    var body: some View {
        ComponentCard(title: "Menu · pull-down + shortcuts + separators") {
            Menu {
                Button("New",          systemImage: "plus")           { }
                    .keyboardShortcut("n")
                Button("Open…",        systemImage: "folder")         { }
                    .keyboardShortcut("o")
                Divider()
                Button("Export tokens", systemImage: "arrow.down.circle") { }
                    .keyboardShortcut("e", modifiers: [.command, .option])
                Divider()
                Button("Move to Trash", systemImage: "trash", role: .destructive) { }
                    .keyboardShortcut(.delete, modifiers: .command)
            } label: {
                Label("File", systemImage: "doc")
            }
            .menuStyle(.button)
            .buttonStyle(.glass)
            .controlSize(.large)
        }
    }
}

// MARK: - Search field (inline)

struct SearchInlineDemo: View {
    @State private var query: String = ""

    var body: some View {
        ComponentCard(title: "Search field · 44 tall, solid (inline variant)") {
            HStack(spacing: 6) {
                Image(systemName: "magnifyingglass")
                    .foregroundStyle(.secondary)
                TextField("Search tokens…", text: $query)
                    .textFieldStyle(.plain)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: Tokens.Radius.sm, style: .continuous)
                    .fill(Color(nsColor: .controlBackgroundColor))
            )
            .overlay(
                RoundedRectangle(cornerRadius: Tokens.Radius.sm, style: .continuous)
                    .strokeBorder(Color.primary.opacity(0.12))
            )
            .frame(maxWidth: 320)
        }
    }
}

// MARK: - Toggle

struct ToggleDemo: View {
    @State private var emailUpdates = true
    @State private var push = false
    @State private var disabled = true

    var body: some View {
        ComponentCard(title: "Toggle · 38×22 capsule, solid track") {
            HStack(spacing: Tokens.Spacing.panelGap) {
                Toggle("Email updates", isOn: $emailUpdates)
                Toggle("Push", isOn: $push)
                Toggle("Disabled", isOn: $disabled)
                    .disabled(true)
            }
            .toggleStyle(.switch)
        }
    }
}

// MARK: - Slider

struct SliderDemo: View {
    @State private var volume: Double = 0.64
    @State private var balance: Double = 0.5

    var body: some View {
        ComponentCard(title: "Slider · 4 pt track, 22 pt thumb, neutralValue 0.5") {
            VStack(alignment: .leading, spacing: Tokens.Spacing.groupGap) {
                HStack {
                    Slider(value: $volume, in: 0...1) {
                        Text("Volume")
                    } minimumValueLabel: {
                        Image(systemName: "speaker.wave.1")
                    } maximumValueLabel: {
                        Image(systemName: "speaker.wave.3")
                    }
                    Text(String(format: "%.2f", volume))
                        .font(.system(.caption, design: .monospaced))
                        .foregroundStyle(.secondary)
                        .frame(width: 40, alignment: .trailing)
                }
                HStack {
                    Slider(value: $balance, in: 0...1, neutralValue: 0.5) {
                        Text("Balance")
                    }
                    Text("Pan")
                        .font(.system(.caption, design: .monospaced))
                        .foregroundStyle(.secondary)
                        .frame(width: 40, alignment: .trailing)
                }
            }
        }
    }
}

// MARK: - Progress

struct ProgressDemo: View {
    @State private var value: Double = 0.42

    var body: some View {
        ComponentCard(title: "Progress · linear (det / indet) + circular spinners") {
            VStack(alignment: .leading, spacing: Tokens.Spacing.groupGap) {
                ProgressView("Uploading", value: value, total: 1.0)
                    .progressViewStyle(.linear)
                ProgressView("Loading")
                    .progressViewStyle(.linear)
                HStack(spacing: Tokens.Spacing.panelGap) {
                    ProgressView()
                        .progressViewStyle(.circular)
                        .controlSize(.small)
                    ProgressView()
                        .progressViewStyle(.circular)
                        .controlSize(.regular)
                    ProgressView()
                        .progressViewStyle(.circular)
                        .controlSize(.large)
                }
            }
        }
    }
}

// MARK: - Badge

struct BadgeDemo: View {
    var body: some View {
        ComponentCard(title: "Badge · 20 pt capsule, solid (never on glass)") {
            HStack(spacing: Tokens.Spacing.controlGap) {
                StatusBadge(kind: .neutral, label: "Neutral")
                StatusBadge(kind: .info,    label: "Beta")
                StatusBadge(kind: .success, label: "Passing")
                StatusBadge(kind: .warning, label: "Warn")
                StatusBadge(kind: .danger,  label: "Error")
                StatusBadge(kind: .counter, label: "12")
            }
        }
    }
}

struct StatusBadge: View {
    enum Kind { case neutral, info, success, warning, danger, counter }

    let kind: Kind
    let label: String

    var body: some View {
        Text(label)
            .font(.caption.weight(.semibold))
            .padding(.horizontal, 8)
            .padding(.vertical, 2)
            .frame(minWidth: 20, minHeight: 20)
            .foregroundStyle(foreground)
            .background(Capsule().fill(background))
    }

    private var background: Color {
        switch kind {
        case .neutral: return .gray.opacity(0.20)
        case .info:    return .blue.opacity(0.16)
        case .success: return .green.opacity(0.18)
        case .warning: return .orange.opacity(0.20)
        case .danger:  return .red.opacity(0.18)
        case .counter: return .red
        }
    }

    private var foreground: Color {
        switch kind {
        case .neutral: return .primary
        case .info:    return .blue
        case .success: return .green
        case .warning: return .orange
        case .danger:  return .red
        case .counter: return .white
        }
    }
}

// MARK: - Floating HUD

struct FloatingHUDDemo: View {
    var body: some View {
        ComponentCard(title: "Floating HUD · GlassEffectContainer over media") {
            ZStack {
                // Backdrop so the glass has something to refract against.
                ZStack {
                    LinearGradient(colors: [Color(red: 0.16, green: 0.12, blue: 0.36),
                                            Color(red: 0.12, green: 0.10, blue: 0.18)],
                                   startPoint: .top, endPoint: .bottom)
                    RadialGradient(colors: [Color.pink.opacity(0.7), .clear],
                                   center: .init(x: 0.3, y: 0.25), startRadius: 0, endRadius: 220)
                    RadialGradient(colors: [Color.blue.opacity(0.7), .clear],
                                   center: .init(x: 0.8, y: 0.7), startRadius: 0, endRadius: 240)
                }

                // The HUD itself.
                VStack {
                    Spacer()
                    GlassEffectContainer(spacing: 4) {
                        HStack(spacing: 4) {
                            ForEach([
                                ("backward.fill",  "Previous"),
                                ("play.fill",      "Play"),
                                ("forward.fill",   "Next"),
                                ("speaker.wave.2", "Mute"),
                            ], id: \.0) { item in
                                Button { } label: {
                                    Image(systemName: item.0)
                                        .font(.system(size: 16))
                                        .frame(width: 40, height: 40)
                                }
                                .buttonStyle(.glass)
                                .buttonBorderShape(.capsule)
                                .help(item.1)
                            }
                        }
                        .padding(6)
                    }
                    .padding(.bottom, Tokens.Spacing.screenMarginCompact)
                }
            }
            .frame(height: 180)
            .clipShape(RoundedRectangle(cornerRadius: Tokens.Radius.lg, style: .continuous))
        }
    }
}

// MARK: - System primitives

struct SystemPrimitivesDemo: View {
    @State private var alertShown = false
    @State private var confirmShown = false

    var body: some View {
        ComponentCard(title: "System primitives · alert · confirmation · tooltip") {
            HStack(spacing: Tokens.Spacing.controlGap) {
                Button("Show alert") {
                    alertShown = true
                }
                .buttonStyle(.glass)
                .help("Native NSAlert — system-rendered, do not restyle (⌘K)")
                .alert("Discard changes?", isPresented: $alertShown) {
                    Button("Discard", role: .destructive) { }
                    Button("Cancel",  role: .cancel)      { }
                } message: {
                    Text("Your unsaved edits will be lost.")
                }

                Button("Confirm delete") {
                    confirmShown = true
                }
                .buttonStyle(.glass)
                .help("Confirmation dialog · use when more than two options are needed")
                .confirmationDialog("Delete 3 items?",
                                    isPresented: $confirmShown,
                                    titleVisibility: .visible) {
                    Button("Delete", role: .destructive) { }
                    Button("Cancel", role: .cancel)      { }
                } message: {
                    Text("This cannot be undone.")
                }

                Button {
                } label: {
                    Label("Hover for tooltip", systemImage: "info.circle")
                }
                .buttonStyle(.borderless)
                .help("Use .help(_:) for native tooltips — never reimplement.")
            }
        }
    }
}
