import Foundation
import Capacitor
import MultipeerConnectivity

// 근처 아이폰끼리 MultipeerConnectivity(블루투스 + 와이파이 직결)로 연결해 채팅 문장을 주고받는다.
// 인터넷이 없어도 된다. 상태는 모두 메인 스레드에서만 바꾼다.
@objc(NearbyChatPlugin)
public class NearbyChatPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "NearbyChatPlugin"
    public let jsName = "NearbyChat"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "invite", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "respond", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "send", returnType: CAPPluginReturnPromise),
    ]

    private static let serviceType = "dalat-chat"

    private var session: MCSession?
    private var advertiser: MCNearbyServiceAdvertiser?
    private var browser: MCNearbyServiceBrowser?
    // JS에는 문자열 id만 넘기고, 실제 MCPeerID는 여기서 찾는다.
    private var peerById: [String: MCPeerID] = [:]
    private var idByPeer: [MCPeerID: String] = [:]
    private var nextId = 0
    private var pendingInvites: [String: (Bool, MCSession?) -> Void] = [:]

    @objc func start(_ call: CAPPluginCall) {
        // MCPeerID 이름은 UTF-8로 63바이트까지라서, 글자가 잘리지 않게 앞에서부터 자른다.
        var name = (call.getString("name") ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        while name.utf8.count > 60 { name.removeLast() }
        guard !name.isEmpty else { return call.reject("이름이 필요해요", "NO_NAME") }
        DispatchQueue.main.async {
            self.teardown()
            let me = MCPeerID(displayName: name)
            let session = MCSession(peer: me, securityIdentity: nil, encryptionPreference: .required)
            session.delegate = self
            let advertiser = MCNearbyServiceAdvertiser(peer: me, discoveryInfo: nil, serviceType: Self.serviceType)
            advertiser.delegate = self
            let browser = MCNearbyServiceBrowser(peer: me, serviceType: Self.serviceType)
            browser.delegate = self
            self.session = session
            self.advertiser = advertiser
            self.browser = browser
            advertiser.startAdvertisingPeer()
            browser.startBrowsingForPeers()
            call.resolve()
        }
    }

    @objc func stop(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.teardown()
            call.resolve()
        }
    }

    @objc func invite(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let session = self.session, let browser = self.browser,
                  let peer = self.peerById[call.getString("peerId") ?? ""] else {
                return call.reject("근처에 없는 사람이에요", "NO_PEER")
            }
            browser.invitePeer(peer, to: session, withContext: nil, timeout: 30)
            call.resolve()
        }
    }

    @objc func respond(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let peerId = call.getString("peerId") ?? ""
            guard let handler = self.pendingInvites.removeValue(forKey: peerId) else {
                return call.reject("연결 요청이 사라졌어요", "NO_INVITE")
            }
            let accept = call.getBool("accept") ?? false
            handler(accept, accept ? self.session : nil)
            call.resolve()
        }
    }

    @objc func send(_ call: CAPPluginCall) {
        let text = call.getString("text") ?? ""
        var payload: [String: String] = ["text": text]
        if let ko = call.getString("ko"), !ko.isEmpty { payload["ko"] = ko }
        DispatchQueue.main.async {
            guard let session = self.session, !session.connectedPeers.isEmpty else {
                return call.reject("연결된 사람이 없어요", "NO_PEERS")
            }
            do {
                let data = try JSONSerialization.data(withJSONObject: payload)
                try session.send(data, toPeers: session.connectedPeers, with: .reliable)
                call.resolve()
            } catch {
                call.reject("보내지 못했어요", "SEND_FAILED", error)
            }
        }
    }

    private func teardown() {
        advertiser?.stopAdvertisingPeer()
        browser?.stopBrowsingForPeers()
        session?.disconnect()
        pendingInvites.values.forEach { $0(false, nil) }
        advertiser = nil
        browser = nil
        session = nil
        peerById = [:]
        idByPeer = [:]
        pendingInvites = [:]
    }

    private func id(for peer: MCPeerID) -> String {
        if let id = idByPeer[peer] { return id }
        nextId += 1
        let id = "p\(nextId)"
        idByPeer[peer] = id
        peerById[id] = peer
        return id
    }

    private func emit(_ event: String, _ peer: MCPeerID, _ extra: [String: Any] = [:]) {
        var data: [String: Any] = ["peerId": id(for: peer), "name": peer.displayName]
        data.merge(extra) { _, new in new }
        notifyListeners(event, data: data)
    }
}

extension NearbyChatPlugin: MCNearbyServiceBrowserDelegate {
    public func browser(_ browser: MCNearbyServiceBrowser, foundPeer peerID: MCPeerID, withDiscoveryInfo info: [String: String]?) {
        DispatchQueue.main.async {
            guard browser === self.browser else { return }
            self.emit("peerFound", peerID)
        }
    }

    public func browser(_ browser: MCNearbyServiceBrowser, lostPeer peerID: MCPeerID) {
        DispatchQueue.main.async {
            guard browser === self.browser else { return }
            self.emit("peerLost", peerID)
        }
    }
}

extension NearbyChatPlugin: MCNearbyServiceAdvertiserDelegate {
    public func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didReceiveInvitationFromPeer peerID: MCPeerID,
                           withContext context: Data?, invitationHandler: @escaping (Bool, MCSession?) -> Void) {
        DispatchQueue.main.async {
            guard advertiser === self.advertiser else { return invitationHandler(false, nil) }
            let peerId = self.id(for: peerID)
            self.pendingInvites.removeValue(forKey: peerId)?(false, nil)
            self.pendingInvites[peerId] = invitationHandler
            self.emit("invitation", peerID)
        }
    }
}

extension NearbyChatPlugin: MCSessionDelegate {
    public func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
        let name: String
        switch state {
        case .connected: name = "connected"
        case .connecting: name = "connecting"
        default: name = "notConnected"
        }
        DispatchQueue.main.async {
            guard session === self.session else { return }
            self.emit("peerState", peerID, ["state": name])
        }
    }

    public func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
        guard let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let text = obj["text"] as? String else { return }
        DispatchQueue.main.async {
            guard session === self.session else { return }
            var extra: [String: Any] = ["text": text]
            if let ko = obj["ko"] as? String { extra["ko"] = ko }
            self.emit("message", peerID, extra)
        }
    }

    public func session(_ session: MCSession, didReceive stream: InputStream, withName streamName: String, fromPeer peerID: MCPeerID) {}
    public func session(_ session: MCSession, didStartReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, with progress: Progress) {}
    public func session(_ session: MCSession, didFinishReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, at localURL: URL?, withError error: Error?) {}
}
