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
