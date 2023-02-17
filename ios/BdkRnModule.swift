//
//  BdkRnModule.swift
//  BdkRnModule
//

import Foundation


@objc(BdkRnModule)
class BdkRnModule: NSObject {
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    var _descriptorSecretKey: DescriptorSecretKey
    var _descriptorPublicKey: DescriptorPublicKey
    let defaultPublicKey: String = "tpubD6NzVbkrYhZ4X1EWKTKQaGTrfs9cu5wpFiv7XroiRYBgStXFDx88SzijzRo69U7E3nBr8jiKYyb1MtNWaAHD8fhT1A3PGz5Duy6urG8uxLD/*"

    var _blockchainConfig: BlockchainConfig;
    var emptyBlockChain: Blockchain
    var _dbConfig: DatabaseConfig
    
    var emptyWallet: Wallet
    var emptyPSBT: PartiallySignedTransaction
    let defaultDescriptor = "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/0/*)"
    let dummyPSBT64 = "cHNidP8BAHEBAAAAAQU2MK4mbnsx/zjbmKwHGUAMVT1zXRFTPBArkMACRZjxAQAAAAD9////AhAnAAAAAAAAFgAU/52lZ+YvMOqGVPodX71HvvjjvhP7FQEAAAAAABYAFKqBwKFeT43famR0JJGaAhoMZKrXAAAAAAABAN4BAAAAAAEBArVvNyXe4TvWObt2vPpIv4IJPeFG1hRK8RtTgzVx3MEAAAAAAP3///8CECcAAAAAAAAWABT/naVn5i8w6oZU+h1fvUe++OO+E+ZAAQAAAAAAFgAUvv5IaH57cUVjoZ35bLxinO1BwkwCRzBEAiABTG7xfKRyZF2ezFCByBLSMGTA2FXYpMN881YXQZB/TgIgbU/OqbuWbe4KhWnjKeglVbnkko70H6glFe/zoo069fUBIQIeb6icGFSB9miQOCV9IMVmJdbEkXG8Hi86LaEyJRa5swAAAAABAR/mQAEAAAAAABYAFL7+SGh+e3FFY6Gd+Wy8YpztQcJMIgICZNLhaTjDm6k30vM/U2+d1TKQ02pk3MFxixFp4EQN1G5IMEUCIQCYRpRlO8YiUXZHLRYmS7fxhgCCDtYRVJ7Tb1rVOKqsHAIgcAeg6Dh8l2N9cixRUyCKwe0jWC9Xc7lNMrxJnDnlmN8BAQMEAQAAACIGAmTS4Wk4w5upN9LzP1NvndUykNNqZNzBcYsRaeBEDdRuGCrNFF1UAACAAQAAgAAAAIABAAAAAQAAAAAAIgIDRcB4bLvY45WvIPqto3nRP4nAQm1FHeIBWcqo2UiIHYoYKs0UXVQAAIABAACAAAAAgAEAAAACAAAAAA=="
    

    var _wallets: [String: Wallet] = [:]
    var _blockChains: [String: Blockchain] = [:]
    var _addresses: [String: Address] = [:]
    var _scripts: [String: Script] = [:]
    var _txBuilders: [String: TxBuilder] = [:]
    var _psbts: [String: PartiallySignedTransaction] = [:]
    
    
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
        emptyBlockChain = try! Blockchain.init(config: _blockchainConfig)
        
        _dbConfig = DatabaseConfig.memory
        emptyWallet = try! Wallet(
            descriptor: defaultDescriptor,
            changeDescriptor: createChangeDescriptor(descriptor: defaultDescriptor),
            network: Network.testnet,
            databaseConfig: _dbConfig
        )
        
