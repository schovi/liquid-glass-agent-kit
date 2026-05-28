// Metal shaders for the Liquid Glass showcase's hero surface.
//
// Companion to plugins/apple-agent-kit/skills/liquid-glass/references/metal-shaders.md.
// SwiftPM auto-compiles .metal files in the target's source directory and
// exposes their [[ stitchable ]] functions via ShaderLibrary.default, so
// ShaderHeroSection.swift can call `ShaderLibrary.lensRefract(...)`
// directly. The reference doc carries the full math; this is the
// minimal lens shader that gets us past "is the wiring real".
//
// Why a shader here at all: this surface deliberately needs something
// `.glassEffect` does not express — an SDF-edge-weighted refraction
// without sampling a real backdrop. `.glassEffect` first; shader only
// when the brief actually needs it.

#include <metal_stdlib>
#include <SwiftUI/SwiftUI.h>
using namespace metal;

[[ stitchable ]] half4 lensRefract(float2 position,
                                   SwiftUI::Layer layer,
                                   float2 size,
                                   float strength) {
    float2 uv = position / size;
    float2 toCenter = uv - float2(0.5, 0.5);

    // Rounded-rect SDF (half-extents 0.45, corner radius 0.18 in uv).
    // Negative inside the surface, positive outside, zero on the rim.
    float r = 0.18;
    float2 q = abs(toCenter) - (float2(0.45, 0.45) - r);
    float  d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;

    // Bell curve centered on the rim. Wide enough to be visible, narrow
    // enough not to muddy the surface center.
    float rim     = exp(-pow(d * 24.0, 2.0));
    float2 offset = -normalize(toCenter + 1e-5) * rim * strength;

    return layer.sample(position + offset * size);
}
