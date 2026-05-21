import SwiftUI

// Tokens lifted verbatim from spec/tokens/*.yaml.
// Do not invent values here; add to the spec first.

enum Tokens {
    enum Radius {
        static let sm: CGFloat = 12
        static let md: CGFloat = 16
        static let lg: CGFloat = 24
        static let xl: CGFloat = 28
    }

    enum Spacing {
        static let controlGap: CGFloat = 8
        static let groupGap: CGFloat = 12
        static let panelGap: CGFloat = 16
        static let screenMarginCompact: CGFloat = 16
        static let screenMarginRegular: CGFloat = 24
        static let sectionGap: CGFloat = 32
    }

    enum Duration {
        static let instant: Double = 0.080
        static let fast: Double = 0.160
        static let base: Double = 0.240
        static let slow: Double = 0.360
        static let sheet: Double = 0.420
    }

    enum Easing {
        static let standard = UnitCurve.bezier(
            startControlPoint: .init(x: 0.2, y: 0),
            endControlPoint: .init(x: 0, y: 1)
        )
        static let decelerate = UnitCurve.bezier(
            startControlPoint: .init(x: 0, y: 0),
            endControlPoint: .init(x: 0, y: 1)
        )
        static let accelerate = UnitCurve.bezier(
            startControlPoint: .init(x: 0.3, y: 0),
            endControlPoint: .init(x: 1, y: 1)
        )
        static let spring = Animation.spring(
            response: 0.42,
            dampingFraction: 0.65,
            blendDuration: 0
        )
    }
}

// Concentric helper — child = parent − inset.
func concentricRadius(parent: CGFloat, inset: CGFloat) -> CGFloat {
    max(0, parent - inset)
}
