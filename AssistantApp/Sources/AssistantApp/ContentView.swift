#if canImport(SwiftUI)
import SwiftUI

struct ContentView: View {
    @StateObject private var speechRecognizer = SpeechRecognizer()
    @State private var userText = ""
    @State private var assistantText = ""

    private let client = OpenAIClient()
    private let speaker = Speaker()

    var body: some View {
        VStack {
            AnimatedAssistantView(animationName: "assistantAnimation")
                .frame(width: 200, height: 200)

            ScrollView {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Assistant: \(assistantText)")
                        .frame(maxWidth: .infinity, alignment: .leading)
                    Text("You: \(userText)")
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
            .padding()

            Button(action: toggleRecording) {
                Image(systemName: speechRecognizer.isRecording ? "stop.circle" : "mic.circle")
                    .resizable()
                    .frame(width: 64, height: 64)
            }
            .padding()
        }
        .onChange(of: speechRecognizer.transcribedText) { newValue in
            userText = newValue
        }
    }

    private func toggleRecording() {
        if speechRecognizer.isRecording {
            speechRecognizer.stopRecording()
            sendToOpenAI()
        } else {
            try? speechRecognizer.startRecording()
        }
    }

    private func sendToOpenAI() {
        let text = userText
        client.sendMessage(text) { response in
            guard let response = response else { return }
            DispatchQueue.main.async {
                assistantText = response
                speaker.speak(response)
            }
        }
    }
}
#endif
