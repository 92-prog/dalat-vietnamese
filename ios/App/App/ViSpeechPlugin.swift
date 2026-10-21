import Foundation
import AVFoundation
import Capacitor
import Speech

// 베트남어(vi-VN) 음성인식. 정답 문장으로 유도하지 않고 들린 그대로(bestTranscription)를 돌려줘서
// 성조까지 엄격하게 판정할 수 있게 한다. 기기 안에서 인식할 수 있으면 인터넷 없이 인식한다.
@objc(ViSpeechPlugin)
public class ViSpeechPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ViSpeechPlugin"
    public let jsName = "ViSpeech"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "requestPermission", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
    ]

    private let recognizer = SFSpeechRecognizer(locale: Locale(identifier: "vi-VN"))
    private let engine = AVAudioEngine()
    private var request: SFSpeechAudioBufferRecognitionRequest?
    private var task: SFSpeechRecognitionTask?
    private var latest = ""
    private var lastError: String?
    private var stopCall: CAPPluginCall?

    @objc func requestPermission(_ call: CAPPluginCall) {
        SFSpeechRecognizer.requestAuthorization { status in
            guard status == .authorized else { return call.resolve(["granted": false, "denied": "speech"]) }
            AVAudioSession.sharedInstance().requestRecordPermission { ok in
                call.resolve(ok ? ["granted": true] : ["granted": false, "denied": "mic"])
            }
        }
    }

    @objc func start(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let recognizer = self.recognizer, recognizer.isAvailable else {
                return call.reject("베트남어 음성인식을 지금 쓸 수 없어요", "UNAVAILABLE")
            }
            self.cleanup()
            do {
                let audio = AVAudioSession.sharedInstance()
                try audio.setCategory(.playAndRecord, mode: .measurement, options: [.duckOthers, .defaultToSpeaker])
                try audio.setActive(true, options: .notifyOthersOnDeactivation)

                let request = SFSpeechAudioBufferRecognitionRequest()
                request.shouldReportPartialResults = true
                if recognizer.supportsOnDeviceRecognition { request.requiresOnDeviceRecognition = true }
                if #available(iOS 16, *) { request.addsPunctuation = false }

                let input = self.engine.inputNode
                input.installTap(onBus: 0, bufferSize: 1024, format: input.outputFormat(forBus: 0)) { buffer, _ in
                    request.append(buffer)
                }
                self.engine.prepare()
                try self.engine.start()

                self.request = request
                self.latest = ""
                self.lastError = nil
                self.task = recognizer.recognitionTask(with: request) { [weak self] result, error in
                    DispatchQueue.main.async {
                        guard let self = self, self.request === request else { return }
                        if let result = result {
                            self.latest = result.bestTranscription.formattedString
                            self.notifyListeners("partial", data: ["text": self.latest])
                            if result.isFinal { self.finish() }
                        }
                        if let error = error {
                            self.lastError = error.localizedDescription
                            self.finish()
                        }
                    }
                }
                call.resolve()
            } catch {
                self.cleanup()
                call.reject("마이크를 켜지 못했어요", "MIC_FAILED", error)
            }
        }
    }

    /// 녹음을 멈추고 최종 인식 결과 { text, error? }를 돌려준다.
    @objc func stop(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard self.request != nil else { return call.resolve(["text": self.latest]) }
            self.stopCall?.resolve(["text": self.latest])
            self.stopCall = call
            self.stopEngine()
            self.request?.endAudio()
            // 최종 결과가 늦게 오면 그때까지 들린 것으로 마무리한다.
            let request = self.request
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                if self.request === request { self.finish() }
            }
        }
    }

    private func finish() {
        if let call = stopCall {
            var data: [String: Any] = ["text": latest]
            if latest.isEmpty, let error = lastError { data["error"] = error }
            call.resolve(data)
            stopCall = nil
        }
        cleanup()
    }

    private func stopEngine() {
        if engine.isRunning { engine.stop() }
        engine.inputNode.removeTap(onBus: 0)
    }

    private func cleanup() {
        stopEngine()
        task?.cancel()
        task = nil
        request = nil
        // 앱에 들어 있는 베트남어 녹음이 다시 스피커로 잘 나오게 재생용으로 돌려 놓는다.
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
    }
}
