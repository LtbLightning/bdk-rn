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
        config: ElectrumConfig(url: "ssl://electrum.blockstream.info:60002", socks5: nil, retry: 5, timeout: nil, stopGap: 10))
    var wallet: Wallet;
    let nodeNetwork = Network.testnet
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override init() {
        self.wallet = try! Wallet.init(descriptor: descriptor, changeDescriptor: changeDescriptor, network: nodeNetwork, databaseConfig: databaseConfig, blockchainConfig: blockchainConfig)
        try! self.wallet.sync(progressUpdate: Progress(), maxAddressParam: nil)
    }

    @objc
    func getNewAddress(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        resolve(self.wallet.getNewAddress())
    }

    @objc
    func genSeed(_ password: String? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let seed = try generateExtendedKey(network: nodeNetwork, wordCount: WordCount.words12, password: password)
            resolve(seed.mnemonic)
        }
        catch {
            reject("seed", "failed", error)
        }
    }

    @objc
    func getBalance(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let balance = try self.wallet.getBalance()
            resolve(balance)
        }
        catch {
            reject("balance", "failed", error)
        }
    }

    @objc
    func createWallet(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let keys: ExtendedKeyInfo = try generateExtendedKey(network: nodeNetwork, wordCount: WordCount.words12, password: nil)
            let newWallet = try createRecoverWallet(keys: keys)
            resolve("Address: \(newWallet.getNewAddress()), \n Mnemonic: \(keys.mnemonic)")
        }
        catch {
            reject("create wallet", "failed", error)
        }
    }

    @objc
    func restoreWallet(_ mnemonic: String, password: String? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let keys: ExtendedKeyInfo = try restoreExtendedKey(network: nodeNetwork, mnemonic: mnemonic, password: password)
            let newWallet = try createRecoverWallet(keys: keys)
            resolve("Balance: \(try newWallet.getBalance()) Address: \(newWallet.getNewAddress())")
        }
        catch {
            reject("restore wallet", "failed", error)
        }
    }

    private func createRecoverWallet(keys: ExtendedKeyInfo) throws -> Wallet {
        do{
            let descriptor: String = createDescriptor(keys: keys)
            let changeDescriptor: String = createChangeDescriptor(keys: keys)
            let newWallet: Wallet = try Wallet(descriptor: descriptor, changeDescriptor: changeDescriptor, network: nodeNetwork, databaseConfig: databaseConfig, blockchainConfig: blockchainConfig)
            try newWallet.sync(progressUpdate: Progress(), maxAddressParam: nil)
            return newWallet
        }
        catch {
            return error as! Wallet
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
        }
        catch let error {
            print(error)
            reject("tx", "failed", error)
        }
    }

}
