import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

struct OpenAIMessage: Codable {
    let role: String
    let content: String
}

struct OpenAIRequest: Codable {
    let model: String
    let messages: [OpenAIMessage]
}

class OpenAIClient {
    private let apiKey = ProcessInfo.processInfo.environment["OPENAI_API_KEY"] ?? ""

    func sendMessage(_ userText: String, completion: @escaping @Sendable (String?) -> Void) {
        guard let url = URL(string: "https://api.openai.com/v1/chat/completions") else {
            completion(nil)
            return
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = OpenAIRequest(model: "gpt-4-turbo", messages: [
            OpenAIMessage(role: "system", content: "You are a helpful assistant."),
            OpenAIMessage(role: "user", content: userText)
        ])
        request.httpBody = try? JSONEncoder().encode(body)

        URLSession.shared.dataTask(with: request) { data, _, error in
            guard let data = data,
                  error == nil,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let choices = json["choices"] as? [[String: Any]],
                  let message = choices.first?["message"] as? [String: Any],
                  let content = message["content"] as? String else {
                completion(nil)
                return
            }
            completion(content.trimmingCharacters(in: .whitespacesAndNewlines))
        }.resume()
    }
}
