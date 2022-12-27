//
//  Utils.swift
//  bdk-rn
//


import Foundation


func setNetwork(networkStr: String?) -> Network {
    switch (networkStr) {
        case "testnet": return Network.testnet
        case "bitcoin": return Network.bitcoin
        case "regtest": return Network.regtest
        case "signet":  return Network.signet
        default: return Network.testnet
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

func correctedXprv(secretKey: DescriptorSecretKey) -> String {
    return secretKey.asString().replacingOccurrences(of: "/*", with: "")
}

func getEntropy(length: NSNumber) -> Array<UInt8> {
    var entropyArray: [UInt8] = []
    var g = SystemRandomNumberGenerator()
    for _ in 1...length.intValue {
        entropyArray.append(UInt8(Int.random(in: 1...256, using: &g)))
    }
    return entropyArray
}
