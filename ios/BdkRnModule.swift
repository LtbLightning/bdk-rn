//
//  BdkRnModule.swift
//  BdkRnModule
//

import Foundation


@objc(BdkRnModule)
class BdkRnModule: NSObject {
    let bdkFunctions = BdkFunctions()
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    var _descriptorSecretKey: DescriptorSecretKey
    var _descriptorPublicKey: DescriptorPublicKey
    let defaultPublicKey: String = "tpubD6NzVbkrYhZ4X1EWKTKQaGTrfs9cu5wpFiv7XroiRYBgStXFDx88SzijzRo69U7E3nBr8jiKYyb1MtNWaAHD8fhT1A3PGz5Duy6urG8uxLD/*"

    var _blockchainConfig: BlockchainConfig;
    var _blockChain: Blockchain
    var _dbConfig: DatabaseConfig
    
    var _wallet: Wallet
    let defaultDescriptor = "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/0/*)"

    override init() {
        _descriptorSecretKey = DescriptorSecretKey(
            network: setNetwork(networkStr: ""),
            mnemonic: Mnemonic(wordCount: setWordCount(wordCount: 0)),
            password: ""
        )
        _descriptorPublicKey = try! DescriptorPublicKey.fromString(publicKey: defaultPublicKey)
        _blockchainConfig = BlockchainConfig.electrum(
            config: ElectrumConfig(
                url: "ssl://electrum.blockstream.info:60002",
                socks5: nil,
                retry: 5,
                timeout: nil,
                stopGap: 10))
        _blockChain = try! Blockchain.init(config: _blockchainConfig)
        _dbConfig = DatabaseConfig.memory
        
        _wallet = try! Wallet(
            descriptor: defaultDescriptor,
            changeDescriptor: createChangeDescriptor(descriptor: defaultDescriptor),
            network: Network.testnet,
            databaseConfig: _dbConfig
        )
    }

    /** Mnemonic methods starts */
    @objc
    func generateSeedFromWordCount(_
        wordCount: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let response = Mnemonic(wordCount: setWordCount(wordCount: wordCount))
        resolve(response.asString())
    }

