// Animated view backed by Lottie on supported platforms.
#if canImport(SwiftUI) && canImport(UIKit)
import SwiftUI
import Lottie
import UIKit

struct AnimatedAssistantView: UIViewRepresentable {
    let animationName: String

    func makeUIView(context: Context) -> UIView {
        let view = LottieAnimationView(name: animationName)
        view.loopMode = .loop
        view.play()
        return view
    }

    func updateUIView(_ uiView: UIView, context: Context) {}
}
#else
// Placeholder type for non-UI platforms.
struct AnimatedAssistantView {}
#endif
