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

    var _descriptorSecretKeys: [String: DescriptorSecretKey] = [:]
    var _descriptorPublicKeys: [String: DescriptorPublicKey] = [:]

    var _wallets: [String: Wallet] = [:]
//    var _blockChains: [String: Blockchain] = [:]
    var _addresses: [String: Address] = [:]
    var _scripts: [String: Script] = [:]
    var _txBuilders: [String: TxBuilder] = [:]


    var _descriptors: [String: Descriptor] = [:]
    var _derivationPaths: [String: DerivationPath] = [:]
//    var _databaseConfigs: [String: DatabaseConfig] = [:]
    var _bumpFeeTxBuilders: [String: BumpFeeTxBuilder] = [:]
    var _transactions: [String: Transaction] = [:]


    /** Mnemonic methods starts */
    @objc
    func generateSeedFromWordCount(_
        wordCount: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            let response = Mnemonic(wordCount: setWordCount(wordCount: wordCount))
            DispatchQueue.main.async {
                resolve(response.asString())
            }
        }
    }

    @objc
    func generateSeedFromString(_
        mnemonic: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let response = try Mnemonic.fromString(mnemonic: mnemonic)
                DispatchQueue.main.async {
                    resolve(response.asString())
                }
            } catch let error {
                reject("Generate seed error", "\(error)", error)
            }
        }
    }

    @objc
    func generateSeedFromEntropy(_
        entropy: NSArray,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let response = try Mnemonic.fromEntropy(entropy: getEntropy(entropy: entropy))
                DispatchQueue.main.async {
                    resolve(response.asString())
                }
            } catch let error {
                reject("Generate seed error", "\(error)", error)
            }
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
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let id = randomId()
                _derivationPaths[id] = try DerivationPath(path: path)
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                reject("Create Derivation path error", "\(error)", error)
            }
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
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let id = randomId()
                _descriptorSecretKeys[id] = try DescriptorSecretKey(
                    network: setNetwork(networkStr: network),
                    mnemonic: Mnemonic.fromString(mnemonic: mnemonic),
                    password: password
                )
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                reject("DescriptorSecret create error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorSecretDerive(_
        secretKeyId: String,
        derivationPathId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let keyInfo = try _descriptorSecretKeys[secretKeyId]!.derive(path: _derivationPaths[derivationPathId]!)
                DispatchQueue.main.async {
                    resolve(keyInfo.asString())
                }
            } catch let error {
                reject("DescriptorSecret derive error", "\(error)", error)
            }
        }
        
    }

    @objc
    func descriptorSecretExtend(_
        secretKeyId: String,
        derivationPathId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let keyInfo = try _descriptorSecretKeys[secretKeyId]!.extend(path: _derivationPaths[derivationPathId]!)
                DispatchQueue.main.async {
                    resolve(keyInfo.asString())
                }
            } catch let error {
                reject("DescriptorSecret extend error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorSecretAsPublic(_
        secretKeyId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _descriptorPublicKeys[id] = _descriptorSecretKeys[secretKeyId]!.asPublic()
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func descriptorSecretAsString(_
        secretKeyId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_descriptorSecretKeys[secretKeyId]!.asString())
            }
        }
    }

    @objc
    func descriptorSecretAsSecretBytes(_
        secretKeyId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_descriptorSecretKeys[secretKeyId]!.secretBytes())
            }
        }
    }
    /** Descriptor secret key methods ends */


    /** Descriptor public key methods starts */
    @objc
    func createDescriptorPublic(_
        publicKey: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let id = randomId()
                _descriptorPublicKeys[id] = try DescriptorPublicKey.fromString(publicKey: publicKey)
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                reject("DescriptorPublic create error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorPublicDerive(_
        publicKeyId: String,
        derivationPathId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let keyInfo = try _descriptorPublicKeys[publicKeyId]!.derive(path: _derivationPaths[derivationPathId]!)
                DispatchQueue.main.async {
                    resolve(keyInfo.asString())
                }
            } catch let error {
                reject("DescriptorPublic derive error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorPublicExtend(_
        publicKeyId: String,
        derivationPathId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let keyInfo = try _descriptorPublicKeys[publicKeyId]!.extend(path: _derivationPaths[derivationPathId]!)
                DispatchQueue.main.async {
                    resolve(keyInfo.asString())
                }
            } catch let error {
                reject("DescriptorPublic extend error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorPublicAsString(_
        publicKeyId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_descriptorPublicKeys[publicKeyId]!.asString())
            }
        }
    }

    /** Descriptor public key methods ends */


    /** Blockchain methods starts */
    func getBlockchainById(id: String) -> Blockchain {
        return _blockChains[id]!
    }
    @objc
    func initElectrumBlockchain(_
        url: String,
        sock5: String,
        retry: NSNumber,
        timeout: NSNumber,
        stopGap: NSNumber,
        validateDomain: Bool,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let _blockchainConfig = BlockchainConfig.electrum(
                    config: ElectrumConfig(
                        url: url,
                        socks5: sock5.isEmpty ? nil : sock5,
                        retry: UInt8(truncating: retry),
                        timeout: UInt8(truncating: timeout),
                        stopGap: UInt64(truncating: stopGap),
                        validateDomain: validateDomain
                    )
                )
                let blockChainId = randomId()
                _blockChains[blockChainId] = try Blockchain(config: _blockchainConfig)
                DispatchQueue.main.async {
                    resolve(blockChainId)
                }
            } catch let error {
                reject("BlockchainElectrum init error", "\(error)", error)
            }
        }
    }

    @objc
    func initEsploraBlockchain(_
        baseUrl: String,
        proxy: String,
        concurrency: NSNumber,
        stopGap: NSNumber,
        timeout: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let _blockchainConfig = BlockchainConfig.esplora(
                    config: EsploraConfig(
                        baseUrl: baseUrl,
                        proxy: proxy.isEmpty ? nil : proxy,
                        concurrency: UInt8(truncating: concurrency),
                        stopGap: UInt64(truncating: stopGap),
                        timeout: UInt64(truncating: timeout)
                    )
                )
                let blockChainId = randomId()
                _blockChains[blockChainId] = try Blockchain(config: _blockchainConfig)
                DispatchQueue.main.async {
                    resolve(blockChainId)
                }
            } catch let error {
                reject("BlockchainEsplora init error", "\(error)", error)
            }
        }
    }

    @objc
    func initRpcBlockchain(_
        config: NSDictionary,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                var authType = Auth.none
                if config["authCookie"] != nil {
                    authType = Auth.cookie(file: config["authCookie"] as! String)
                }
                
                if config["authUserPass"] != nil {
                    let userPass = config["authUserPass"] as! NSDictionary
                    authType = Auth.userPass(
                        username: userPass["username"] as! String,
                        password: userPass["password"] as! String
                    )
                }
                
                var syncParams: RpcSyncParams? = nil
                if config["syncParams"] != nil {
                    let syncParamsConfig = config["syncParams"] as! NSDictionary
                    syncParams = RpcSyncParams(
                        startScriptCount: syncParamsConfig["startScriptCount"] as! UInt64,
                        startTime: syncParamsConfig["startTime"] as! UInt64,
                        forceStartTime: syncParamsConfig["forceStartTime"] as! Bool,
                        pollRateSec: syncParamsConfig["pollRateSec"] as! UInt64
                    )
                }
                
                let _blockchainConfig = BlockchainConfig.rpc(
                    config: RpcConfig(
                        url: config["url"] as! String,
                        auth: authType,
                        network: setNetwork(networkStr: config["network"] as? String),
                        walletName: config["walletName"] as! String,
                        syncParams: syncParams
                    )
                )
                let blockChainId = randomId()
                _blockChains[blockChainId] = try Blockchain(config: _blockchainConfig)
                DispatchQueue.main.async {
                    resolve(blockChainId)
                }
            } catch let error {
                reject("BlockchainRpc init error", "\(error)", error)
            }
        }
    }

    @objc
    func getBlockchainHeight(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let height = try getBlockchainById(id: id).getHeight()
                DispatchQueue.main.async {
                    resolve(height)
                }
            } catch let error {
                reject("Blockchain get height error", "\(error)", error)
            }
        }
    }


    @objc
    func getBlockchainHash(_
        id: String,
        height: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let hash = try getBlockchainById(id: id).getBlockHash(height: UInt32(truncating: height))
                DispatchQueue.main.async {
                    resolve(hash)
                }
            } catch let error {
                reject("Blockchain get block hash error", "\(error)", error)
            }
        }
    }

    @objc
    func broadcast(_
        id: String,
        txId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                _ = try getBlockchainById(id: id).broadcast(transaction: _transactions[txId]!)
                DispatchQueue.main.async {
                    resolve(true)
                }
            } catch let error {
                reject("Broadcast transaction error", "\(error)", error)
            }
        }
    }

    @objc
    func estimateFee(_
        id: String,
        target: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let fee = try getBlockchainById(id: id).estimateFee(target: UInt64(truncating: target))
                DispatchQueue.main.async {
                    resolve(fee.asSatPerVb())
                }
            } catch let error {
                reject("Estimate Fee error", "\(error)", error)
            }
        }
    }
    /** Blockchain methods ends */

    /** DB configuration methods starts*/
    @objc
    func memoryDBInit(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _databaseConfigs[id] = DatabaseConfig.memory
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func sledDBInit(_
        path: String,
        treeName: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _databaseConfigs[id] = DatabaseConfig.sled(config: SledDbConfiguration(path: path, treeName: treeName))
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func sqliteDBInit(_
        path: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _databaseConfigs[id] = DatabaseConfig.sqlite(config: SqliteDbConfiguration(path: path))
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }
    /** DB configuration methods ends*/

    /** Wallet methods starts*/
    func getWalletById(id: String) -> Wallet {
        return _wallets[id]!
    }

    @objc
    func walletInit(_
        descriptor: String,
        changeDescriptor: String? = nil,
        network: String,
        dbConfigID: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                var changeDes: Descriptor? = nil
                if let changeDescriptor = changeDescriptor {
                    changeDes = _descriptors[changeDescriptor]
                }
                let id = randomId()
                
                // Retrieve the database configuration using the dbConfigID
                guard let databaseConfig = getDatabaseConfig(id: dbConfigID) else {
                    throw NSError(domain: "WalletInitError", code: 0, userInfo: [NSLocalizedDescriptionKey: "Invalid database configuration ID"])
                }
                
                _wallets[id] = try Wallet(
                    descriptor: _descriptors[descriptor] as! Descriptor,
                    changeDescriptor: changeDes,
                    network: setNetwork(networkStr: network),
                    databaseConfig: databaseConfig
                )
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Init wallet error", "\(error)", error)
                }
            }
        }
    }


    @objc
    func sync(_
        id: String,
        blockChainId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let wallet = self.getWalletById(id: id)
                let blockchain = self.getBlockchainById(id: blockChainId)
                let syncRequest = wallet.startSyncWithRevealedSpks()
                
                DispatchQueue.main.async {
                    resolve(true)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Sync wallet error", "\(error)", error)
                }
            }
        }
    }


    @objc
    func getAddress(_
        id: String,
        addressIndex: Any,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let keychain: KeychainKind = (addressIndex as? Bool == true) ? .internal : .external
                let addressInfo = try getWalletById(id: id).revealNextAddress(keychain: keychain)
                let randomId = randomId()
                _addresses[randomId] = addressInfo.address
                DispatchQueue.main.async {
                    resolve([
                        "index": addressInfo.index,
                        "address": randomId,
                        "keychain": "\(addressInfo.keychain)"
                    ] as [String: Any])
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get wallet address error", "\(error)", error)
                }
            }
        }
    }
    
    @objc
    func getInternalAddress(_
        id: String,
        addressIndex: Any,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let addressInfo = try getWalletById(id: id).revealNextAddress(keychain: .internal)
                let randomId = randomId()
                _addresses[randomId] = addressInfo.address
                DispatchQueue.main.async {
                    resolve([
                        "index": addressInfo.index,
                        "address": randomId,
                        "keychain": "\(addressInfo.keychain)"
                    ] as [String: Any])
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get internal address error", "\(error)", error)
                }
            }
        }
    }
    
    
    @objc
    func isMine(_
        id: String,
        scriptId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                resolve(try getWalletById(id: id).isMine(script: _scripts[scriptId]!))
            } catch let error {
                reject("Check wallet isMine error", "\(error)", error)
            }
        }
    }

    @objc
    func getBalance(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let balance = getWalletById(id: id).getBalance()
                let responseBalance = [
                    "trustedPending": balance.trustedPending,
                    "untrustedPending": balance.untrustedPending,
                    "confirmed": balance.confirmed,
                    "total": balance.total
                ] as [String: Any]
                DispatchQueue.main.async {
                    resolve(responseBalance)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get wallet balance error", "\(error)", error)
                }
            }
        }
    }


    @objc
    func getNetwork(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.main.async { [self] in
            let network = getWalletById(id: id).network()
            resolve(getNetworkString(network: network))
        }
    }

    @objc
    func listUnspent(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let unspent = try getWalletById(id: id).listUnspent()
                var responseObject: [Any] = []
                for item in unspent {
                    let unspentObject = [
                        "outpoint": getOutPoint(outPoint: item.outpoint),
                        "txout": createTxOut(txOut: item.txout, _scripts: &_scripts),
                        "isSpent": item.isSpent,
                        "keychain": "\(item.keychain)"
                    ] as [String: Any]
                    responseObject.append(unspentObject)
                }
                DispatchQueue.main.async {
                    resolve(responseObject)
                }
            } catch let error {
                reject("List unspent outputs error", "\(error)", error)
            }
        }
    }

    @objc
    func listTransactions(_
        id: String,
        includeRaw: Bool,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let transactions = getWalletById(id: id).transactions()
                var responseObject: [Any] = []
                for tx in transactions {
                    var txObject = getTransactionObject(transaction: tx)
                    if includeRaw, let transaction = tx.transaction {
                        let randomId = randomId()
                        _transactions[randomId] = transaction
                        txObject["transaction"] = randomId
                    } else {
                        txObject["transaction"] = false
                    }
                    responseObject.append(txObject)
                }
                DispatchQueue.main.async {
                    resolve(responseObject)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("List transactions error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func sign(_
        id: String,
        psbtBase64: String,
        signOptions: Any? = nil,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                var options: [String: Any]? = nil
                if let signOpts = signOptions as? NSDictionary {
                    options = createSignOptions(options: signOpts)
                }
                
                let psbt = try Psbt(psbtBase64: psbtBase64)
                _ = try self.getWalletById(id: id).sign(psbt: psbt, signOptions: options)
                DispatchQueue.main.async {
                    resolve(psbt.serialize())
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Sign PSBT error", "\(error)", error)
                }
            }
        }
    }


    /** Wallet methods ends*/

    /** Address methods starts*/

    @objc
    func initAddress(_
        address: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let id = randomId()
                _addresses[id] = try Address(address: address, network: setNetwork(networkStr: network))
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                reject("Address error", "\(error)", error)
            }
        }
    }

    // @objc
    // func addressFromScript(_
    //     scriptId: String,
    //     network: String,
    //     resolve: @escaping RCTPromiseResolveBlock,
    //     reject: @escaping RCTPromiseRejectBlock
    // ) {
    //     DispatchQueue.global(qos: .userInteractive).async { [self] in
    //         do {
    //             let id = randomId()
    //             _addresses[id] = try Address.fromScript(script: _scripts[scriptId]!, network: setNetwork(networkStr: network))
    //             DispatchQueue.main.async {
    //                 resolve(id)
    //             }
    //         } catch let error {
    //             reject("Address from script error", "\(error)", error)
    //         }
    //     }
    // }

    @objc
    func addressToScriptPubkeyHex(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let scriptId = randomId()
            _scripts[scriptId] = _addresses[id]?.scriptPubkey()
            DispatchQueue.main.async {
                resolve(scriptId)
            }
        }
    }

    // @objc
    // func addressPayload(_
    //     id: String,
    //     resolve: @escaping RCTPromiseResolveBlock,
    //     reject: @escaping RCTPromiseRejectBlock
    // ) {
    //     DispatchQueue.global(qos: .userInteractive).async { [self] in
    //         let pay = _addresses[id]?.payload()
    //         DispatchQueue.main.async {
    //             resolve(getPayload(payload: pay!))
    //         }
    //     }
    // }

    @objc
    func addressNetwork(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async {
                resolve(getNetworkString(network: self._addresses[id]!.network()))
            }
        }
    }


    @objc
    func addressToQrUri(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_addresses[id]!.toQrUri())
            }
        }
    }


    @objc
    func addressAsString(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_addresses[id]!.asString())
            }
        }
    }
    
    
    @objc
    func addressIsValidForNetwork(_
        id: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_addresses[id]!.isValidForNetwork(network: setNetwork(networkStr: network)))
            }
        }
    }


    /** Address methods ends*/

    /** TxBuilder methods starts */
    @objc
    func createTxBuilder(_
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _txBuilders[id] = TxBuilder()
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }
        
    // `addRecipient`
  @objc
    func addRecipient(_
        id: String,
        scriptId: String,
        amount: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let satAmount = UInt64(truncating: amount)
                let amountObj = try Amount.fromSat(fromSat: satAmount)
                _txBuilders[id] = _txBuilders[id]?.addRecipient(
                    script: _scripts[scriptId]!,
                    amount: amountObj
                )
                DispatchQueue.main.async {
                    resolve(true)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Add recipient error", "\(error)", error)
                }
            }
        }
    }

    // `addUnspendable`
    @objc
    func addUnspendable(_
        id: String,
        outPoint: NSDictionary,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            _txBuilders[id] = _txBuilders[id]?.addUnspendable(unspendable: createOutPoint(outPoint: outPoint))
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    // `addUtxo`
    @objc
    func addUtxo(_
        id: String,
        outPoint: NSDictionary,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            _txBuilders[id] = _txBuilders[id]?.addUtxo(outpoint: createOutPoint(outPoint: outPoint))
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }


    // `addUtxos`
    @objc
    func addUtxos(_
        id: String,
        outPoints: [NSDictionary],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                for outPoint in outPoints {
                    let mappedOutPoint = createOutPoint(outPoint: outPoint)
                    _txBuilders[id] = _txBuilders[id]?.addUtxo(outpoint: mappedOutPoint)
                }
                DispatchQueue.main.async {
                    resolve(true)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Add UTXOs error", "\(error)", error)
                }
            }
        }
    }


    // `doNotSpendChange`
    @objc
    func doNotSpendChange(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            _txBuilders[id] = _txBuilders[id]?.doNotSpendChange()
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    // `manuallySelectedOnly`
    @objc
    func manuallySelectedOnly(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            _txBuilders[id] = _txBuilders[id]?.manuallySelectedOnly()
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    // `onlySpendChange`
    @objc
    func onlySpendChange(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            _txBuilders[id] = _txBuilders[id]?.onlySpendChange()
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }


    // `unspendable`
    @objc
    func unspendable(_
        id: String,
        outPoints: [NSDictionary],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            var mappedOutPoints: [OutPoint] = [];
            for outPoint in outPoints {
                mappedOutPoints.append(createOutPoint(outPoint: outPoint))
            }
            _txBuilders[id] = _txBuilders[id]?.unspendable(unspendable: mappedOutPoints)
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    // `feeRate`
    @objc
    func feeRate(_
        id: String,
        feeRate: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let satPerVb = UInt64(truncating: feeRate)
                let feeRateObj = try FeeRate.fromSatPerVb(satPerVb: satPerVb)
                _txBuilders[id] = _txBuilders[id]?.feeRate(feeRate: feeRateObj)
                DispatchQueue.main.async {
                    resolve(true)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Set fee rate error", "\(error)", error)
                }
            }
        }
    }

    // `feeAbsolute`
    @objc
    func feeAbsolute(_
        id: String,
        feeRate: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            _txBuilders[id] = _txBuilders[id]?.feeAbsolute(fee: UInt64(truncating: feeRate))
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    // `drainWallet`
    @objc
    func drainWallet(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            _txBuilders[id] = _txBuilders[id]?.drainWallet()
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    // `drainTo`
    @objc
    func drainTo(_
        id: String,
        scriptId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            _txBuilders[id] = _txBuilders[id]?.drainTo(script: _scripts[scriptId]!)
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    // `enableRbf`
    @objc
    func enableRbf(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            _txBuilders[id] = _txBuilders[id]?.enableRbf()
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    // `enableRbfWithSequence`
    @objc
    func enableRbfWithSequence(_
        id: String,
        nsequence: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            _txBuilders[id] = _txBuilders[id]?.enableRbfWithSequence(nsequence: UInt32(truncating: nsequence))
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }


    // `addData`
//    @objc
//    func addData(_
//        id: String,
//        data: NSArray,
//        resolve: @escaping RCTPromiseResolveBlock,
//        reject: @escaping RCTPromiseRejectBlock
//    ) {
//        DispatchQueue.global(qos: .userInteractive).async { [self] in
//            var dataList: [UInt8] = []
//            for item in data {
//                dataList.append(UInt8(truncating: item as! NSNumber))
//            }
//            _txBuilders[id] = _txBuilders[id]?.addData(data: dataList)
//            DispatchQueue.main.async {
//                resolve(true)
//            }
//        }
//    }


    // `setRecipients`
    @objc
    func setRecipients(_
        id: String,
        recipients: [NSDictionary],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                var scriptAmounts: [ScriptAmount] = []
                for item in recipients {
                    let amountValue = UInt64(truncating: item["amount"] as! NSNumber)
                    let amount = Amount.fromSat(fromSat: amountValue)
                    let script: NSDictionary = item["script"] as! NSDictionary
                    let scriptAmount = ScriptAmount(script: _scripts[script["id"] as! String]!, amount: amount)
                    scriptAmounts.append(scriptAmount)
                }
                _txBuilders[id] = _txBuilders[id]?.setRecipients(recipients: scriptAmounts)
                DispatchQueue.main.async {
                    resolve(true)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Set recipients error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func finish(_
        id: String,
        walletId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let details = try _txBuilders[id]?.finish(wallet: getWalletById(id: walletId))
                let responseObject = getPSBTObject(txResult: details)
                DispatchQueue.main.async {
                    resolve(responseObject)
                }
            } catch let error {
                reject("Finish tx error", "\(error)", error)
            }
        }
    }

    /** TxBuilder methods ends */

    /** Descriptor Templates method starts */
    @objc
    func createDescriptor(_
        descriptor: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let id = randomId()
                _descriptors[id] = try Descriptor(descriptor: descriptor, network: setNetwork(networkStr: network))
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                reject("Create Descriptor error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorAsString(_
        descriptorId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_descriptors[descriptorId]!.asString())
            }
        }
    }

    @objc
    func descriptorAsStringPrivate(_
        descriptorId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_descriptors[descriptorId]!.asStringPrivate())
            }
        }
    }

    @objc
    func newBip44(_
        secretKeyId: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _descriptors[id] = Descriptor.newBip44(
                secretKey: _descriptorSecretKeys[secretKeyId]!,
                keychain: setKeychainKind(keychainKind: keychain),
                network: setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func newBip44Public(_
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _descriptors[id] = Descriptor.newBip44Public(
                publicKey: _descriptorPublicKeys[publicKeyId]!,
                fingerprint: fingerprint,
                keychain: setKeychainKind(keychainKind: keychain),
                network: setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func newBip49(_
        secretKeyId: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _descriptors[id] = Descriptor.newBip49(
                secretKey: _descriptorSecretKeys[secretKeyId]!,
                keychain: setKeychainKind(keychainKind: keychain),
                network: setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func newBip49Public(_
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _descriptors[id] = Descriptor.newBip49Public(
                publicKey: _descriptorPublicKeys[publicKeyId]!,
                fingerprint: fingerprint,
                keychain: setKeychainKind(keychainKind: keychain),
                network: setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func newBip84(_
        secretKeyId: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _descriptors[id] = Descriptor.newBip84(
                secretKey: _descriptorSecretKeys[secretKeyId]!,
                keychain: setKeychainKind(keychainKind: keychain),
                network: setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func newBip84Public(_
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _descriptors[id] = Descriptor.newBip84Public(
                publicKey: _descriptorPublicKeys[publicKeyId]!,
                fingerprint: fingerprint,
                keychain: setKeychainKind(keychainKind: keychain),
                network: setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }
    
    @objc
    func newBip86(_
        secretKeyId: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _descriptors[id] = Descriptor.newBip86(
                secretKey: _descriptorSecretKeys[secretKeyId]!,
                keychain: setKeychainKind(keychainKind: keychain),
                network: setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func newBip86Public(_
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let id = randomId()
            _descriptors[id] = Descriptor.newBip86Public(
                publicKey: _descriptorPublicKeys[publicKeyId]!,
                fingerprint: fingerprint,
                keychain: setKeychainKind(keychainKind: keychain),
                network: setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }
    /** Descriptor Templates method ends */

    /** PartiallySignedTransaction method starts */
//    @objc
//    func combine(_
//        base64: String,
//        other: String,
//        resolve: @escaping RCTPromiseResolveBlock,
//        reject: @escaping RCTPromiseRejectBlock
//    ) {
//        DispatchQueue.global(qos: .userInteractive).async {
//            do {
//                let newPsbt = try PartiallySignedTransaction(psbtBase64: base64)
//                    .combine(other: PartiallySignedTransaction(psbtBase64: other))
//                DispatchQueue.main.async {
//                    resolve(newPsbt.serialize())
//                }
//            } catch let error {
//                reject("PSBT combine error", "\(error)", error)
//            }
//        }
//    }

    @objc
    func extractTx(_
        base64: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let id = randomId()
                _transactions[id] = try Psbt(psbtBase64: base64).extractTx()
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                reject("PSBT extract error", "\(error)", error)
            }
        }
    }

    @objc
    func serialize(_
        base64: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let hex = try Psbt(psbtBase64: base64).serialize()
                DispatchQueue.main.async {
                    resolve(hex)
                }
            } catch let error {
                reject("Bump TX finish error", "\(error)", error)
            }
        }
    }

    @objc
    func txid(_
        base64: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let txid = try Psbt(psbtBase64: base64).extractTx().txid
                DispatchQueue.main.async {
                    resolve(txid)
                }
            } catch let error {
                reject("PSBT txid error", "\(error)", error)
            }
        }
    }

//    @objc
//    func feeAmount(_
//        base64: String,
//        resolve: @escaping RCTPromiseResolveBlock,
//        reject: @escaping RCTPromiseRejectBlock
//    ) {
//        DispatchQueue.global(qos: .userInteractive).async {
//            do {
//                let feeAmount = try Psbt(psbtBase64: base64).feeAmount()
//                DispatchQueue.main.async {
//                    resolve(feeAmount)
//                }
//            } catch let error {
//                reject("PSBT feeAmount error", "\(error)", error)
//            }
//        }
//    }

//    @objc
//    func psbtFeeRate(_
//        base64: String,
//        resolve: @escaping RCTPromiseResolveBlock,
//        reject: @escaping RCTPromiseRejectBlock
//    ) {
//        DispatchQueue.global(qos: .userInteractive).async {
//            do {
//                let psbtFeeRate = try Psbt(psbtBase64: base64).feeRate()?.asSatPerVb()
//                DispatchQueue.main.async {
//                    resolve(psbtFeeRate)
//                }
//            } catch let error {
//                reject("PSBT feeRate error", "\(error)", error)
//            }
//        }
//    }

//    @objc
//    func jsonSerialize(_
//        base64: String,
//        resolve: @escaping RCTPromiseResolveBlock,
//        reject: @escaping RCTPromiseRejectBlock
//    ) {
//        DispatchQueue.global(qos: .userInteractive).async {
//            do {
//                let serialized = try Psbt(psbtBase64: base64).jsonSerialize()
//                DispatchQueue.main.async {
//                    resolve(serialized)
//                }
//            } catch let error {
//                reject("PSBT jsonSerialize error", "\(error)", error)
//            }
//        }
//    }
    /** PartiallySignedTransaction method ends */


    /** BumpFeeTxBuilder methods starts*/
@objc
func bumpFeeTxBuilderInit(_
    txid: String,
    newFeeRate: NSNumber,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
) {
    DispatchQueue.global(qos: .userInteractive).async { [self] in
        do {
            let id = randomId()
            let feeRate = try FeeRate.fromSatPerVb(satPerVb: UInt64(newFeeRate.floatValue))
            _bumpFeeTxBuilders[id] = BumpFeeTxBuilder(txid: txid, feeRate: feeRate)
            DispatchQueue.main.async {
                resolve(id)
            }
        } catch let error {
            DispatchQueue.main.async {
                reject("BumpFeeTxBuilder init error", "\(error)", error)
            }
        }
    }
}

//    @objc
//    func bumpFeeTxBuilderAllowShrinking(_
//        id: String,
//        scriptId: String,
//        resolve: @escaping RCTPromiseResolveBlock,
//        reject: @escaping RCTPromiseRejectBlock
//    ) {
//        DispatchQueue.global(qos: .userInteractive).async { [self] in
//            _bumpFeeTxBuilders[id] = _bumpFeeTxBuilders[id]!.allowShrinking(scriptPubkey: _scripts[scriptId]!)
//            DispatchQueue.main.async {
//                resolve(true)
//            }
//        }
//    }

    @objc
    func bumpFeeTxBuilderEnableRbf(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            _bumpFeeTxBuilders[id] = _bumpFeeTxBuilders[id]!.enableRbf()
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    @objc
    func bumpFeeTxBuilderEnableRbfWithSequence(_
        id: String,
        nSequence: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            _bumpFeeTxBuilders[id] = _bumpFeeTxBuilders[id]!.enableRbfWithSequence(nsequence: UInt32(truncating: nSequence))
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    @objc
    func bumpFeeTxBuilderFinish(_
        id: String,
        walletId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let res = try _bumpFeeTxBuilders[id]!.finish(wallet: getWalletById(id: walletId))
                DispatchQueue.main.async {
                    resolve(res.serialize())
                }
            } catch let error {
                reject("BumpFee Txbuilder finish error", "\(error)", error)
            }
        }
    }
    /** BumpFeeTxBuilder methods ends*/


    /** Transaction methods starts*/
    @objc
    func createTransaction(_
        bytes: NSArray,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let id = randomId()
                _transactions[id] = try Transaction(transactionBytes: getTxBytes(bytes: bytes))
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                reject("Create transaction error", "\(error)", error)
            }
        }
    }


    @objc
    func serializeTransaction(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_transactions[id]!.serialize())
            }
        }
    }

    @objc
    func transactionTxid(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_transactions[id]!.txid())
            }
        }
    }

    @objc
    func txWeight(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_transactions[id]!.weight())
            }
        }
    }

    @objc
    func txSize(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_transactions[id]!.totalSize())
            }
        }
    }

    @objc
    func txVsize(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_transactions[id]!.vsize())
            }
        }
    }

    @objc
    func txIsCoinBase(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_transactions[id]!.isCoinbase())
            }
        }
    }

    @objc
    func txIsExplicitlyRbf(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_transactions[id]!.isExplicitlyRbf())
            }
        }
    }

    @objc
    func txIsLockTimeEnabled(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_transactions[id]!.isLockTimeEnabled())
            }
        }
    }

    @objc
    func txVersion(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_transactions[id]!.version())
            }
        }
    }

    @objc
    func txLockTime(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async { [self] in
                resolve(_transactions[id]!.lockTime())
            }
        }
    }


    @objc
    func txInput(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let list = _transactions[id]!.input()
            var mapped: [Any] = [];
            for item in list {
                mapped.append(createTxIn(txIn: item, _scripts: &_scripts))
            }
            DispatchQueue.main.async {
                resolve(mapped)
            }
        }
    }


    @objc
    func txOutput(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let list = _transactions[id]!.output()
            var mapped: [Any] = [];
            for item in list {
                mapped.append(createTxOut(txOut: item, _scripts: &_scripts))
            }
            DispatchQueue.main.async {
                resolve(mapped)
            }
        }
    }
    /** Transaction methods ends*/
    
    /** Script methods starts*/
    
    @objc
    func toBytes(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            DispatchQueue.main.async {
                resolve(self._scripts[id]!.toBytes())
            }
        }
    }
    
    
    /** Script methods ends*/
}

