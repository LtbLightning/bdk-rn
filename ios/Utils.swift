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
        case "signet": return Network.signet
        default: return Network.testnet
    }
}

func setWordCount(wordCount: NSNumber?) -> WordCount {
    switch (wordCount) {
        case 15: return WordCount.words15
        case 18: return WordCount.words18
        case 21: return WordCount.words21
        case 24: return WordCount.words24
        default: return  WordCount.words12
    }
}

func correctedXprv(secretKey: DescriptorSecretKey) -> String {
    return secretKey.asString().replacingOccurrences(of: "/*", with: "")
}
