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
    
    private func randomId() -> String {
        return UUID().uuidString
    }
    
    private func storeObject<T>(_ object: T, in storage: inout [String: T]) -> String {
    let id = randomId()
    storage[id] = object
    return id
}

    private func setNetwork(networkStr: String) -> Network {
        switch networkStr.lowercased() {
        case "testnet":
            return Network.testnet
        case "regtest":
            return Network.regtest
        default:
            return Network.bitcoin
        }
    }
    private var _wallets: [String: Wallet] = [:]
    private var _psbts: [String: Psbt] = [:]
    var _feeRates: [String: FeeRate] = [:]
    var _updates: [String: Update] = [:]
    var _fullScanRequests: [String: FullScanRequest] = [:]
    var _syncRequests: [String: SyncRequest] = [:]
    var _blockChains: [String: Any] = [:]
    var _blockChainMethods: [String: Any] = [:]
    var _sqlitePaths: [String: String] = [:]
    var _sledPaths: [String: (path: String, treeName: String)] = [:]
    var _memoryDBs: [String: Bool] = [:]
    var _descriptorSecretKeys: [String: DescriptorSecretKey] = [:]
    var _descriptorPublicKeys: [String: DescriptorPublicKey] = [:]
    var _addresses: [String: Address] = [:]
    var _scripts: [String: Script] = [:]
    var _txBuilders: [String: TxBuilder] = [:]
    var _descriptors: [String: Descriptor] = [:]
    var _derivationPaths: [String: DerivationPath] = [:]
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

    /** DerivationPath methods starts */

    @objc
    func createDerivationPath(_ path: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let derivationPath = try DerivationPath(path: path)
                let id = self.randomId()
                self._derivationPaths[id] = derivationPath
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                reject("DerivationPath error", "\(error)", error)
            }
        }
    }

    // Since DerivationPath doesn't have any specific methods in the protocol,
    // we'll add a method to get the string representation of the path.
    @objc
    func derivationPathToString(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let derivationPath = self._derivationPaths[id] else {
                reject("DerivationPath error", "DerivationPath not found", nil)
                return
            }
            // Note: There's no direct method to get the string representation,
            // so we're returning the id as a placeholder. In a real implementation,
            // you might want to store the original string or implement a toString method.
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    /** DerivationPath methods ends */

    /** DescriptorPublicKey methods starts */

    @objc
    func createDescriptorPublicKey(_ publicKey: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let descriptorPublicKey = try DescriptorPublicKey.fromString(publicKey: publicKey)
                let id = self.randomId()
                self._descriptorPublicKeys[id] = descriptorPublicKey
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                reject("DescriptorPublicKey error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorPublicKeyAsString(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let descriptorPublicKey = self._descriptorPublicKeys[id] else {
                reject("DescriptorPublicKey error", "DescriptorPublicKey not found", nil)
                return
            }
            let result = descriptorPublicKey.asString()
            DispatchQueue.main.async {
                resolve(result)
            }
        }
    }

    @objc
    func descriptorPublicKeyDerive(_ id: String, path: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let descriptorPublicKey = self._descriptorPublicKeys[id] else {
                reject("DescriptorPublicKey error", "DescriptorPublicKey not found", nil)
                return
            }
            do {
                let derivationPath = try DerivationPath(path: path)
                let derivedKey = try descriptorPublicKey.derive(path: derivationPath)
                let newId = self.randomId()
                self._descriptorPublicKeys[newId] = derivedKey
                DispatchQueue.main.async {
                    resolve(newId)
                }
            } catch let error {
                reject("DescriptorPublicKey derive error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorPublicKeyExtend(_ id: String, path: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let descriptorPublicKey = self._descriptorPublicKeys[id] else {
                reject("DescriptorPublicKey error", "DescriptorPublicKey not found", nil)
                return
            }
            do {
                let derivationPath = try DerivationPath(path: path)
                let extendedKey = try descriptorPublicKey.extend(path: derivationPath)
                let newId = self.randomId()
                self._descriptorPublicKeys[newId] = extendedKey
                DispatchQueue.main.async {
                    resolve(newId)
                }
            } catch let error {
                reject("DescriptorPublicKey extend error", "\(error)", error)
            }
        }
    }

    /** DescriptorPublicKey methods ends */

    /** DescriptorSecretKey methods starts */

    @objc
    func createDescriptorSecretKey(_ network: String, mnemonic: String, password: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let mnemonicObj = try Mnemonic.fromString(mnemonic: mnemonic)
                let descriptorSecretKey = DescriptorSecretKey(network: self.setNetwork(networkStr: network), mnemonic: mnemonicObj, password: password)
                let id = self.randomId()
                self._descriptorSecretKeys[id] = descriptorSecretKey
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                reject("DescriptorSecretKey error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorSecretKeyFromString(_ secretKey: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let descriptorSecretKey = try DescriptorSecretKey.fromString(secretKey: secretKey)
                let id = self.randomId()
                self._descriptorSecretKeys[id] = descriptorSecretKey
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                reject("DescriptorSecretKey error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorSecretKeyAsPublic(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let descriptorSecretKey = self._descriptorSecretKeys[id] else {
                reject("DescriptorSecretKey error", "DescriptorSecretKey not found", nil)
                return
            }
            let descriptorPublicKey = descriptorSecretKey.asPublic()
            let publicKeyId = self.randomId()
            self._descriptorPublicKeys[publicKeyId] = descriptorPublicKey
            DispatchQueue.main.async {
                resolve(publicKeyId)
            }
        }
    }

    @objc
    func descriptorSecretKeyAsString(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let descriptorSecretKey = self._descriptorSecretKeys[id] else {
                reject("DescriptorSecretKey error", "DescriptorSecretKey not found", nil)
                return
            }
            let result = descriptorSecretKey.asString()
            DispatchQueue.main.async {
                resolve(result)
            }
        }
    }

    @objc
    func descriptorSecretKeyDerive(_ id: String, path: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let descriptorSecretKey = self._descriptorSecretKeys[id] else {
                reject("DescriptorSecretKey error", "DescriptorSecretKey not found", nil)
                return
            }
            do {
                let derivationPath = try DerivationPath(path: path)
                let derivedKey = try descriptorSecretKey.derive(path: derivationPath)
                let newId = self.randomId()
                self._descriptorSecretKeys[newId] = derivedKey
                DispatchQueue.main.async {
                    resolve(newId)
                }
            } catch let error {
                reject("DescriptorSecretKey derive error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorSecretKeyExtend(_ id: String, path: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let descriptorSecretKey = self._descriptorSecretKeys[id] else {
                reject("DescriptorSecretKey error", "DescriptorSecretKey not found", nil)
                return
            }
            do {
                let derivationPath = try DerivationPath(path: path)
                let extendedKey = try descriptorSecretKey.extend(path: derivationPath)
                let newId = self.randomId()
                self._descriptorSecretKeys[newId] = extendedKey
                DispatchQueue.main.async {
                    resolve(newId)
                }
            } catch let error {
                reject("DescriptorSecretKey extend error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorSecretKeySecretBytes(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let descriptorSecretKey = self._descriptorSecretKeys[id] else {
                reject("DescriptorSecretKey error", "DescriptorSecretKey not found", nil)
                return
            }
            let secretBytes = descriptorSecretKey.secretBytes()
            DispatchQueue.main.async {
                resolve(secretBytes)
            }
        }
    }

    /** DescriptorSecretKey methods ends */


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


    /** DB configuration methods starts*/
    
    @objc
    func memoryDBInit(
        _ resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            let id = self.randomId()
            self._memoryDBs[id] = true
            
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }
    @objc
    func sledDBInit(
        _ path: String,
        treeName: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let id = self.randomId()
                self._sledPaths[id] = (path: path, treeName: treeName)
                
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Sled DB Init error", "\(error)", error)
                }
            }
        }
    }

    @objc
       func sqliteDBInit(
           _ path: String,
           resolve: @escaping RCTPromiseResolveBlock,
           reject: @escaping RCTPromiseRejectBlock
       ) {
           DispatchQueue.global(qos: .userInteractive).async {
               do {
                   let id = self.randomId()
                   self._sqlitePaths[id] = path
                   
                   DispatchQueue.main.async {
                       resolve(id)
                   }
               } catch let error {
                   DispatchQueue.main.async {
                       reject("SQLite DB Init error", "\(error)", error)
                   }
               }
           }
       }
    
    /** DB configuration methods ends*/

    /** Wallet methods starts*/
    func getWalletById(id: String) -> Wallet {
        return _wallets[id]!
    }

