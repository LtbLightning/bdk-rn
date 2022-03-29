//
//  RnBdkModule.swift
//  RnBdkModule
//
//  Copyright © 2022 . All rights reserved.
//

import Foundation

@objc(RnBdkModule)
class RnBdkModule: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc
  func getNewAddress(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {

    let descriptor = "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/0/*)"
    let changeDescriptor = "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/1/*)"

    let databaseConfig = DatabaseConfig.memory(junk: "")

    let blockchainConfig =
      BlockchainConfig.electrum(
        config: ElectrumConfig(url: "ssl://electrum.blockstream.info:60002", socks5: nil, retry: 5, timeout: nil, stopGap: 10)
      )
    
    let latestWallet = try! Wallet.init(descriptor: descriptor, changeDescriptor: changeDescriptor, network: Network.testnet, databaseConfig: databaseConfig, blockchainConfig: blockchainConfig)
    print("Latest wallet address", latestWallet.getNewAddress())
    resolve(latestWallet.getNewAddress())
  }
  
}
