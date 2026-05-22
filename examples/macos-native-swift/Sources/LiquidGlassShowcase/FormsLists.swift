import SwiftUI

// MARK: - Section root

struct FormsListsSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: Tokens.Spacing.panelGap) {
            SectionHeader(
                eyebrow: "Components",
                title: "Forms & lists",
                lede: "Form rows, inset list with grouped sections, disclosure groups, and a stepper. Solid throughout — glass behind body content is anti-pattern A2."
            )

            FormRowsDemo()
            InsetListDemo()
            DisclosureDemo()
            StepperDemo()
        }
    }
}

// MARK: - Form rows
//
// Showcase wrapper: `Form { Section { ... } }.formStyle(.grouped)` is the right
// API in a full settings pane, but inside the outer ScrollView of this
// showcase, a Form takes infinite intrinsic height and scrolls internally.
// We compose the same visuals with a VStack so the section sizes to content.
// Real apps use the real Form/Section APIs — see references/patterns/form-rows.md.

struct FormRowsDemo: View {
    @State private var emailUpdates = true
    @State private var density: Double = 0.5
    @State private var sessions: Int = 3

    var body: some View {
        ComponentCard(title: "Form rows · LabeledContent, solid, never glass") {
            VStack(alignment: .leading, spacing: Tokens.Spacing.panelGap) {
                InsetSection(header: "Notifications") {
                    InsetRow(label: "Email updates") {
                        Toggle("Email updates", isOn: $emailUpdates)
                            .labelsHidden()
                    }
                }
                InsetSection(
                    header: "Display",
                    footer: "Footnote text gives non-obvious context for the row above."
                ) {
                    InsetRow(label: "Density") {
                        Slider(value: $density, in: 0...1)
                            .frame(minWidth: 160, maxWidth: 240)
                    }
                    InsetRowDivider()
                    InsetRow(label: "Sessions") {
                        Stepper("\(sessions)", value: $sessions, in: 0...99)
                            .labelsHidden()
                    }
                }
            }
        }
    }
}

// MARK: - Inset list
//
// Same compromise as Form rows: `List { ... }.listStyle(.inset)` is the right
// API in a sidebar / settings pane, but inside the outer ScrollView the List
// claims infinite height and scrolls internally. We render the same look with
// a VStack composition that sizes to content. Real apps use the real List API
// — see references/patterns/inset-list.md.

struct InsetListDemo: View {
    private let recents: [(label: String, icon: String, badge: Int?)] = [
        ("Materials",  "circle.lefthalf.filled", 2),
        ("Spacing",    "rectangle.split.3x1",    nil),
        ("Typography", "textformat",             nil),
    ]
    private let pinned: [(label: String, icon: String)] = [
        ("Toolbar", "rectangle.dock"),
        ("Sheet",   "arrow.up.to.line"),
    ]