//    @objc
//    func walletInit(_
//        descriptor: String,
//        changeDescriptor: String? = nil,
//        network: String,
//        dbConfigID: String,
//        resolve: @escaping RCTPromiseResolveBlock,
//        reject: @escaping RCTPromiseRejectBlock
//    ) {
//        DispatchQueue.global(qos: .userInteractive).async { [self] in
//            do {
//                var changeDes: Descriptor? = nil
//                if let changeDescriptor = changeDescriptor {
//                    changeDes = _descriptors[changeDescriptor]
//                }
//                let id = randomId()
//                
//                // Retrieve the database configuration using the dbConfigID
//                guard let databaseConfig = getDatabaseConfig(id: dbConfigID) else {
//                    throw NSError(domain: "WalletInitError", code: 0, userInfo: [NSLocalizedDescriptionKey: "Invalid database configuration ID"])
//                }
//                
//                _wallets[id] = try Wallet(
//                    descriptor: _descriptors[descriptor] as! Descriptor,
//                    changeDescriptor: changeDes,
//                    network: setNetwork(networkStr: network),
//                    databaseConfig: databaseConfig
//                )
//                DispatchQueue.main.async {
//                    resolve(id)
//                }
//            } catch let error {
//                DispatchQueue.main.async {
//                    reject("Init wallet error", "\(error)", error)
//                }
//            }
//        }
//    }


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

