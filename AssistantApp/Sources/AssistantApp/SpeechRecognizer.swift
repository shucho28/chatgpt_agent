#if canImport(Speech) && canImport(AVFoundation) && canImport(Combine)
import Foundation
import Speech
import AVFoundation
import Combine

class SpeechRecognizer: ObservableObject {
    private var recognizer = SFSpeechRecognizer()
    private var audioEngine = AVAudioEngine()
    private var request = SFSpeechAudioBufferRecognitionRequest()
    private var task: SFSpeechRecognitionTask?

    @Published var transcribedText = ""
    @Published var isRecording = false

    func startRecording() throws {
        SFSpeechRecognizer.requestAuthorization { authStatus in
            guard authStatus == .authorized else { return }
        }
        let node = audioEngine.inputNode
        let recordingFormat = node.outputFormat(forBus: 0)
        node.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in
            self.request.append(buffer)
        }

        audioEngine.prepare()
        try audioEngine.start()
        isRecording = true

        task = recognizer?.recognitionTask(with: request) { result, _ in
            guard let result = result else { return }
            DispatchQueue.main.async {
                self.transcribedText = result.bestTranscription.formattedString
            }
        }
    }

    func stopRecording() {
        audioEngine.stop()
        request.endAudio()
        task?.cancel()
        isRecording = false
    }
}
#else
class SpeechRecognizer {
    var transcribedText = ""
    var isRecording = false

    func startRecording() throws {}
    func stopRecording() {}
}
#endif
