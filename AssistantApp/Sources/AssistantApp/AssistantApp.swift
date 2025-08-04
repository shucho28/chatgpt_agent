// Entry point for the app. Provides a stub on non-SwiftUI platforms.
#if canImport(SwiftUI)
import SwiftUI

@main
struct AssistantAppApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
#else
@main
struct AssistantAppApp {
    static func main() {
        print("AssistantApp requires SwiftUI and is intended for iOS.")
    }
}
#endif