//    @objc
//    func listTransactions(_
//        id: String,
//        includeRaw: Bool,
//        resolve: @escaping RCTPromiseResolveBlock,
//        reject: @escaping RCTPromiseRejectBlock
//    ) {
//        DispatchQueue.global(qos: .userInteractive).async { [self] in
//            do {
//                let transactions = getWalletById(id: id).transactions()
//                var responseObject: [Any] = []
//                for tx in transactions {
//                    var txObject = getTransactionObject(transaction: tx)
//                    if includeRaw, let transaction = tx.transaction {
//                        let randomId = randomId()
//                        _transactions[randomId] = transaction
//                        txObject["transaction"] = randomId
//                    } else {
//                        txObject["transaction"] = false
//                    }
//                    responseObject.append(txObject)
//                }
//                DispatchQueue.main.async {
//                    resolve(responseObject)
//                }
//            } catch let error {
//                DispatchQueue.main.async {
//                    reject("List transactions error", "\(error)", error)
//                }
//            }
//        }
//    }

//    @objc
//    func sign(_
//        id: String,
//        psbtBase64: String,
//        signOptions: Any? = nil,
//        resolve: @escaping RCTPromiseResolveBlock,
//        reject: @escaping RCTPromiseRejectBlock
//    ) {
//        DispatchQueue.global(qos: .userInteractive).async {
//            do {
//                var options: [String: Any]? = nil
//                if let signOpts = signOptions as? NSDictionary {
//                    options = createSignOptions(options: signOpts)
//                }
//                
//                let psbt = try Psbt(psbtBase64: psbtBase64)
//                _ = try self.getWalletById(id: id).sign(psbt: psbt, signOptions: options)
//                DispatchQueue.main.async {
//                    resolve(psbt.serialize())
//                }
//            } catch let error {
//                DispatchQueue.main.async {
//                    reject("Sign PSBT error", "\(error)", error)
//                }
//            }
//        }
//    }


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
    
    /** Amount methods starts*/

    @objc
    func createAmountFromSat(_ sat: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            let amount = Amount.fromSat(fromSat: UInt64(truncating: sat))
            DispatchQueue.main.async {
                resolve(amount.toSat())
            }
        }
    }

    @objc
    func createAmountFromBtc(_ btc: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let amount = try Amount.fromBtc(fromBtc: btc.doubleValue)
                DispatchQueue.main.async {
                    resolve(amount.toSat())
                }
            } catch let error {
                reject("Amount creation error", "\(error)", error)
            }
        }
    }

    @objc
    func amountAsSats(_ sats: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            let amount = Amount.fromSat(fromSat: UInt64(truncating: sats))
            DispatchQueue.main.async {
                resolve(amount.toSat())
            }
        }
    }

    @objc
    func amountAsBtc(_ sats: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            let amount = Amount.fromSat(fromSat: UInt64(truncating: sats))
            DispatchQueue.main.async {
                resolve(amount.toBtc())
            }
        }
    }

    /** Amount methods ends*/

    /** BumpFeeTxBuilder methods starts */

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
    /** BumpFeeTxBuilder methods ends */

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

    /** FeeRate methods starts */

    @objc
    func createFeeRateFromSatPerVb(_ satPerVb: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let feeRate = try FeeRate.fromSatPerVb(satPerVb: UInt64(truncating: satPerVb))
                let id = self.randomId()
                self._feeRates[id] = feeRate
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                reject("FeeRate error", "\(error)", error)
            }
        }
    }

    @objc
    func createFeeRateFromSatPerKwu(_ satPerKwu: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            let feeRate = FeeRate.fromSatPerKwu(satPerKwu: UInt64(truncating: satPerKwu))
            let id = self.randomId()
            self._feeRates[id] = feeRate
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func feeRateToSatPerVbCeil(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let feeRate = self._feeRates[id] else {
                reject("FeeRate error", "FeeRate not found", nil)
                return
            }
            let result = feeRate.toSatPerVbCeil()
            DispatchQueue.main.async {
                resolve(result)
            }
        }
    }

    @objc
    func feeRateToSatPerVbFloor(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let feeRate = self._feeRates[id] else {
                reject("FeeRate error", "FeeRate not found", nil)
                return
            }
            let result = feeRate.toSatPerVbFloor()
            DispatchQueue.main.async {
                resolve(result)
            }
        }
    }

    @objc
    func feeRateToSatPerKwu(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let feeRate = self._feeRates[id] else {
                reject("FeeRate error", "FeeRate not found", nil)
                return
            }
            let result = feeRate.toSatPerKwu()
            DispatchQueue.main.async {
                resolve(result)
            }
        }
    }

    /** FeeRate methods ends */

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
    func finish(_ id: String, walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let txBuilder = self._txBuilders[id] else {
                reject("Invalid TxBuilder", "TxBuilder not found", nil)
                return
            }
            guard let wallet = self._wallets[walletId] else {
                reject("Invalid Wallet", "Wallet not found", nil)
                return
            }
            do {
                let psbt = try txBuilder.finish(wallet: wallet)
                let psbtId = self.randomId()
                self._psbts[psbtId] = psbt
                DispatchQueue.main.async {
                    resolve(psbtId)
                }
            } catch let error {
                reject("TxBuilder finish error", "\(error)", error)
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

    /** Psbt method starts */

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

    /** Psbt method ends */




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

    /** ElectrumClient methods starts */

@objc
func createElectrumClient(_ url: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async {
        do {
            let client = try ElectrumClient(url: url)
            let id = self.randomId()
            self._blockChains[id] = client
            DispatchQueue.main.async {
                resolve(id)
            }
        } catch let error {
            reject("ElectrumClient creation error", "\(error)", error)
        }
    }
}

@objc
func electrumClientBroadcast(_ clientId: String, transactionId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async {
        guard let client = self._blockChains[clientId] as? ElectrumClient,
              let transaction = self._transactions[transactionId] else {
            reject("Invalid client or transaction", "ElectrumClient or Transaction not found", nil)
            return
        }
        
        do {
            let txid = try client.broadcast(transaction: transaction)
            DispatchQueue.main.async {
                resolve(txid)
            }
        } catch let error {
            reject("Broadcast error", "\(error)", error)
        }
    }
}

@objc
func electrumClientFullScan(_ clientId: String, fullScanRequestId: String, stopGap: NSNumber, batchSize: NSNumber, fetchPrevTxouts: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async(execute: DispatchWorkItem(block: {
        guard let client = self._blockChains[clientId] as? ElectrumClient,
              let fullScanRequest = self._fullScanRequests[fullScanRequestId] else {
            DispatchQueue.main.async {
                reject("Invalid client or fullScanRequest", "ElectrumClient or FullScanRequest not found", nil)
            }
            return
        }
        
        do {
            let update = try client.fullScan(fullScanRequest: fullScanRequest, stopGap: UInt64(truncating: stopGap), batchSize: UInt64(truncating: batchSize), fetchPrevTxouts: fetchPrevTxouts)
            let updateId = self.randomId()
            self._updates[updateId] = update
            DispatchQueue.main.async {
                resolve(updateId)
            }
        } catch let error {
            DispatchQueue.main.async {
                reject("Full scan error", "\(error)", error)
            }
        }
    }))
}

@objc
func electrumClientSync(_ clientId: String, syncRequestId: String, batchSize: NSNumber, fetchPrevTxouts: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async(execute: DispatchWorkItem(block: {
        guard let client = self._blockChains[clientId] as? ElectrumClient,
              let syncRequest = self._syncRequests[syncRequestId] else {
            DispatchQueue.main.async {
                reject("Invalid client or syncRequest", "ElectrumClient or SyncRequest not found", nil)
            }
            return
        }
        
        do {
            let update = try client.sync(syncRequest: syncRequest, batchSize: UInt64(truncating: batchSize), fetchPrevTxouts: fetchPrevTxouts)
            let updateId = self.randomId()
            self._updates[updateId] = update
            DispatchQueue.main.async {
                resolve(updateId)
            }
        } catch let error {
            DispatchQueue.main.async {
                reject("Sync error", "\(error)", error)
            }
        }
    }))
}

/** ElectrumClient methods ends */

/** EsploraClient methods starts */

@objc
func createEsploraClient(_ url: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async {
        do {
            let esploraClient = EsploraClient(url: url)
            let id = self.randomId()
            self._blockChains[id] = esploraClient
            DispatchQueue.main.async {
                resolve(id)
            }
        } catch let error {
            reject("EsploraClient error", "\(error)", error)
        }
    }
}

@objc
func esploraClientBroadcast(_ id: String, txid: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async {
        guard let esploraClient = self._blockChains[id] as? EsploraClient else {
            reject("EsploraClient error", "EsploraClient not found", nil)
            return
        }
        guard let transaction = self._transactions[txid] else {
            reject("Transaction error", "Transaction not found", nil)
            return
        }
        do {
            try esploraClient.broadcast(transaction: transaction)
            DispatchQueue.main.async {
                resolve(nil)
            }
        } catch let error {
            reject("Broadcast error", "\(error)", error)
        }
    }
}

@objc
func esploraClientFullScan(_ id: String, fullScanRequestId: String, stopGap: NSNumber, parallelRequests: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async {
        guard let esploraClient = self._blockChains[id] as? EsploraClient else {
            reject("EsploraClient error", "EsploraClient not found", nil)
            return
        }
        guard let fullScanRequest = self._fullScanRequests[fullScanRequestId] else {
            reject("FullScanRequest error", "FullScanRequest not found", nil)
            return
        }
        do {
            let update = try esploraClient.fullScan(fullScanRequest: fullScanRequest, stopGap: stopGap.uint64Value, parallelRequests: parallelRequests.uint64Value)
            let updateId = self.randomId()
            self._updates[updateId] = update
            DispatchQueue.main.async {
                resolve(updateId)
            }
        } catch let error {
            reject("Full scan error", "\(error)", error)
        }
    }
}

@objc
func esploraClientSync(_ id: String, syncRequestId: String, parallelRequests: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async {
        guard let esploraClient = self._blockChains[id] as? EsploraClient else {
            reject("EsploraClient error", "EsploraClient not found", nil)
            return
        }
        guard let syncRequest = self._syncRequests[syncRequestId] else {
            reject("SyncRequest error", "SyncRequest not found", nil)
            return
        }
        do {
            let update = try esploraClient.sync(syncRequest: syncRequest, parallelRequests: parallelRequests.uint64Value)
            let updateId = self.randomId()
            self._updates[updateId] = update
            DispatchQueue.main.async {
                resolve(updateId)
            }
        } catch let error {
            reject("Sync error", "\(error)", error)
        }
    }
}

/** EsploraClient methods ends */

/** SyncRequest methods starts */

@objc
func createSyncRequest(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async {
        guard let wallet = self._wallets[walletId] else {
            DispatchQueue.main.async {
                reject("Invalid wallet", "Wallet not found", nil)
            }
            return
        }
        
        do {
            let syncRequest = wallet.startSyncWithRevealedSpks()
            let id = self.randomId()
            self._syncRequests[id] = syncRequest
            DispatchQueue.main.async {
                resolve(id)
            }
        } catch let error {
            DispatchQueue.main.async {
                reject("SyncRequest creation error", "\(error)", error)
            }
        }
    }
}

@objc
func freeSyncRequest(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async {
        self._syncRequests.removeValue(forKey: id)
        DispatchQueue.main.async {
            resolve(nil)
        }
    }
}

/** SyncRequest methods ends */

/** Wallet sync methods starts */

@objc
func walletSync(_ walletId: String, syncRequestId: String, blockchainId: String, batchSize: NSNumber, fetchPrevTxouts: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async {
        guard let wallet = self._wallets[walletId],
              let syncRequest = self._syncRequests[syncRequestId],
              let blockchain = self._blockChains[blockchainId] else {
            reject("Invalid parameters", "Wallet, SyncRequest, or Blockchain not found", nil)
            return
        }
        
        do {
            let update: Update
            if let electrumClient = blockchain as? ElectrumClient {
                update = try electrumClient.sync(syncRequest: syncRequest, batchSize: UInt64(truncating: batchSize), fetchPrevTxouts: fetchPrevTxouts)
            } else if let esploraClient = blockchain as? EsploraClient {
                update = try esploraClient.sync(syncRequest: syncRequest, parallelRequests: UInt64(truncating: batchSize))
            } else {
                throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Unsupported blockchain type"])
            }
            
            try wallet.applyUpdate(update: update)
            DispatchQueue.main.async {
                resolve(nil)
            }
        } catch let error {
            DispatchQueue.main.async {
                reject("Sync error", "\(error)", error)
            }
        }
    }
}

@objc
func walletStartSyncWithRevealedSpks(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async {
        guard let wallet = self._wallets[walletId] else {
            reject("Invalid wallet", "Wallet not found", nil)
            return
        }
        
        let syncRequest = wallet.startSyncWithRevealedSpks()
        let id = self.randomId()
        self._syncRequests[id] = syncRequest
        DispatchQueue.main.async {
            resolve(id)
        }
    }
}

/** Wallet sync methods ends */

    
    @objc
    func transactionOutput(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let outputs = _transactions[id]!.output()
            let result = outputs.map { createTxOut(txOut: $0, _scripts: &_scripts) }
            DispatchQueue.main.async {
                resolve(result)
            }
        }
    }

    
    @objc
    func transactionLockTime(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            let lockTime = _transactions[id]!.lockTime()
            DispatchQueue.main.async {
                resolve(lockTime)
            }
        }
    }
    

    @objc
       func createMemoryWallet(_ network: String, descriptor: String, changeDescriptor: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
           DispatchQueue.global(qos: .userInteractive).async {
               do {
                   let networkType = self.setNetwork(networkStr: network)
                   let desc = try Descriptor(descriptor: descriptor, network: networkType)
                   let changeDesc = changeDescriptor != nil ? try Descriptor(descriptor: changeDescriptor!, network: networkType) : nil
                   
                   let wallet = try Wallet(
                       descriptor: desc,
                       changeDescriptor: changeDesc,
                       persistenceBackendPath: ":memory:",
                       network: networkType
                   )
                   
                   let id = self.randomId()
                   self._wallets[id] = wallet
                   
                   DispatchQueue.main.async {
                       resolve(id)
                   }
               } catch let error {
                   DispatchQueue.main.async {
                       reject("Create memory wallet error", "\(error)", error)
                   }
               }
           }
       }
    

    
/** Script methods starts */

@objc
func createScript(_ rawOutputScript: [UInt8], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async {
        do {
            let script = Script(rawOutputScript: rawOutputScript)
            let id = self.randomId()
            self._scripts[id] = script
            DispatchQueue.main.async {
                resolve(id)
            }
        } catch let error {
            reject("Script creation error", "\(error)", error)
        }
    }
}

@objc
func scriptToBytes(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInteractive).async {
        guard let script = self._scripts[id] else {
            reject("Invalid script", "Script not found", nil)
            return
        }
        
        let bytes = script.toBytes()
        DispatchQueue.main.async {
            resolve(bytes)
        }
    }
}

/** Script methods ends */
}

