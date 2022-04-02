//
//  RnBdkModule.swift
//  RnBdkModule
//
//  Copyright © 2022 . All rights reserved.
//

import Foundation

class Progress : BdkProgress {
    func update(progress: Float, message: String?) {
        print("progress", progress, message as Any)
    }
}

@objc(RnBdkModule)
class RnBdkModule: NSObject {
    let descriptor = "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/0/*)"
    let changeDescriptor = "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/1/*)"
    
    let databaseConfig = DatabaseConfig.memory(junk: "")
    let blockchainConfig = BlockchainConfig.electrum(
        config: ElectrumConfig(url: "ssl://electrum.blockstream.info:60002", socks5: nil, retry: 5, timeout: nil, stopGap: 10)
    )
    
    var wallet: Wallet;
    
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    override init() {
        self.wallet = try! Wallet.init(descriptor: descriptor, changeDescriptor: changeDescriptor, network: Network.testnet, databaseConfig: databaseConfig, blockchainConfig: blockchainConfig)
    }
    
    @objc
    func getNewAddress(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        resolve(self.wallet.getNewAddress())
    }
    
    @objc
    func getBalance(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do{
            try self.wallet.sync(progressUpdate: Progress(), maxAddressParam: nil)
            let balance = try self.wallet.getBalance()
            resolve(balance)
        } catch {
            reject("balance", "failed", error)
        }
    }
    
}
