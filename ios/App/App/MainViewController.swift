import UIKit
import Capacitor

// 앱 안에 직접 넣은 플러그인(근처 채팅, 베트남어 음성인식)을 등록한다.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(NearbyChatPlugin())
        bridge?.registerPluginInstance(ViSpeechPlugin())
    }
}