    @objc
    func generateSeedFromString(_
        mnemonic: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let response = try Mnemonic.fromString(mnemonic: mnemonic)
            resolve(response.asString())
        } catch let error {
            reject("Generate seed error", "\(error)", error)
        }
    }

    @objc
    func generateSeedFromEntropy(_
        entropyLength: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let response = try Mnemonic.fromEntropy(entropy: getEntropy(length: entropyLength))
            resolve(response.asString())
        } catch let error {
            reject("Generate seed error", "\(error)", error)
        }
    }

    /** Mnemonic methods ends */

    /** Derviation path methods starts */
    @objc
    func createDerivationPath(_
        path: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            _ = try DerivationPath(path: path)
            resolve(true)
        } catch let error {
            reject("Create Derivation path error", "\(error)", error)
        }
    }
    /** Derviation path methods ends */

    /** Descriptor secret key methods starts */
    @objc
    func createDescriptorSecret(_
        network: String,
        mnemonic: String,
        password: String? = nil,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let networkName: Network = setNetwork(networkStr: network)
            let keyInfo = try DescriptorSecretKey(
                network: networkName,
                mnemonic: Mnemonic.fromString(mnemonic: mnemonic),
                password: password
            )
            _descriptorSecretKey = keyInfo
            resolve(keyInfo.asString())
        } catch let error {
            reject("DescriptorSecret create error", "\(error)", error)
        }
    }

    @objc
    func descriptorSecretDerive(_
        path: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let _path = try DerivationPath(path: path)
            let keyInfo = try _descriptorSecretKey.derive(path: _path)
            resolve(keyInfo.asString())
        } catch let error {
            reject("DescriptorSecret derive error", "\(error)", error)
        }
    }

    @objc
    func descriptorSecretExtend(_
        path: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let _path = try DerivationPath(path: path)
            let keyInfo = try _descriptorSecretKey.extend(path: _path)
            resolve(keyInfo.asString())
        } catch let error {
            reject("DescriptorSecret extend error", "\(error)", error)
        }
    }

    @objc
    func descriptorSecretAsPublic(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        resolve(_descriptorSecretKey.asPublic().asString())
    }

    @objc
    func descriptorSecretAsSecretBytes(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        resolve(_descriptorSecretKey.secretBytes())
    }
    /** Descriptor secret key methods ends */


    /** Descriptor public key methods starts */
    @objc
    func createDescriptorPublic(_
        publicKey: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let keyInfo = try DescriptorPublicKey.fromString(publicKey: publicKey)
            _descriptorPublicKey = keyInfo
            resolve(keyInfo.asString())
        } catch let error {
            reject("DescriptorPublic create error", "\(error)", error)
        }
    }

    @objc
    func descriptorPublicDerive(_
        path: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let _path = try DerivationPath(path: path)
            let keyInfo = try _descriptorPublicKey.derive(path: _path)
            resolve(keyInfo.asString())
        } catch let error {
            reject("DescriptorPublic derive error", "\(error)", error)
        }
    }

    @objc
    func descriptorPublicExtend(_
        path: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let _path = try DerivationPath(path: path)
            let keyInfo = try _descriptorPublicKey.extend(path: _path)
            resolve(keyInfo.asString())
        } catch let error {
            reject("DescriptorPublic extend error", "\(error)", error)
        }
    }

    /** Descriptor public key methods ends */


    /** Blockchain methods starts */
    @objc
    func initElectrumBlockchain(_
        url: String,
        retry: String?,
        stopGap: String?,
        timeOut: String?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            _blockchainConfig = BlockchainConfig.electrum(
                config: ElectrumConfig(
                    url: url,
                    socks5: nil,
                    retry: UInt8(retry ?? "") ?? 5,
                    timeout: UInt8(timeOut ?? "") ?? nil,
                    stopGap: UInt64(stopGap ?? "") ?? 10
                )
            )
            _blockChain = try Blockchain(config: _blockchainConfig)
            resolve(try! _blockChain.getHeight())
        } catch let error {
            reject("BlockchainElectrum init error", "\(error)", error)
        }
    }

    @objc
    func initEsploraBlockchain(_
        url: String,
        proxy: String?,
        concurrency: String?,
        stopGap: String?,
        timeOut: String?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            _blockchainConfig = BlockchainConfig.esplora(
                config: EsploraConfig(
                    baseUrl: url,
                    proxy: nil,
                    concurrency: UInt8(concurrency ?? "") ?? nil,
                    stopGap: UInt64(stopGap ?? "") ?? 10,
                    timeout: UInt64(timeOut ?? "") ?? 10
                )
            )
            _blockChain = try Blockchain(config: _blockchainConfig)
            resolve(try! _blockChain.getHeight())
        } catch let error {
            reject("BlockchainEsplora init error", "\(error)", error)
        }
    }

    @objc
    func getBlockchainHeight(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            resolve(try _blockChain.getHeight())
        } catch let error {
            reject("Blockchain get height error", "\(error)", error)
        }
    }


    @objc
    func getBlockchainHash(_ height: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            resolve(try _blockChain.getBlockHash(height: UInt32(truncating: height)))
        } catch let error {
            reject("Blockchain get block hash error", "\(error)", error)
        }
    }
    /** Blockchain methods ends */

    /** DB configuration methods starts*/
    @objc
    func memoryDBInit(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        _dbConfig = DatabaseConfig.memory
        resolve(true)
    }

    @objc
    func sledDBInit(_
        path: String,
        treeName: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        _dbConfig = DatabaseConfig.sled(config: SledDbConfiguration(path: path, treeName: treeName))
        resolve(true)
    }
    
    @objc
    func sqliteDBInit(_
        path: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        _dbConfig = DatabaseConfig.sqlite(config: SqliteDbConfiguration(path: path))
        resolve(true)
    }
    /** DB configuration methods ends*/
    
    /** Wallet methods starts*/
    @objc
    func initWallet(_
        descriptor: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            _wallet = try Wallet.init(
                descriptor: descriptor,
                changeDescriptor: createChangeDescriptor(descriptor: descriptor),
                network: setNetwork(networkStr: network),
                databaseConfig: _dbConfig
            )
            resolve(true)
        } catch let error {
            reject("Init wallet error", "\(error)", error)
        }
    }
    
    
    @objc
    func sync(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            try _wallet.sync(blockchain: _blockChain, progress: BdkProgress())
            resolve(true)
        } catch let error {
            reject("Sync wallet error", "\(error)", error)
        }
    }
    
    
    @objc
    func getAddress(_
        addressIndex: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let addressInfo = try _wallet.getAddress(addressIndex: setAddressIndex(addressIndex: addressIndex))
            resolve(["index": addressInfo.index, "address": addressInfo.address] as [String: Any])
        } catch let error {
            reject("Get wallet address error", "\(error)", error)
        }
    }
    
    @objc
    func getBalance(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let balance = try _wallet.getBalance()
            let responseBalance = [
                "trustedPending": balance.trustedPending,
                "untrustedPending": balance.untrustedPending,
                "confirmed": balance.confirmed,
                "spendable": balance.spendable,
                "total": balance.total,
            ] as [String: Any]
            resolve(responseBalance)
        } catch let error {
            reject("Get wallet balance error", "\(error)", error)
        }
    }
    
    
    @objc
    func getNetwork(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let network = _wallet.network()
        resolve(getNetworkString(network: network))
    }
    
    @objc
    func listUnspent(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let unspent = try _wallet.listUnspent()
            print("Unspent outputs", unspent)
            resolve(unspent)
        } catch let error {
            reject("List unspent outputs error", "\(error)", error)
        }
    }
    
    @objc
    func listTransactions(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let list = try _wallet.listTransactions()
            print("Transactions", list)
            resolve(list)
        } catch let error {
            reject("List transactions error", "\(error)", error)
        }
    }
    
    /** Wallet methods ends*/


    /** ==================== OLD Methods  ====================  */
    @objc
    func getExtendedKeyInfo(_
        network: String,
        mnemonic: String,
        password: String? = nil,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let networkName: Network = setNetwork(networkStr: network)
            let response = try bdkFunctions.extendedKeyInfo(
                network: networkName,
                mnemonic: mnemonic,
                password: password
            )
            resolve(response)
        } catch let error {
            reject("Get extended keys error", error.localizedDescription, error)
        }
    }

    @objc
    func createWallet(_
        mnemonic: String? = nil,
        password: String? = nil,
        network: String? = nil,
        blockChainConfigUrl: String? = nil,
        blockChainSocket5: String? = nil,
        retry: String? = nil,
        timeOut: String? = nil,
        blockChainName: String? = nil,
        descriptor: String? = nil,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let responseObject = try bdkFunctions.createWallet(
                mnemonic: mnemonic,
                password: password,
                network: network,
                blockChainConfigUrl: blockChainConfigUrl,
                blockChainSocket5: blockChainSocket5,
                retry: retry,
                timeOut: timeOut,
                blockChainName: blockChainName,
                descriptor: descriptor
            )
            resolve(responseObject)
        } catch let error {
            reject("Init Wallet Error", error.localizedDescription, error)
        }
    }

    @objc
    func getNewAddress(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let address = bdkFunctions.getNewAddress()
        return resolve(address)
    }

    @objc
    func syncWallet(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        bdkFunctions.syncWallet()
        return resolve("wallet sync complete")
    }


    @objc
    func broadcastTx(_
        recipient: String,
        amount: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let responseObject = try bdkFunctions.broadcastTx(recipient, amount: amount)
            resolve(responseObject)
        } catch let error {
            let details = "\(error)"
            reject("Broadcast Error", details, error)
        }
    }

    @objc
    func getPendingTransactions(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let response = try bdkFunctions.transactionsList(pending: true)
            resolve(response)
        } catch let error {
            reject("Pending transactions error", error.localizedDescription, error)
        }
    }

    @objc
    func getConfirmedTransactions(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let response = try bdkFunctions.transactionsList()
            resolve(response)
        } catch let error {
            reject("Confirmed transactions error", error.localizedDescription, error)
        }
    }

}

