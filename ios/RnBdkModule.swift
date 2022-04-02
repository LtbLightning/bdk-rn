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
        try! self.wallet.sync(progressUpdate: Progress(), maxAddressParam: nil)
    }
    
    @objc
    func getNewAddress(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        resolve(self.wallet.getNewAddress())
    }
    
    @objc
    func getBalance(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do{
            let balance = try self.wallet.getBalance()
            resolve(balance)
        } catch {
            reject("balance", "failed", error)
        }
    }
    
    @objc
    func createWallet(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let keys: ExtendedKeyInfo = try generateExtendedKey(network: Network.testnet, wordCount: WordCount.words12, password: nil)
            let descriptor: String = createDescriptor(keys: keys)
            let changeDescriptor: String = createChangeDescriptor(keys: keys)
            let newWallet: Wallet = try Wallet(descriptor: descriptor, changeDescriptor: changeDescriptor, network: Network.testnet, databaseConfig: databaseConfig, blockchainConfig: blockchainConfig)
            resolve(keys.mnemonic)
        } catch {
            reject("create wallet", "failed", error)
        }
    }
    
    private func createDescriptor(keys: ExtendedKeyInfo)-> String {
        return ("wpkh(" + keys.xprv + "/84'/1'/0'/0/*)")
    }
    
    private func createChangeDescriptor(keys: ExtendedKeyInfo)-> String {
        return ("wpkh(" + keys.xprv + "/84'/1'/0'/1/*)")
    }
    
    
    @objc
    func broadcastTx(_ recipient: String, amount: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
        do {
            
            let amt = UInt64(1000)
            let psbt = try PartiallySignedBitcoinTransaction(wallet: wallet, recipient: recipient, amount: amt, feeRate: 0)
            
            try wallet.sign(psbt: psbt)
            
            print("NOT COMING HERE")
            
            
            let transaction = try wallet.broadcast(psbt: psbt)
            print(transaction)
            resolve(recipient)
        } catch let error {
            print(error)
            reject("tx", "failed", error)
        }
    }
    
}
