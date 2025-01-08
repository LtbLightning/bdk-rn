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

func randomId() -> String {
    return UUID().uuidString
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


func createTxOut(txOut: TxOut, _scripts: inout [String: Script]) -> [String: Any] {
    let randomId = randomId()
    _scripts[randomId] = txOut.scriptPubkey
    return [
        "script": randomId,
        "value": txOut.value
    ] as [String: Any]
}

func createTxIn(txIn: TxIn, _scripts: inout [String: Script]) -> [String: Any] {
    let randomId = randomId()
    _scripts[randomId] = txIn.scriptSig
    return [
        "scriptSig": randomId,
        "previousOutput": getOutPoint(outPoint: txIn.previousOutput),
        "sequence": txIn.sequence,
        "witness": txIn.witness
    ] as [String: Any]
}

func getOutPoint(outPoint: OutPoint) -> [String: Any] {
    return ["txid": outPoint.txid, "vout": outPoint.vout] as [String: Any]
}

func createAmount(satoshis: UInt64) -> [String: Any] {
        var sats = satoshis
        let amount = Amount(unsafeFromRawPointer: &sats)  // Use the address of sats
        return [
            "sat": amount.toSat(),
            "btc": amount.toBtc()
        ]
    }

func createFeeRate(satPerVb: NSNumber? = nil, satPerKw: NSNumber? = nil) -> FeeRate {
        if let satPerVb = satPerVb {
            return try! FeeRate.fromSatPerVb(satPerVb: UInt64(truncating: satPerVb))
        } else if let satPerKw = satPerKw {
            return FeeRate.fromSatPerKwu(satPerKwu: UInt64(truncating: satPerKw))
        } else {
            fatalError("Either satPerVb or satPerKw must be provided")
        }
    }

func feeRateToSatPerVb(feeRate: FeeRate) -> UInt64 {
        return feeRate.toSatPerVbFloor()
    }

func feeRateToSatPerKw(feeRate: FeeRate) -> UInt64 {
        return feeRate.toSatPerKwu()
    }



func createTxIn(txIn: TxIn) -> [String: Any] {
        return [
            "previousOutput": [
                "txid": txIn.previousOutput.txid,
                "vout": txIn.previousOutput.vout
            ],
            "sequence": txIn.sequence
        ]
    }