    var body: some View {
        ComponentCard(title: "Inset list · grouped sections, solid rows") {
            VStack(alignment: .leading, spacing: Tokens.Spacing.panelGap) {
                InsetSection(header: "Recents") {
                    ForEach(Array(recents.enumerated()), id: \.element.label) { index, row in
                        if index > 0 { InsetRowDivider() }
                        InsetRow(icon: row.icon, label: row.label) {
                            if let badge = row.badge {
                                StatusBadge(kind: .counter, label: "\(badge)")
                            }
                        }
                    }
                }
                InsetSection(
                    header: "Pinned",
                    footer: "Compact rows are 32 tall; default rows are 44."
                ) {
                    ForEach(Array(pinned.enumerated()), id: \.element.label) { index, row in
                        if index > 0 { InsetRowDivider() }
                        InsetRow(icon: row.icon, label: row.label, compact: true) {
                            EmptyView()
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Inset section / row helpers

struct InsetSection<Content: View>: View {
    let header: String?
    let footer: String?
    @ViewBuilder let content: () -> Content

    init(header: String? = nil,
         footer: String? = nil,
         @ViewBuilder content: @escaping () -> Content) {
        self.header = header
        self.footer = footer
        self.content = content
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if let header {
                Text(header)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 4)
            }
            VStack(spacing: 0) {
                content()
            }
            .background(
                RoundedRectangle(cornerRadius: Tokens.Radius.sm, style: .continuous)
                    .fill(Color(nsColor: .controlBackgroundColor))
            )
            .overlay(
                RoundedRectangle(cornerRadius: Tokens.Radius.sm, style: .continuous)
                    .strokeBorder(Color.primary.opacity(0.08))
            )
            .clipShape(RoundedRectangle(cornerRadius: Tokens.Radius.sm, style: .continuous))
            if let footer {
                Text(footer)
                    .font(.footnote)
                    .foregroundStyle(.tertiary)
                    .padding(.horizontal, 4)
            }
        }
    }
}

struct InsetRow<Trailing: View>: View {
    let icon: String?
    let label: String
    let compact: Bool
    @ViewBuilder let trailing: () -> Trailing

    init(icon: String? = nil,
         label: String,
         compact: Bool = false,
         @ViewBuilder trailing: @escaping () -> Trailing = { EmptyView() }) {
        self.icon = icon
        self.label = label
        self.compact = compact
        self.trailing = trailing
    }

    var body: some View {
        HStack(spacing: Tokens.Spacing.controlGap) {
            if let icon {
                Image(systemName: icon)
                    .font(.system(size: 14))
                    .foregroundStyle(.secondary)
                    .frame(width: 20, alignment: .center)
            }
            Text(label)
                .font(compact ? .footnote : .body)
            Spacer(minLength: Tokens.Spacing.controlGap)
            trailing()
        }
        .padding(.horizontal, 12)
        .padding(.vertical, compact ? 4 : 8)
        .frame(minHeight: compact ? 32 : 44, alignment: .center)
    }
}

struct InsetRowDivider: View {
    var body: some View {
        Rectangle()
            .fill(Color.primary.opacity(0.08))
            .frame(height: 1)
    }
}

// MARK: - Disclosure group

struct DisclosureDemo: View {
    @State private var advancedExpanded = true
    @State private var devExpanded = false

    var body: some View {
        ComponentCard(title: "Disclosure group · 16 pt indent per depth, solid") {
            VStack(alignment: .leading, spacing: Tokens.Spacing.groupGap) {
                DisclosureGroup(isExpanded: $advancedExpanded) {
                    Text("Reveal-on-demand controls live inside disclosure groups. The body indents by 16 (panelGap).")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .padding(.leading, Tokens.Spacing.panelGap)
                } label: {
                    Label("Advanced", systemImage: "gearshape.2")
                }

                DisclosureGroup(isExpanded: $devExpanded) {
                    Text("Outline groups go deeper but cap visible depth at three in a content panel.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .padding(.leading, Tokens.Spacing.panelGap)
                } label: {
                    Label("Developer", systemImage: "hammer")
                }
            }
            .padding(.horizontal, Tokens.Spacing.panelGap)
            .padding(.vertical, Tokens.Spacing.groupGap)
            .background(
                RoundedRectangle(cornerRadius: Tokens.Radius.sm, style: .continuous)
                    .fill(Color(nsColor: .controlBackgroundColor))
            )
        }
    }
}

// MARK: - Stepper (toolbar variant)

struct StepperDemo: View {
    @State private var sessions: Int = 3

    var body: some View {
        ComponentCard(title: "Stepper · toolbar variant (shared glass capsule)") {
            HStack(spacing: Tokens.Spacing.groupGap) {
                GlassEffectContainer(spacing: 4) {
                    HStack(spacing: 4) {
                        Button {
                            sessions = max(0, sessions - 1)
                        } label: {
                            Image(systemName: "minus")
                                .frame(width: 28, height: 28)
                        }
                        .buttonStyle(.glass)
                        .buttonBorderShape(.capsule)
                        .disabled(sessions == 0)

                        Button {
                            sessions = min(99, sessions + 1)
                        } label: {
                            Image(systemName: "plus")
                                .frame(width: 28, height: 28)
                        }
                        .buttonStyle(.glass)
                        .buttonBorderShape(.capsule)
                    }
                }
                Text("\(sessions)")
                    .font(.system(.body, design: .monospaced).weight(.medium))
                    .frame(minWidth: 36, alignment: .leading)
            }
        }
    }
}

// MARK: - Badge row helper

struct BadgeRow: View {
    let label: String
    let badge: StatusBadge

    var body: some View {
        HStack {
            Text(label)
            Spacer()
            badge
        }
    }
}
