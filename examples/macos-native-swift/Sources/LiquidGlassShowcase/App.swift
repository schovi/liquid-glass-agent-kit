import AppKit
import SwiftUI

@main
struct LiquidGlassShowcaseApp: App {
    init() {
        // swift-run launches SPM executables as background processes by default,
        // which means NSWindow never transitions to .inactive and system controls
        // never dim on focus loss. Force the regular foreground policy so the
        // Liquid Glass key/inactive treatment kicks in.
        NSApplication.shared.setActivationPolicy(.regular)
        NSApplication.shared.activate(ignoringOtherApps: true)
    }

    var body: some Scene {
        WindowGroup("Liquid Glass — macOS 26 Showcase") {
            ContentView()
        }
        .windowStyle(.titleBar)
        .windowToolbarStyle(.unified(showsTitle: true))
        .defaultSize(width: 1180, height: 760)
    }
}
