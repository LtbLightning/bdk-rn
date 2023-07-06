//
//  Utils.swift
//  bdk-rn
//


import Foundation

class BdkProgress: Progress {
    func update(progress: Float, message: String?) {
        print("progress", progress, message as Any)
    }
}

func setNetwork(networkStr: String?) -> Network {
    switch (networkStr) {
    case "testnet": return Network.testnet
    case "bitcoin": return Network.bitcoin
    case "regtest": return Network.regtest
    case "signet": return Network.signet
    default: return Network.testnet
    }
}

func getNetworkString(network: Network) -> String {
    switch (network) {
    case Network.testnet: return "testnet"
    case Network.bitcoin: return "bitcoin"
    case Network.regtest: return "regtest"
    case Network.signet: return "signet"
    }
}

func setWordCount(wordCount: NSNumber?) -> WordCount {
    switch (wordCount) {
    case 15: return WordCount.words15
    case 18: return WordCount.words18
    case 21: return WordCount.words21
    case 24: return WordCount.words24
    default: return WordCount.words12
    }
}

func getEntropy(entropy: NSArray) -> Array<UInt8> {
    var entropyArray: [UInt8] = []
    for i in entropy {
        entropyArray.append(UInt8(Int8(i as! UInt8)))
    }
    return entropyArray
}


func setAddressIndex(addressIndex: String?) -> AddressIndex {
    switch (addressIndex) {
    case "new": return AddressIndex.new
    case "lastUnused": return AddressIndex.lastUnused
    default: return AddressIndex.new
    }
}

func randomId() -> String {
    return UUID().uuidString
}

func getTransactionObject(transaction: TransactionDetails?) -> [String: Any] {
    return [
        "fee": transaction?.fee as Any,
        "received": transaction?.received as Any,
        "sent": transaction?.sent as Any,
        "txid": transaction?.txid as Any,
        "confirmationTime": [
            "height": transaction?.confirmationTime?.height as Any,
            "timestamp": transaction?.confirmationTime?.timestamp as Any
        ],
    ] as [String: Any]
}


func getPSBTObject(txResult: TxBuilderResult?) -> [String: Any] {
    return [
        "base64": txResult?.psbt.serialize() as Any,
        "transactionDetails": getTransactionObject(transaction: txResult?.transactionDetails)
    ] as [String: Any]
}

func createOutPoint(outPoint: NSDictionary) -> OutPoint {
    return OutPoint(
        txid: outPoint["txid"] as! String,
        vout: UInt32(truncating: outPoint["vout"] as! NSNumber)
    )
}

func setKeychainKind(keychainKind: String? = "external") -> KeychainKind {
    switch (keychainKind) {
    case "external": return KeychainKind.external
    case "internal": return KeychainKind.internal
    default: return KeychainKind.external
    }
}


func getTxBytes(bytes: NSArray) -> Array<UInt8> {
    var bytesArray: [UInt8] = []
    for i in bytes {
        bytesArray.append(UInt8(Int16(i as! UInt8)))
    }
    return bytesArray
}


func getPayload(payload: Payload) -> [String: Any] {
    var response: [String: Any] = [:];
    switch (payload) {
    case .pubkeyHash(pubkeyHash: let pubkeyHash):
        response["type"] = "pubkeyHash"
        response["value"] = pubkeyHash
    case .scriptHash(scriptHash: let scriptHash):
        response["type"] = "scriptHash"
        response["value"] = scriptHash
    case .witnessProgram(version: let version, program: let program):
        response["type"] = "witnessProgram"
        response["value"] = program
        response["version"] = "\(version)"
    }
    return response as [String: Any]
}

func createTxOut(txOut: TxOut, _scripts: inout [String: Script]) -> [String: Any] {
    let randomId = randomId()
    _scripts[randomId] = txOut.scriptPubkey
    return [
        "script": randomId,
        "value": txOut.value
    ] as [String: Any]
}