        emptyPSBT = try! PartiallySignedTransaction(psbtBase64: dummyPSBT64)
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
    func getBlockchainById(id: String) -> Blockchain {
        return _blockChains[id] ?? emptyBlockChain
    }
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
            let blockChainId = randomId()
            _blockChains[blockChainId] = try Blockchain(config: _blockchainConfig)
            resolve(blockChainId)
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
            let blockChainId = randomId()
            _blockChains[blockChainId] = try Blockchain(config: _blockchainConfig)
            resolve(blockChainId)
        } catch let error {
            reject("BlockchainEsplora init error", "\(error)", error)
        }
    }

    @objc
    func getBlockchainHeight(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            resolve(try getBlockchainById(id: id).getHeight())
        } catch let error {
            reject("Blockchain get height error", "\(error)", error)
        }
    }


    @objc
    func getBlockchainHash(_
        id: String,
        height: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            resolve(try getBlockchainById(id: id).getBlockHash(height: UInt32(truncating: height)))
        } catch let error {
            reject("Blockchain get block hash error", "\(error)", error)
        }
    }
    
    @objc
    func broadcast(_
        id: String,
        psbtId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let psbt = getPSBTById(id: psbtId)
            _ = try getBlockchainById(id: id).broadcast(psbt: psbt)
            resolve(true)
        } catch let error {
            reject("Broadcast transaction error", "\(error)", error)
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
    func getWalletById(id: String) -> Wallet {
        return _wallets[id] ?? emptyWallet
    }
    
    @objc
    func walletInit(_
        descriptor: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let id = randomId()
            _wallets[id] = try Wallet.init(
                descriptor: descriptor,
                changeDescriptor: createChangeDescriptor(descriptor: descriptor),
                network: setNetwork(networkStr: network),
                databaseConfig: _dbConfig
            )
            resolve(id)
        } catch let error {
            reject("Init wallet error", "\(error)", error)
        }
    }
    
    
    @objc
    func sync(_
        id: String,
        blockChainId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            try getWalletById(id: id).sync(blockchain: getBlockchainById(id: blockChainId), progress: BdkProgress())
            resolve(true)
        } catch let error {
            reject("Sync wallet error", "\(error)", error)
        }
    }
    
    
    @objc
    func getAddress(_
        id: String,
        addressIndex: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let addressInfo = try getWalletById(id: id).getAddress(
                addressIndex: setAddressIndex(addressIndex: addressIndex)
            )
            resolve(["index": addressInfo.index, "address": addressInfo.address] as [String: Any])
        } catch let error {
            reject("Get wallet address error", "\(error)", error)
        }
    }
    
    @objc
    func getBalance(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let balance = try getWalletById(id: id).getBalance()
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
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let network = getWalletById(id: id).network()
        resolve(getNetworkString(network: network))
    }
    
    @objc
    func listUnspent(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let unspent = try getWalletById(id: id).listUnspent()
            var responseObject: [Any] = []
            for item in unspent {
                let unspentObject = [
                    "outpoint": ["txid": item.outpoint.txid, "vout": item.outpoint.vout],
                    "txout": ["value": item.txout.value, "address": item.txout.address],
                    "isSpent": item.isSpent
                ] as [String: Any]
                responseObject.append(unspentObject)
            }
            resolve(responseObject)
        } catch let error {
            reject("List unspent outputs error", "\(error)", error)
        }
    }
    
    @objc
    func listTransactions(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let list = try getWalletById(id: id).listTransactions()
            var responseObject: [Any] = []
            for item in list {
                let txObject = getTransactionObject(transaction: item)
                responseObject.append(txObject)
            }
            resolve(responseObject)
        } catch let error {
            reject("List transactions error", "\(error)", error)
        }
    }
    
    @objc
    func sign(_
        id: String,
        psbtId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let psbt = getPSBTById(id: psbtId)
            try getWalletById(id: id).sign(psbt: psbt)
            resolve(true)
        } catch let error {
            reject("Sign PSBT error", "\(error)", error)
        }
    }
    
    
    /** Wallet methods ends*/
    
    /** Address methods starts*/
    
    @objc
    func initAddress(_
        address: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let id = randomId()
            _addresses[id] = try Address(address: address)
            resolve(id)
        } catch let error {
            reject("Address error", "\(error)", error)
        }
    }
    
    @objc
    func addressToScriptPubkeyHex(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let scriptId = randomId()
        _scripts[scriptId] = _addresses[id]?.scriptPubkey()
        resolve(scriptId)
    }
    
    /** Address methods ends*/
    
    /** TxBuilder methods starts */
    func getPSBTById(id: String) -> PartiallySignedTransaction {
        return _psbts[id] ?? emptyPSBT
    }
    
    @objc
    func createTxBuilder(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let id = randomId()
        _txBuilders[id] = TxBuilder()
        resolve(id)
    }
    
    @objc
    func addRecipient(_
        id: String,
        scriptId: String,
        amount: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        _txBuilders[id] = _txBuilders[id]?.addRecipient(
            script: _scripts[scriptId]!,
            amount: UInt64(truncating: amount)
        )
        resolve(true)
    }
    
    // `addUnspendable`
    @objc
    func addUnspendable(_
        id: String,
        outPoint: NSDictionary,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        _txBuilders[id] = _txBuilders[id]?.addUnspendable(unspendable: createOutPoint(outPoint: outPoint))
        resolve(true)
    }
    
    // `addUtxo`
    @objc
    func addUtxo(_
         id: String,
         outPoint: NSDictionary,
         resolve: @escaping RCTPromiseResolveBlock,
         reject: @escaping RCTPromiseRejectBlock
     ) {
         _txBuilders[id] = _txBuilders[id]?.addUtxo(outpoint: createOutPoint(outPoint: outPoint))
         resolve(true)
     }
    
    
    // `addUtxos`
    @objc
    func addUtxos(_
         id: String,
         outPoints: [NSDictionary],
         resolve: @escaping RCTPromiseResolveBlock,
         reject: @escaping RCTPromiseRejectBlock
     ) {
        var mappedOutPoints: [OutPoint] = [];
        for outPoint in outPoints {
            mappedOutPoints.append(createOutPoint(outPoint: outPoint))
        }
        _txBuilders[id] = _txBuilders[id]?.addUtxos(outpoints: mappedOutPoints)
         resolve(true)
     }
    
    
    // `doNotSpendChange`
    @objc
    func doNotSpendChange(_
         id: String,
         resolve: @escaping RCTPromiseResolveBlock,
         reject: @escaping RCTPromiseRejectBlock
     ) {
        _txBuilders[id] = _txBuilders[id]?.doNotSpendChange()
         resolve(true)
     }
    
    // `manuallySelectedOnly`
    @objc
    func manuallySelectedOnly(_
         id: String,
         resolve: @escaping RCTPromiseResolveBlock,
         reject: @escaping RCTPromiseRejectBlock
     ) {
        _txBuilders[id] = _txBuilders[id]?.manuallySelectedOnly()
         resolve(true)
     }
    
    // `onlySpendChange`
    @objc
    func onlySpendChange(_
         id: String,
         resolve: @escaping RCTPromiseResolveBlock,
         reject: @escaping RCTPromiseRejectBlock
     ) {
        _txBuilders[id] = _txBuilders[id]?.onlySpendChange()
         resolve(true)
     }
    
    
    // `unspendable`
    @objc
    func unspendable(_
         id: String,
         outPoints: [NSDictionary],
         resolve: @escaping RCTPromiseResolveBlock,
         reject: @escaping RCTPromiseRejectBlock
     ) {
        var mappedOutPoints: [OutPoint] = [];
        for outPoint in outPoints {
            mappedOutPoints.append(createOutPoint(outPoint: outPoint))
        }
        _txBuilders[id] = _txBuilders[id]?.unspendable(unspendable: mappedOutPoints)
         resolve(true)
     }
    
    // `feeRate`
    // `feeAbsolute`
    // `drainWallet`
    // `drainTo`
    // `enableRbf`
    // `enableRbfWithSequence`
    // `addData`
    // `setRecipients`
    
    @objc
    func finish(_
        id: String,
        walletId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let psbtId = randomId()
            let details = try _txBuilders[id]?.finish(wallet: getWalletById(id: walletId))
            let responseObject = getPSBTObject(txResult: details, id: psbtId)
            _psbts[psbtId] = details?.psbt
            resolve(responseObject)
        } catch let error {
            reject("Finish tx error", "\(error)", error)
        }
    }
    
    /** TxBuilder methods ends */
    
}

