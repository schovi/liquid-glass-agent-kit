import SwiftUI

enum SectionID: String, CaseIterable, Identifiable, Hashable {
    case materials, shape, spacing, typography, motion
    case buttons, controls, inputsOverlays, formsLists, surfaces, sheet
    case commandPalette, morphing, scrollEdgeEffects, shaderHero
    case rules, antiPatterns, clearVariant

    var id: Self { self }

    var label: String {
        switch self {
        case .materials: return "Materials"
        case .shape: return "Shape"
        case .spacing: return "Spacing"
        case .typography: return "Typography"
        case .motion: return "Motion"
        case .buttons: return "Buttons"
        case .controls: return "Controls"
        case .inputsOverlays: return "Inputs & overlays"
        case .formsLists: return "Forms & lists"
        case .surfaces: return "Surfaces"
        case .sheet: return "Sheet"
        case .commandPalette: return "Command palette"
        case .morphing: return "Morphing"
        case .scrollEdgeEffects: return "Scroll edge effects"
        case .shaderHero: return "Shader hero"
        case .rules: return "Rules"
        case .antiPatterns: return "Anti-patterns"
        case .clearVariant: return "Clear variant"
        }
    }

    var systemImage: String {
        switch self {
        case .materials: return "circle.lefthalf.filled"
        case .shape: return "circle"
        case .spacing: return "rectangle.split.3x1"
        case .typography: return "textformat"
        case .motion: return "wave.3.right"
        case .buttons: return "square.fill"
        case .controls: return "switch.2"
        case .inputsOverlays: return "slider.horizontal.3"
        case .formsLists: return "list.bullet.rectangle"
        case .surfaces: return "square.stack.3d.up"
        case .sheet: return "arrow.up.to.line"
        case .commandPalette: return "command"
        case .morphing: return "arrow.triangle.merge"
        case .scrollEdgeEffects: return "line.horizontal.3.decrease"
        case .shaderHero: return "wand.and.stars"
        case .rules: return "checkmark.seal"
        case .antiPatterns: return "xmark.seal"
        case .clearVariant: return "drop"
        }
    }

    var badge: Int? {
        switch self {
        case .materials: return 2
        default: return nil
        }
    }

    var group: SectionGroup {
        switch self {
        case .materials, .shape, .spacing, .typography, .motion: return .foundations
        case .buttons, .controls, .inputsOverlays, .formsLists, .surfaces, .sheet: return .components
        case .commandPalette, .morphing, .scrollEdgeEffects, .shaderHero: return .patterns
        case .rules, .antiPatterns, .clearVariant: return .reference
        }
    }
}

enum SectionGroup: String, CaseIterable, Identifiable {
    case foundations, components, patterns, reference
    var id: Self { self }
    var label: String {
        switch self {
        case .foundations: return "Foundations"
        case .components: return "Components"
        case .patterns: return "Patterns"
        case .reference: return "Reference"
        }
    }
}

struct Sidebar: View {
    @Binding var selection: SectionID

    var body: some View {
        List(selection: $selection) {
            ForEach(SectionGroup.allCases) { group in
                Section(group.label) {
                    ForEach(SectionID.allCases.filter { $0.group == group }) { item in
                        NavigationLink(value: item) {
                            Label(item.label, systemImage: item.systemImage)
                        }
                        .badge(item.badge ?? 0)
                    }
                }
            }
        }
        .navigationTitle("Showcase")
        .listStyle(.sidebar)
        .frame(minWidth: 200, idealWidth: 220)
    }
}
