//
//  BdkRnModule.swift
//  BdkRnModule
//
//
import Foundation

class Progress : BdkProgress {
    func update(progress: Float, message: String?) {
        print("progress", progress, message as Any)
    }
}

let TAG = "BDK-RN"

@objc(BdkRnModule)
class BdkRnModule: NSObject {
    
    let descriptor = "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/0/*)"
    let changeDescriptor = "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/1/*)"
    let databaseConfig = DatabaseConfig.memory(junk: "")
    let blockchainConfig = BlockchainConfig.electrum(
        config: ElectrumConfig(url: "ssl://electrum.blockstream.info:60002", socks5: nil, retry: 5, timeout: nil, stopGap: 10))
    var wallet: Wallet
    let nodeNetwork = Network.testnet
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override init() {
       self.wallet = try! Wallet.init(descriptor: descriptor, changeDescriptor: changeDescriptor, network: nodeNetwork, databaseConfig: databaseConfig, blockchainConfig: blockchainConfig)
       try! self.wallet.sync(progressUpdate: Progress(), maxAddressParam: nil)
    }

    func _seed(
        recover: Bool = false,
        mnemonic: String?,  
        password: String? = nil
    ) throws -> ExtendedKeyInfo {
        do {
            if(!recover){ return try generateExtendedKey(network: nodeNetwork, wordCount:WordCount.words12, password: password) }
            else {return try restoreExtendedKey(network: nodeNetwork, mnemonic: mnemonic ?? "", password: password) }
        } catch {
            throw error
        }
    }


    private func createRestoreWallet(keys: ExtendedKeyInfo) throws -> Wallet {
        do{
            let descriptor: String = createDescriptor(keys: keys)
            let changeDescriptor: String = createChangeDescriptor(keys: keys)
            wallet = try Wallet(descriptor: descriptor, changeDescriptor: changeDescriptor, network: nodeNetwork, databaseConfig: databaseConfig, blockchainConfig: blockchainConfig)
            try wallet.sync(progressUpdate: Progress(), maxAddressParam: nil)
            return wallet
        } catch {
            throw error
        }
    }

    private func createDescriptor(keys: ExtendedKeyInfo)-> String {
        return ("wpkh(" + keys.xprv + "/84'/1'/0'/0/*)")
    }

    private func createChangeDescriptor(keys: ExtendedKeyInfo)-> String {
        return ("wpkh(" + keys.xprv + "/84'/1'/0'/1/*)")
    }

    @objc
    func genSeed(_ password: String? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let seed = try _seed(recover: false, mnemonic: "")
            resolve(seed.mnemonic)
        } catch {
            reject("Gen seed Error: ", error.localizedDescription, error)
        }
    }

    @objc
    func createWallet(_ mnemonic: String? = "", password: String? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let keys: ExtendedKeyInfo = try _seed(recover: mnemonic != "" ? true : false, mnemonic: mnemonic, password: password)
            try createRestoreWallet(keys: keys)
            let responseObject = ["address": wallet.getNewAddress(), "mnemonic": keys.mnemonic]
            resolve(responseObject)
        }
        catch {
            return reject("Create Wallet Error: ", error.localizedDescription, error)
        }
    }

    @objc
    func restoreWallet(_ mnemonic: String, password: String? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let keys: ExtendedKeyInfo = try _seed(recover: true, mnemonic: mnemonic, password: password)
            try createRestoreWallet(keys: keys)
            let responseObject = ["balance": try wallet.getBalance(), "address": wallet.getNewAddress()] as [String : Any]
            resolve(responseObject)
        }
        catch {
            return reject("Restore Wallet Error: ", error.localizedDescription, error)
        }
    }

    @objc
    func getNewAddress(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        resolve(self.wallet.getNewAddress())
    }

    @objc
    func getBalance(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            try! self.wallet.sync(progressUpdate: Progress(), maxAddressParam: nil)
            let balance = try self.wallet.getBalance()
            resolve(balance)
        }
        catch {
            return reject("Get Balance Error: ", error.localizedDescription, error)
        }
    }

    @objc
    func broadcastTx(_ recipient: String, amount: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let psbt: PartiallySignedBitcoinTransaction = try PartiallySignedBitcoinTransaction(wallet: wallet, recipient: recipient, amount: UInt64(truncating: amount), feeRate: nil)
            try wallet.sign(psbt: psbt)
            let transaction = try wallet.broadcast(psbt: psbt)
            print("Broadcast success", transaction)
            resolve(recipient)
        }   catch let error {
            let description = "\(error)"
            return reject("Broadcast tracsaction Error: ", description, error)
        }
    }

}

