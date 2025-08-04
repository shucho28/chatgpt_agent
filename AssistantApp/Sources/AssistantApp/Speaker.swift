#if canImport(AVFoundation)
import AVFoundation

class Speaker {
    private let synthesizer = AVSpeechSynthesizer()

    func speak(_ text: String) {
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        synthesizer.speak(utterance)
    }
}
#else
class Speaker {
    func speak(_ text: String) {
        // Stub for platforms without AVFoundation
    }
}
#endif
