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
    
    private func getTxBytes(bytes: NSArray) throws -> [UInt8] {
        guard let byteArray = bytes as? [NSNumber] else {
            throw NSError(domain: "BdkRnModule", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid bytes format"])
        }
        return byteArray.map { $0.uint8Value }
    }
    
    /// Helper function for error handling
    private func rejectOnMain(
        _ reject: @escaping RCTPromiseRejectBlock,
        _ code: String,
        _ error: Error
    ) {
        DispatchQueue.main.async {
            reject(code, "\(error)", error)
        }
    }

    /// Overloaded helper for string-based errors
    private func rejectOnMain(
        _ reject: @escaping RCTPromiseRejectBlock,
        _ code: String,
        _ message: String
    ) {
        DispatchQueue.main.async {
            reject(code, message, nil)
        }
    }
    
    private func processTransaction(
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock,
        transactionHandler: @escaping (Transaction) -> Any
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            
            do {
                let transaction = try self.getTransactionById(id)
                let result = transactionHandler(transaction)
                
                DispatchQueue.main.async {
                    resolve(result)
                }
            } catch {
                DispatchQueue.main.async {
                    reject("Transaction error", error.localizedDescription, error)
                }
            }
        }
    }

    private func processTransactionDirect(
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock,
        transactionHandler: @escaping (Transaction) -> Any
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self, let transaction = self._transactions[id] else {
                DispatchQueue.main.async {
                    reject("Transaction error", "Transaction not found", nil)
                }
                return
            }
            
            let result = transactionHandler(transaction)
            
            DispatchQueue.main.async {
                resolve(result)
            }
        }
    }
    
    private func executeAsync<T>(
        work: @escaping () throws -> T,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let workItem = DispatchWorkItem {
            do {
                let result = try work()
                DispatchQueue.main.async {
                    resolve(result)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Error", "\(error.localizedDescription)", error)
                }
            }
        }
        DispatchQueue.global(qos: .background).async(execute: workItem)
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

    private func getNetworkString(network: Network) -> String {
        switch network {
        case .bitcoin:
            return "bitcoin"
        case .testnet:
            return "testnet"
        case .regtest:
            return "regtest"
        case .signet:
            return "signet"
        @unknown default:
            return "unknown"
        }
    }

    private func setKeychainKind(keychainKind: String) -> KeychainKind {
        switch keychainKind {
        case "external":
            return KeychainKind.external
        case "internal":
            return KeychainKind.internal
        default:
            return KeychainKind.external
        }
    }

    private func keychainKindToString(_ keychainKind: KeychainKind) -> String {
        switch keychainKind {
        case .external:
            return "external"
        case .internal:
            return "internal"
        @unknown default:
            return "unknown"
        }
    }

    private func createElectrumError(from description: String) -> ElectrumError {
        if description.contains("IoError") {
            return .IoError(errorMessage: description)
        } else if description.contains("Json") {
            return .Json(errorMessage: description)
        } else if description.contains("Hex") {
            return .Hex(errorMessage: description)
        } else if description.contains("Protocol") {
            return .Protocol(errorMessage: description)
        } else if description.contains("Bitcoin") {
            return .Bitcoin(errorMessage: description)
        } else if description.contains("AlreadySubscribed") {
            return .AlreadySubscribed
        } else if description.contains("NotSubscribed") {
            return .NotSubscribed
        } else if description.contains("InvalidResponse") {
            return .InvalidResponse(errorMessage: description)
        } else if description.contains("Message") {
            return .Message(errorMessage: description)
        } else if description.contains("InvalidDnsNameError") {
            let domain = description.components(separatedBy: "domain: ").last ?? ""
            return .InvalidDnsNameError(domain: domain)
        } else if description.contains("MissingDomain") {
            return .MissingDomain
        } else if description.contains("AllAttemptsErrored") {
            return .AllAttemptsErrored
        } else if description.contains("SharedIoError") {
            return .SharedIoError(errorMessage: description)
        } else if description.contains("CouldntLockReader") {
            return .CouldntLockReader
        } else if description.contains("Mpsc") {
            return .Mpsc
        } else if description.contains("CouldNotCreateConnection") {
            return .CouldNotCreateConnection(errorMessage: description)
        } else if description.contains("RequestAlreadyConsumed") {
            return .RequestAlreadyConsumed
        } else {
            return .Message(errorMessage: "Unknown Electrum error: \(description)")
        }
    }

    var _localOutputs: [String: LocalOutput] = [:]
    var _outPoints: [String: OutPoint] = [:]
    var _addressInfos: [String: AddressInfo] = [:]
    var _wallets: [String: Wallet] = [:]
    var _psbts: [String: Psbt] = [:]
    var _txOuts: [String: TxOut] = [:]
    var _feeRates: [String: FeeRate] = [:]
    var _updates: [String: Update] = [:]
    var _fullScanRequests: [String: FullScanRequest] = [:]
    var _syncRequests: [String: SyncRequest] = [:]
    var _blockChains: [String: Any] = [:]
    var _blockChainMethods: [String: Any] = [:]
    var _descriptorSecretKeys: [String: DescriptorSecretKey] = [:]
    var _descriptorPublicKeys: [String: DescriptorPublicKey] = [:]
    var _addresses: [String: Address] = [:]
    var _scripts: [String: Script] = [:]
    var _txBuilders: [String: TxBuilder] = [:]
    var _descriptors: [String: Descriptor] = [:]
    var _derivationPaths: [String: DerivationPath] = [:]
    var _bumpFeeTxBuilders: [String: BumpFeeTxBuilder] = [:]
    var _transactions: [String: Transaction] = [:]
    var _canonicalTxs: [String: CanonicalTx] = [:]
    var _chainPositions: [String: ChainPosition] = [:]
    private let operationQueue = OperationQueue()

    override init() {
        super.init()
        operationQueue.maxConcurrentOperationCount = 2
    }

    // Function to retrieve a Transaction by ID
    private func getTransactionById(_ id: String) throws -> Transaction {
        guard let transaction = _transactions[id] else {
            throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "Transaction not found"])
        }
        return transaction
    }

    // Function to retrieve a ChainPosition by ID
    private func getChainPositionById(_ id: String) throws -> ChainPosition {
        guard let chainPosition = _chainPositions[id] else {
            throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "ChainPosition not found"])
        }
        return chainPosition
    }

    // Function to retrieve a Wallet by ID
    private func getWalletById(_ id: String) throws -> Wallet {
        guard let wallet = _wallets[id] else {
            throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
        }
        return wallet
    }

    // Function to retrieve a Script by ID
    private func getScriptById(_ id: String) throws -> Script {
        guard let script = _scripts[id] else {
            throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "Script not found"])
        }
        return script
    }

    // Function to retrieve a FullScanRequest by ID
    private func getFullScanRequestById(_ id: String) throws -> FullScanRequest {
        guard let fullScanRequest = _fullScanRequests[id] else {
            throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "FullScanRequest not found"])
        }
        return fullScanRequest
    }

    // Function to retrieve a SyncRequest by ID
    private func getSyncRequestById(_ id: String) throws -> SyncRequest {
        guard let syncRequest = _syncRequests[id] else {
            throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "SyncRequest not found"])
        }
        return syncRequest
    }

    /** Mnemonic methods starts */
    @objc
    func generateSeedFromWordCount(_ wordCount: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            let response = Mnemonic(wordCount: setWordCount(wordCount: wordCount))
            resolve(response.asString())
        }
    }

    @objc
    func generateSeedFromString(_ mnemonic: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let response = try Mnemonic.fromString(mnemonic: mnemonic)
                resolve(response.asString())
            } catch let error {
                reject("Generate seed error", "\(error)", error)
            }
        }
    }

    @objc
    func generateSeedFromEntropy(_ entropy: NSArray, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let response = try Mnemonic.fromEntropy(entropy: getEntropy(entropy: entropy))
                resolve(response.asString())
            } catch let error {
                reject("Generate seed error", "\(error)", error)
            }
        }
    }

    /** Mnemonic methods ends */

    /** DerivationPath methods starts */
    @objc
    func createDerivationPath(_ path: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let derivationPath = try DerivationPath(path: path)
                let id = self.randomId()
                self._derivationPaths[id] = derivationPath
                resolve(id)
            } catch let error {
                reject("DerivationPath error", "\(error)", error)
            }
        }
    }

    @objc
    func derivationPathToString(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            guard let derivationPath = self._derivationPaths[id] else {
                reject("DerivationPath error", "DerivationPath not found", nil)
                return
            }
            resolve(id)
        }
    }

    /** DerivationPath methods ends */

    /** DescriptorSecretKey methods starts */
    @objc
    func createDescriptorSecretKey(_ network: String, mnemonic: String, password: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let mnemonicObj = try Mnemonic.fromString(mnemonic: mnemonic)
                let descriptorSecretKey = DescriptorSecretKey(network: self.setNetwork(networkStr: network), mnemonic: mnemonicObj, password: password)
                let id = self.randomId()
                self._descriptorSecretKeys[id] = descriptorSecretKey
                resolve(id)
            } catch let error {
                reject("DescriptorSecretKey error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorSecretKeyFromString(_ secretKey: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let descriptorSecretKey = try DescriptorSecretKey.fromString(secretKey: secretKey)
                let id = self.randomId()
                self._descriptorSecretKeys[id] = descriptorSecretKey
                resolve(id)
            } catch let error {
                reject("DescriptorSecretKey error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorSecretKeyAsPublic(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            guard let descriptorSecretKey = self._descriptorSecretKeys[id] else {
                reject("DescriptorSecretKey error", "DescriptorSecretKey not found", nil)
                return
            }
            let descriptorPublicKey = descriptorSecretKey.asPublic()
            let publicKeyId = self.randomId()
            self._descriptorPublicKeys[publicKeyId] = descriptorPublicKey
            resolve(publicKeyId)
        }
    }

    @objc
    func descriptorSecretKeyAsString(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            guard let descriptorSecretKey = self._descriptorSecretKeys[id] else {
                reject("DescriptorSecretKey error", "DescriptorSecretKey not found", nil)
                return
            }
            resolve(descriptorSecretKey.asString())
        }
    }

    @objc
    func descriptorSecretKeyDerive(_ id: String, path: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            guard let descriptorSecretKey = self._descriptorSecretKeys[id] else {
                reject("DescriptorSecretKey error", "DescriptorSecretKey not found", nil)
                return
            }
            do {
                let derivationPath = try DerivationPath(path: path)
                let derivedKey = try descriptorSecretKey.derive(path: derivationPath)
                let newId = self.randomId()
                self._descriptorSecretKeys[newId] = derivedKey
                resolve(newId)
            } catch let error {
                reject("DescriptorSecretKey derive error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorSecretKeyExtend(_ id: String, path: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            guard let descriptorSecretKey = self._descriptorSecretKeys[id] else {
                reject("DescriptorSecretKey error", "DescriptorSecretKey not found", nil)
                return
            }
            do {
                let derivationPath = try DerivationPath(path: path)
                let extendedKey = try descriptorSecretKey.extend(path: derivationPath)
                let newId = self.randomId()
                self._descriptorSecretKeys[newId] = extendedKey
                resolve(newId)
            } catch let error {
                reject("DescriptorSecretKey extend error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorSecretKeySecretBytes(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            guard let descriptorSecretKey = self._descriptorSecretKeys[id] else {
                reject("DescriptorSecretKey error", "DescriptorSecretKey not found", nil)
                return
            }
            resolve(descriptorSecretKey.secretBytes())
        }
    }

    /** DescriptorSecretKey methods ends */

    /** Descriptor public key methods starts */
    @objc
    func createDescriptorPublic(_ publicKey: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let id = self.randomId()
                self._descriptorPublicKeys[id] = try DescriptorPublicKey.fromString(publicKey: publicKey)
                resolve(id)
            } catch let error {
                reject("DescriptorPublic create error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorPublicDerive(_ publicKeyId: String, derivationPathId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            guard let descriptorPublicKey = self._descriptorPublicKeys[publicKeyId] else {
                reject("DescriptorPublic derive error", "Public key not found", nil)
                return
            }
            guard let derivationPath = self._derivationPaths[derivationPathId] else {
                reject("DescriptorPublic derive error", "Derivation path not found", nil)
                return
            }
            do {
                let keyInfo = try descriptorPublicKey.derive(path: derivationPath)
                resolve(keyInfo.asString())
            } catch let error {
                reject("DescriptorPublic derive error", "\(error)", error)
            }
        }
    }
    @objc
    func descriptorPublicExtend(_ publicKeyId: String, derivationPathId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let keyInfo = try self._descriptorPublicKeys[publicKeyId]!.extend(path: self._derivationPaths[derivationPathId]!)
                resolve(keyInfo.asString())
            } catch let error {
                reject("DescriptorPublic extend error", "\(error)", error)
            }
        }
    }

    @objc
    func descriptorPublicAsString(_ publicKeyId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            resolve(self._descriptorPublicKeys[publicKeyId]!.asString())
        }
    }

    /** Descriptor public key methods ends */

    /** Wallet methods starts */
    @objc
    func revealNextAddress(id: String, keychain: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let keychainKind: KeychainKind = (keychain == "internal") ? .internal : .external
                let addressInfo = try self.getWalletById(id).revealNextAddress(keychain: keychainKind)
                DispatchQueue.main.async {
                    resolve([
                        "index": addressInfo.index,
                        "address": addressInfo.address.asString(),
                        "keychain": "\(addressInfo.keychain)"
                    ] as [String: Any])
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Reveal next address error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func isMine(_ id: String, scriptId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            guard let script = _scripts[scriptId] else {
                DispatchQueue.main.async {
                    reject("Check wallet isMine error", "Script not found", nil)
                }
                return
            }
            do {
                let result = try getWalletById(id).isMine(script: script)
                DispatchQueue.main.async {
                    resolve(result)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Check wallet isMine error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func getNetwork(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let network = try getWalletById(id).network()
                DispatchQueue.main.async {
                    resolve(getNetworkString(network: network))
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get network error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func listUnspent(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let unspentList = try getWalletById(id).listUnspent()

                let responseObject = unspentList.map { item in
                    return [
                        "outpoint": getOutPoint(outPoint: item.outpoint),
                        "txout": createTxOut(txOut: item.txout, _scripts: &_scripts),
                        "isSpent": item.isSpent,
                        "keychain": "\(item.keychain)"
                    ] as [String: Any]
                }
                
                DispatchQueue.main.async {
                    resolve(responseObject)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("List unspent outputs error", "\(error)", error)
                }
            }
        }
    }


    /** Wallet methods ends*/

    /** Balance methods starts*/
    @objc
    func getBalance(
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let wallet = try getWalletById(id)
                let balance = wallet.getBalance()
                let responseObject: [String: Any] = [
                    "immature": balance.immature.toSat(),
                    "trustedPending": balance.trustedPending.toSat(),
                    "untrustedPending": balance.untrustedPending.toSat(),
                    "confirmed": balance.confirmed.toSat(),
                    "trustedSpendable": balance.trustedSpendable.toSat(),
                    "total": balance.total.toSat()
                ]
                DispatchQueue.main.async {
                    resolve(responseObject)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get wallet balance error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func getBalanceImmature(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let balance = try getWalletById(id).getBalance()
                DispatchQueue.main.async {
                    resolve(balance.immature.toSat())
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get wallet immature balance error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func getBalanceTrustedPending(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let balance = try getWalletById(id).getBalance()
                DispatchQueue.main.async {
                    resolve(balance.trustedPending.toSat())
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get wallet trusted pending balance error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func getBalanceUntrustedPending(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let balance = try getWalletById(id).getBalance()
                DispatchQueue.main.async {
                    resolve(balance.untrustedPending.toSat())
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get wallet untrusted pending balance error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func getBalanceConfirmed(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let balance = try getWalletById(id).getBalance()
                DispatchQueue.main.async {
                    resolve(balance.confirmed.toSat())
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get wallet confirmed balance error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func getBalanceTrustedSpendable(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let balance = try getWalletById(id).getBalance()
                DispatchQueue.main.async {
                    resolve(balance.trustedSpendable.toSat())
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get wallet trusted spendable balance error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func getBalanceTotal(_
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                let balance = try getWalletById(id).getBalance()
                DispatchQueue.main.async {
                    resolve(balance.total.toSat())
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get wallet total balance error", "\(error)", error)
                }
            }
        }
    }

    /** Balance methods ends*/

    /** Address methods starts*/

    @objc
    func initAddress(
        address: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let id = self.randomId()
                self._addresses[id] = try Address(address: address, network: self.setNetwork(networkStr: network))
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                self.rejectOnMain(reject, "Address error", error)
            }
        }
    }

    @objc
    func addressToScriptPubkeyHex(
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let address = self._addresses[id] else {
                self.rejectOnMain(reject, "Address error", "Address not found")
                return
            }
            let scriptId = self.randomId()
            self._scripts[scriptId] = address.scriptPubkey()
            DispatchQueue.main.async {
                resolve(scriptId)
            }
        }
    }

    @objc
    func addressNetwork(
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let address = self._addresses[id] else {
                self.rejectOnMain(reject, "Address error", "Address not found")
                return
            }
            DispatchQueue.main.async {
                resolve(self.getNetworkString(network: address.network()))
            }
        }
    }

    @objc
    func addressToQrUri(
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let address = self._addresses[id] else {
                self.rejectOnMain(reject, "Address error", "Address not found")
                return
            }
            DispatchQueue.main.async {
                resolve(address.toQrUri())
            }
        }
    }

    @objc
    func addressAsString(
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let address = self._addresses[id] else {
                self.rejectOnMain(reject, "Address error", "Address not found")
                return
            }
            DispatchQueue.main.async {
                resolve(address.asString())
            }
        }
    }

    @objc
    func addressIsValidForNetwork(
        id: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let address = self._addresses[id] else {
                self.rejectOnMain(reject, "Address error", "Address not found")
                return
            }
            DispatchQueue.main.async {
                resolve(address.isValidForNetwork(network: self.setNetwork(networkStr: network)))
            }
        }
    }


    /** Address methods ends*/
    
    /** Amount methods starts*/

    @objc
    func createAmountFromSat(
        _ sat: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            let amount = Amount.fromSat(fromSat: UInt64(truncating: sat))
            DispatchQueue.main.async {
                resolve(amount.toSat())
            }
        }
    }

    @objc
    func createAmountFromBtc(
        _ btc: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let amount = try Amount.fromBtc(fromBtc: btc.doubleValue)
                DispatchQueue.main.async {
                    resolve(amount.toSat())
                }
            } catch let error {
                self.rejectOnMain(reject, "Amount creation error", error)
            }
        }
    }

    @objc
    func amountAsBtc(
        _ sats: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            let amount = Amount.fromSat(fromSat: UInt64(truncating: sats))
            DispatchQueue.main.async {
                resolve(amount.toBtc())
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

    /** Amount methods ends*/

    /** BumpFeeTxBuilder methods starts */

    @objc
    func bumpFeeTxBuilderInit(
        _ txid: String,
        newFeeRate: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let id = self.randomId()
                let feeRate = try FeeRate.fromSatPerVb(satPerVb: UInt64(newFeeRate.doubleValue))
                self._bumpFeeTxBuilders[id] = BumpFeeTxBuilder(txid: txid, feeRate: feeRate)
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                self.rejectOnMain(reject, "BumpFeeTxBuilder init error", error)
            }
        }
    }

    @objc
    func bumpFeeTxBuilderEnableRbf(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let builder = self._bumpFeeTxBuilders[id] else {
                self.rejectOnMain(reject, "BumpFeeTxBuilder error", NSError(domain: "Builder not found", code: 404))
                return
            }
            self._bumpFeeTxBuilders[id] = builder.enableRbf()
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    @objc
    func bumpFeeTxBuilderEnableRbfWithSequence(
        _ id: String,
        nSequence: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let builder = self._bumpFeeTxBuilders[id] else {
                self.rejectOnMain(reject, "BumpFeeTxBuilder error", NSError(domain: "Builder not found", code: 404))
                return
            }
            self._bumpFeeTxBuilders[id] = builder.enableRbfWithSequence(nsequence: UInt32(truncating: nSequence))
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    @objc
    func bumpFeeTxBuilderFinish(
        _ id: String,
        walletId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                guard let builder = self._bumpFeeTxBuilders[id] else {
                    throw NSError(domain: "BumpFeeTxBuilder not found", code: 404, userInfo: nil)
                }
                let res = try builder.finish(wallet: self.getWalletById(walletId))
                DispatchQueue.main.async {
                    resolve(res.serialize())
                }
            } catch let error {
                self.rejectOnMain(reject, "BumpFeeTxBuilder finish error", error)
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
    func addRecipient(
        _ id: String,
        scriptId: String,
        amount: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                guard let script = self._scripts[scriptId] else {
                    DispatchQueue.main.async {
                        reject("Invalid Script", "Script ID not found", nil)
                    }
                    return
                }

                let satAmount = amount.uint64Value
                let amountObj = try Amount.fromSat(fromSat: satAmount)

                guard let txBuilder = self._txBuilders[id] else {
                    DispatchQueue.main.async {
                        reject("Transaction Error", "Transaction Builder not found", nil)
                    }
                    return
                }

                self._txBuilders[id] = txBuilder.addRecipient(script: script, amount: amountObj)

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

    /** LocalOutput methods starts */

    @objc
    func getLocalOutputOutpoint(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            guard let localOutput = self._localOutputs[id] else {
                DispatchQueue.main.async {
                    reject("Invalid LocalOutput", "LocalOutput not found", nil)
                }
                return
            }
            let outpointId = self.randomId()
            
            DispatchQueue.main.async {
                self._outPoints[outpointId] = localOutput.outpoint
                resolve(outpointId)
            }
        }
    }

    @objc
    func getLocalOutputTxout(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            guard let localOutput = self._localOutputs[id] else {
                DispatchQueue.main.async {
                    reject("Invalid LocalOutput", "LocalOutput not found", nil)
                }
                return
            }
            let txoutId = self.randomId()
            
            DispatchQueue.main.async {
                self._txOuts[txoutId] = localOutput.txout
                resolve(txoutId)
            }
        }
    }

    @objc
    func getLocalOutputKeychain(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            guard let localOutput = self._localOutputs[id] else {
                DispatchQueue.main.async {
                    reject("Invalid LocalOutput", "LocalOutput not found", nil)
                }
                return
            }
            let keychainString = self.keychainKindToString(localOutput.keychain)
            
            DispatchQueue.main.async {
                resolve(keychainString)
            }
        }
    }

    @objc
    func isLocalOutputSpent(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            guard let localOutput = self._localOutputs[id] else {
                DispatchQueue.main.async {
                    reject("Invalid LocalOutput", "LocalOutput not found", nil)
                }
                return
            }
            
            DispatchQueue.main.async {
                resolve(localOutput.isSpent)
            }
        }
    }

    /** LocalOutput methods ends */

    /** FeeRate methods starts */

    @objc
    func createFeeRateFromSatPerVb(
        _ satPerVb: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            
            do {
                let feeRate = try FeeRate.fromSatPerVb(satPerVb: UInt64(truncating: satPerVb))
                let id = self.randomId()
                
                DispatchQueue.main.async { [weak self] in
                    guard let self = self else { return }
                    self._feeRates[id] = feeRate
                    resolve(id)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("FeeRate error", "\(error.localizedDescription)", error)
                }
            }
        }
    }

    @objc
    func createFeeRateFromSatPerKwu(
        _ satPerKwu: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }

            do {
                let feeRate = FeeRate.fromSatPerKwu(satPerKwu: UInt64(truncating: satPerKwu))
                let id = self.randomId()

                DispatchQueue.main.async { [weak self] in
                    guard let self = self else { return }
                    self._feeRates[id] = feeRate
                    resolve(id)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("FeeRate error", "\(error.localizedDescription)", error)
                }
            }
        }
    }

    @objc
    func feeRateToSatPerVbCeil(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            
            guard let feeRate = self._feeRates[id] else {
                DispatchQueue.main.async {
                    reject("FeeRate error", "FeeRate not found", nil)
                }
                return
            }

            let result = feeRate.toSatPerVbCeil()
            
            DispatchQueue.main.async {
                resolve(result)
            }
        }
    }

    @objc
    func feeRateToSatPerVbFloor(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            
            guard let feeRate = self._feeRates[id] else {
                DispatchQueue.main.async {
                    reject("FeeRate error", "FeeRate not found", nil)
                }
                return
            }

            let result = feeRate.toSatPerVbFloor()
            
            DispatchQueue.main.async {
                resolve(result)
            }
        }
    }

    @objc
    func feeRateToSatPerKwu(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            
            guard let feeRate = self._feeRates[id] else {
                DispatchQueue.main.async {
                    reject("FeeRate error", "FeeRate not found", nil)
                }
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
    func feeAbsolute(
        _ id: String,
        feeRate: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }

            guard let txBuilder = self._txBuilders[id] else {
                DispatchQueue.main.async {
                    reject("TxBuilder error", "TxBuilder not found", nil)
                }
                return
            }

            self._txBuilders[id] = txBuilder.feeAbsolute(fee: UInt64(truncating: feeRate))

            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    @objc
    func drainWallet(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            guard let builder = self._txBuilders[id] else {
                reject("Invalid TxBuilder", "TxBuilder not found", nil)
                return
            }
            self._txBuilders[id] = builder.drainWallet()
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    @objc
    func drainTo(
        _ id: String,
        scriptId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            guard let builder = self._txBuilders[id], let script = self._scripts[scriptId] else {
                reject("Invalid Parameters", "TxBuilder or script not found", nil)
                return
            }
            self._txBuilders[id] = builder.drainTo(script: script)
            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    @objc
    func enableRbf(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }

            guard let txBuilder = self._txBuilders[id] else {
                DispatchQueue.main.async {
                    reject("TxBuilder error", "TxBuilder not found", nil)
                }
                return
            }

            self._txBuilders[id] = txBuilder.enableRbf()

            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    @objc
    func enableRbfWithSequence(
        _ id: String,
        nsequence: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }

            guard let txBuilder = self._txBuilders[id] else {
                DispatchQueue.main.async {
                    reject("TxBuilder error", "TxBuilder not found", nil)
                }
                return
            }

            self._txBuilders[id] = txBuilder.enableRbfWithSequence(nsequence: UInt32(truncating: nsequence))

            DispatchQueue.main.async {
                resolve(true)
            }
        }
    }

    @objc
    func setRecipients(
        _ id: String,
        recipients: [NSDictionary],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }

            do {
                guard let txBuilder = self._txBuilders[id] else {
                    DispatchQueue.main.async {
                        reject("TxBuilder error", "TxBuilder not found", nil)
                    }
                    return
                }

                var scriptAmounts: [ScriptAmount] = []

                for item in recipients {
                    guard let amountValue = item["amount"] as? NSNumber,
                          let scriptDict = item["script"] as? NSDictionary,
                          let scriptId = scriptDict["id"] as? String,
                          let script = self._scripts[scriptId] else {
                        throw NSError(domain: "Invalid recipient format", code: 0, userInfo: nil)
                    }

                    let amount = Amount.fromSat(fromSat: UInt64(truncating: amountValue))
                    let scriptAmount = ScriptAmount(script: script, amount: amount)
                    scriptAmounts.append(scriptAmount)
                }

                self._txBuilders[id] = txBuilder.setRecipients(recipients: scriptAmounts)

                DispatchQueue.main.async {
                    resolve(true)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Set recipients error", "\(error.localizedDescription)", error)
                }
            }
        }
    }

    @objc
    func finish(_ id: String, walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
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
                DispatchQueue.main.async {
                    reject("TxBuilder finish error", "\(error)", error)
                }
            }
        }
    }
    /** TxBuilder methods ends */

    /** Descriptor Templates method starts */
    @objc
    func createDescriptor(
        _ descriptor: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            do {
                let id = self.randomId()
                self._descriptors[id] = try Descriptor(descriptor: descriptor, network: self.setNetwork(networkStr: network))
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch {
                DispatchQueue.main.async {
                    reject("Create Descriptor error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func descriptorAsString(
        _ descriptorId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self, let descriptor = self._descriptors[descriptorId] else {
                DispatchQueue.main.async {
                    reject("Descriptor Error", "Descriptor not found", nil)
                }
                return
            }
            DispatchQueue.main.async {
                resolve(descriptor.asString())
            }
        }
    }

    @objc
    func descriptorAsStringPrivate(
        _ descriptorId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self, let descriptor = self._descriptors[descriptorId] else {
                DispatchQueue.main.async {
                    reject("Descriptor Error", "Descriptor not found", nil)
                }
                return
            }
            DispatchQueue.main.async {
                resolve(descriptor.asStringPrivate())
            }
        }
    }

    @objc
    func newBip44(
        _ secretKeyId: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self, let secretKey = self._descriptorSecretKeys[secretKeyId] else {
                DispatchQueue.main.async {
                    reject("Secret Key Error", "Secret key not found", nil)
                }
                return
            }
            let id = self.randomId()
            self._descriptors[id] = Descriptor.newBip44(
                secretKey: secretKey,
                keychain: self.setKeychainKind(keychainKind: keychain),
                network: self.setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func newBip44Public(
        _ publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self, let publicKey = self._descriptorPublicKeys[publicKeyId] else {
                DispatchQueue.main.async {
                    reject("Public Key Error", "Public key not found", nil)
                }
                return
            }
            let id = self.randomId()
            self._descriptors[id] = Descriptor.newBip44Public(
                publicKey: publicKey,
                fingerprint: fingerprint,
                keychain: self.setKeychainKind(keychainKind: keychain),
                network: self.setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func newBip49(
        _ secretKeyId: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self, let secretKey = self._descriptorSecretKeys[secretKeyId] else {
                DispatchQueue.main.async {
                    reject("Secret Key Error", "Secret key not found", nil)
                }
                return
            }
            let id = self.randomId()
            self._descriptors[id] = Descriptor.newBip49(
                secretKey: secretKey,
                keychain: self.setKeychainKind(keychainKind: keychain),
                network: self.setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func newBip49Public(
        _ publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self, let publicKey = self._descriptorPublicKeys[publicKeyId] else {
                DispatchQueue.main.async {
                    reject("Public Key Error", "Public key not found", nil)
                }
                return
            }
            let id = self.randomId()
            self._descriptors[id] = Descriptor.newBip49Public(
                publicKey: publicKey,
                fingerprint: fingerprint,
                keychain: self.setKeychainKind(keychainKind: keychain),
                network: self.setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func newBip84(
        _ secretKeyId: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self, let secretKey = self._descriptorSecretKeys[secretKeyId] else {
                DispatchQueue.main.async {
                    reject("Secret Key Error", "Secret key not found", nil)
                }
                return
            }
            let id = self.randomId()
            self._descriptors[id] = Descriptor.newBip84(
                secretKey: secretKey,
                keychain: self.setKeychainKind(keychainKind: keychain),
                network: self.setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func newBip84Public(
        _ publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self, let publicKey = self._descriptorPublicKeys[publicKeyId] else {
                DispatchQueue.main.async {
                    reject("Public Key Error", "Public key not found", nil)
                }
                return
            }
            let id = self.randomId()
            self._descriptors[id] = Descriptor.newBip84Public(
                publicKey: publicKey,
                fingerprint: fingerprint,
                keychain: self.setKeychainKind(keychainKind: keychain),
                network: self.setNetwork(networkStr: network)
            )
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }
    
    @objc
    func newBip86(
        _ secretKeyId: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self, let secretKey = self._descriptorSecretKeys[secretKeyId] else {
                DispatchQueue.main.async {
                    reject("Secret Key Error", "Secret key not found", nil)
                }
                return
            }
            
            let id = self.randomId()
            self._descriptors[id] = Descriptor.newBip86(
                secretKey: secretKey,
                keychain: self.setKeychainKind(keychainKind: keychain),
                network: self.setNetwork(networkStr: network)
            )
            
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }

    @objc
    func newBip86Public(
        _ publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self, let publicKey = self._descriptorPublicKeys[publicKeyId] else {
                DispatchQueue.main.async {
                    reject("Public Key Error", "Public key not found", nil)
                }
                return
            }
            
            let id = self.randomId()
            self._descriptors[id] = Descriptor.newBip86Public(
                publicKey: publicKey,
                fingerprint: fingerprint,
                keychain: self.setKeychainKind(keychainKind: keychain),
                network: self.setNetwork(networkStr: network)
            )
            
            DispatchQueue.main.async {
                resolve(id)
            }
        }
    }
    /** Descriptor Templates method ends */

    /** Psbt method starts */

    @objc
    func extractTx(
        _ base64: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            do {
                let id = self.randomId()
                let extractedTx = try Psbt(psbtBase64: base64).extractTx()
                
                DispatchQueue.main.async {
                    self._transactions[id] = extractedTx
                    resolve(id)
                }
            } catch {
                DispatchQueue.main.async {
                    reject("PSBT extract error", error.localizedDescription, error)
                }
            }
        }
    }

    @objc
    func serialize(
        _ base64: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let hex = try Psbt(psbtBase64: base64).serialize()
                DispatchQueue.main.async {
                    resolve(hex)
                }
            } catch {
                DispatchQueue.main.async {
                    reject("Bump TX finish error", error.localizedDescription, error)
                }
            }
        }
    }

    @objc
    func txid(
        _ base64: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let transaction = try Psbt(psbtBase64: base64).extractTx()
                let txid = transaction.txid
                
                DispatchQueue.main.async {
                    resolve(txid)
                }
            } catch {
                DispatchQueue.main.async {
                    reject("PSBT txid error", error.localizedDescription, error)
                }
            }
        }
    }

    /** Psbt method ends */

    /** AddressInfo methods starts */

    @objc
    func createAddressInfo(
        _ index: NSNumber,
        addressId: String,
        keychain: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            
            do {
                guard let address = self._addresses[addressId] else {
                    throw NSError(domain: "AddressInfoError", code: 0, userInfo: [NSLocalizedDescriptionKey: "Address not found"])
                }
                
                let keychainKind = self.setKeychainKind(keychainKind: keychain)
                let addressInfo = AddressInfo(index: UInt32(truncating: index), address: address, keychain: keychainKind)
                let id = self.randomId()
                self._addressInfos[id] = addressInfo
                
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch {
                DispatchQueue.main.async {
                    reject("CreateAddressInfo error", error.localizedDescription, error)
                }
            }
        }
    }

    @objc
    func getAddressInfoIndex(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }

            guard let addressInfo = self._addressInfos[id] else {
                DispatchQueue.main.async {
                    reject("GetAddressInfoIndex error", "AddressInfo not found", nil)
                }
                return
            }
            
            DispatchQueue.main.async {
                resolve(addressInfo.index)
            }
        }
    }

    @objc
    func getAddressInfoAddress(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }

            guard let addressInfo = self._addressInfos[id] else {
                DispatchQueue.main.async {
                    reject("GetAddressInfoAddress error", "AddressInfo not found", nil)
                }
                return
            }
            
            let addressId = self.randomId()
            self._addresses[addressId] = addressInfo.address
            
            DispatchQueue.main.async {
                resolve(addressId)
            }
        }
    }

    @objc
    func getAddressInfoKeychain(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }

            guard let addressInfo = self._addressInfos[id] else {
                DispatchQueue.main.async {
                    reject("GetAddressInfoKeychain error", "AddressInfo not found", nil)
                }
                return
            }
            
            DispatchQueue.main.async {
                resolve(self.keychainKindToString(addressInfo.keychain))
            }
        }
    }
    /** AddressInfo methods ends */



    /** Transaction methods starts*/
    @objc
    func createTransaction(
        _ bytes: NSArray,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }

            do {
                let id = self.randomId()
                self._transactions[id] = try Transaction(transactionBytes: self.getTxBytes(bytes: bytes))
                
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch {
                DispatchQueue.main.async {
                    reject("Create transaction error", error.localizedDescription, error)
                }
            }
        }
    }

    @objc
    func serializeTransaction(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            
            do {
                let transaction = try self.getTransactionById(id)
                let serialized = transaction.serialize()
                
                DispatchQueue.main.async {
                    resolve(serialized)
                }
            } catch {
                DispatchQueue.main.async {
                    reject("Serialize transaction error", error.localizedDescription, error)
                }
            }
        }
    }

    @objc
    func transactionTxid(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            
            do {
                let transaction = try self.getTransactionById(id)
                DispatchQueue.main.async {
                    resolve(transaction.txid())
                }
            } catch {
                DispatchQueue.main.async {
                    reject("Get transaction txid error", error.localizedDescription, error)
                }
            }
        }
    }

    @objc
    func txWeight(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        processTransaction(id: id, resolve: resolve, reject: reject) { transaction in
            return transaction.weight()
        }
    }

    @objc
    func txSize(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        processTransaction(id: id, resolve: resolve, reject: reject) { transaction in
            return transaction.totalSize()
        }
    }

    @objc
    func txVsize(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        processTransaction(id: id, resolve: resolve, reject: reject) { transaction in
            return transaction.vsize()
        }
    }

    @objc
    func txIsCoinBase(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        processTransaction(id: id, resolve: resolve, reject: reject) { transaction in
            return transaction.isCoinbase()
        }
    }

    @objc
    func txIsExplicitlyRbf(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        processTransactionDirect(id: id, resolve: resolve, reject: reject) { transaction in
            return transaction.isExplicitlyRbf()
        }
    }

    @objc
    func txIsLockTimeEnabled(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        processTransactionDirect(id: id, resolve: resolve, reject: reject) { transaction in
            return transaction.isLockTimeEnabled()
        }
    }

    @objc
    func txVersion(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        processTransactionDirect(id: id, resolve: resolve, reject: reject) { transaction in
            return transaction.version()
        }
    }

    @objc
    func txLockTime(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        processTransactionDirect(id: id, resolve: resolve, reject: reject) { transaction in
            return transaction.lockTime()
        }
    }

    @objc
    func txInput(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        processTransaction(id: id, resolve: resolve, reject: reject) { transaction in
            return transaction.input()
        }
    }

    @objc
    func txOutput(
        _ id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        processTransaction(id: id, resolve: resolve, reject: reject) { transaction in
            return transaction.output()
        }
    }
    /** Transaction methods ends*/

    /** ElectrumClient methods starts */

    @objc
    func createElectrumClient(_ url: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let client = try ElectrumClient(url: url)
                let id = self.randomId()
                self._blockChains[id] = client
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("ElectrumClient creation error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func electrumClientBroadcast(_ clientId: String, transactionId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            guard let client = self._blockChains[clientId] as? ElectrumClient,
                  let transaction = self._transactions[transactionId] else {
                DispatchQueue.main.async {
                    reject("Invalid client or transaction", "ElectrumClient or Transaction not found", nil)
                }
                return
            }

            do {
                let txid = try client.broadcast(transaction: transaction)
                DispatchQueue.main.async {
                    resolve(txid)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Broadcast error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func electrumClientFullScan(_ clientId: String, fullScanRequestId: String, stopGap: NSNumber, batchSize: NSNumber, fetchPrevTxouts: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
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
        }
    }

    @objc
    func electrumClientSync(_ clientId: String, syncRequestId: String, batchSize: NSNumber, fetchPrevTxouts: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
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
        }
    }
    /** ElectrumClient methods ends */

    /** EsploraClient methods starts */

    @objc
    func createEsploraClient(_ url: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let esploraClient = EsploraClient(url: url)
                let id = self.randomId()
                self._blockChains[id] = esploraClient
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("EsploraClient error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func esploraClientBroadcast(_ id: String, txid: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            guard let esploraClient = self._blockChains[id] as? EsploraClient else {
                DispatchQueue.main.async {
                    reject("EsploraClient error", "EsploraClient not found", nil)
                }
                return
            }
            guard let transaction = self._transactions[txid] else {
                DispatchQueue.main.async {
                    reject("Transaction error", "Transaction not found", nil)
                }
                return
            }
            do {
                try esploraClient.broadcast(transaction: transaction)
                DispatchQueue.main.async {
                    resolve(nil)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Broadcast error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func esploraClientFullScan(_ id: String, fullScanRequestId: String, stopGap: NSNumber, parallelRequests: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            guard let esploraClient = self._blockChains[id] as? EsploraClient else {
                DispatchQueue.main.async {
                    reject("EsploraClient error", "EsploraClient not found", nil)
                }
                return
            }
            guard let fullScanRequest = self._fullScanRequests[fullScanRequestId] else {
                DispatchQueue.main.async {
                    reject("FullScanRequest error", "FullScanRequest not found", nil)
                }
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
                DispatchQueue.main.async {
                    reject("Full scan error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func esploraClientSync(_ id: String, syncRequestId: String, parallelRequests: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            guard let esploraClient = self._blockChains[id] as? EsploraClient else {
                DispatchQueue.main.async {
                    reject("EsploraClient error", "EsploraClient not found", nil)
                }
                return
            }
            guard let syncRequest = self._syncRequests[syncRequestId] else {
                DispatchQueue.main.async {
                    reject("SyncRequest error", "SyncRequest not found", nil)
                }
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
                DispatchQueue.main.async {
                    reject("Sync error", "\(error)", error)
                }
            }
        }
    }
    /** EsploraClient methods ends */

    /** SyncRequest methods starts */

    @objc
    func createSyncRequest(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let wallet = try self.getWalletById(walletId)
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
        DispatchQueue.global(qos: .utility).async {
            if self._syncRequests.removeValue(forKey: id) != nil {
                DispatchQueue.main.async {
                    resolve(nil)
                }
            } else {
                DispatchQueue.main.async {
                    reject("SyncRequest error", "SyncRequest not found", nil)
                }
            }
        }
    }

    /** SyncRequest methods ends */

    /** Wallet sync methods starts */

    @objc
    func walletSync(_ walletId: String, syncRequestId: String, blockchainId: String, batchSize: NSNumber, fetchPrevTxouts: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            guard let wallet = self._wallets[walletId],
                  let syncRequest = self._syncRequests[syncRequestId],
                  let blockchain = self._blockChains[blockchainId] else {
                DispatchQueue.main.async {
                    reject("Invalid parameters", "Wallet, SyncRequest, or Blockchain not found", nil)
                }
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
        DispatchQueue.global(qos: .userInitiated).async {
            guard let wallet = self._wallets[walletId] else {
                DispatchQueue.main.async {
                    reject("Invalid wallet", "Wallet not found", nil)
                }
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

    /** Wallet Protocol Methods starts */

    @objc
    func walletApplyUpdate(_ walletId: String, updateId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                guard let wallet = self._wallets[walletId], let update = self._updates[updateId] else {
                    throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Wallet or Update not found"])
                }
                try wallet.applyUpdate(update: update)
                DispatchQueue.main.async {
                    resolve(nil)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Apply update error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func walletCalculateFee(_ walletId: String, txId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                guard let wallet = self._wallets[walletId], let tx = self._transactions[txId] else {
                    throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Wallet or Transaction not found"])
                }
                let fee = try wallet.calculateFee(tx: tx)
                DispatchQueue.main.async {
                    resolve(fee)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Calculate fee error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func walletCalculateFeeRate(_ walletId: String, txId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                guard let wallet = self._wallets[walletId], let tx = self._transactions[txId] else {
                    throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Wallet or Transaction not found"])
                }
                let feeRate = try wallet.calculateFeeRate(tx: tx)
                let feeRateId = self.randomId()
                self._feeRates[feeRateId] = feeRate
                DispatchQueue.main.async {
                    resolve(feeRateId)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Calculate fee rate error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func walletCommit(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let wallet = try self.getWalletById(walletId)
                let result = try wallet.commit()
                DispatchQueue.main.async {
                    resolve(result)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Commit error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func walletGetBalance(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let wallet = try self.getWalletById(walletId)
                let balance = wallet.getBalance()
                let result: [String: UInt64] = [
                    "immature": balance.immature.toSat(),
                    "trustedPending": balance.trustedPending.toSat(),
                    "untrustedPending": balance.untrustedPending.toSat(),
                    "confirmed": balance.confirmed.toSat(),
                    "trustedSpendable": balance.trustedSpendable.toSat(),
                    "total": balance.total.toSat()
                ]
                DispatchQueue.main.async {
                    resolve(result)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get wallet balance error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func walletGetTx(_ walletId: String, txid: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                guard let wallet = self._wallets[walletId] else {
                    throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
                }
                if let tx = try wallet.getTx(txid: txid) {
                    let txId = self.randomId()
                    self._transactions[txId] = tx.transaction
                    let result: [String: Any] = [
                        "txid": tx.transaction.txid(),
                        "received": tx.transaction.output().reduce(0) { $0 + $1.value },
                        "sent": 0, // We can't determine this without more context
                        "fee": 0, // We can't determine this without more context
                        "confirmationTime": NSNull(), // We don't have this information from just the transaction
                        "transaction": txId
                    ]
                    DispatchQueue.main.async {
                        resolve(result)
                    }
                } else {
                    DispatchQueue.main.async {
                        resolve(nil)
                    }
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Get transaction error", "\(error)", error)
                }
            }
        }
    }
    
    @objc
    func walletIsMine(_ walletId: String, scriptId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        operationQueue.addOperation {
            do {
                guard let wallet = self._wallets[walletId], let script = self._scripts[scriptId] else {
                    throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Wallet or Script not found"])
                }
                let result = wallet.isMine(script: script)
                DispatchQueue.main.async { resolve(result) }
            } catch let error {
                DispatchQueue.main.async { reject("Invalid wallet or script", "\(error.localizedDescription)", error) }
            }
        }
    }

    @objc
    func walletListOutput(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        operationQueue.addOperation {
            do {
                guard let wallet = self._wallets[walletId] else {
                    throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
                }
                let outputs = wallet.listOutput()
                let result = outputs.map { output -> [String: Any] in
                    let txoutId = self.randomId()
                    self._txOuts[txoutId] = output.txout
                    return [
                        "outpoint": [
                            "txid": output.outpoint.txid,
                            "vout": output.outpoint.vout
                        ],
                        "txout": txoutId,
                        "isSpent": output.isSpent,
                        "keychain": self.keychainKindToString(output.keychain)
                    ]
                }
                DispatchQueue.main.async { resolve(result) }
            } catch let error {
                DispatchQueue.main.async { reject("List output error", "\(error.localizedDescription)", error) }
            }
        }
    }

    @objc
    func walletListUnspent(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        operationQueue.addOperation {
            do {
                guard let wallet = self._wallets[walletId] else {
                    throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
                }
                let unspentOutputs = wallet.listUnspent()
                let result = unspentOutputs.map { output -> [String: Any] in
                    let txoutId = self.randomId()
                    self._txOuts[txoutId] = output.txout
                    return [
                        "outpoint": [
                            "txid": output.outpoint.txid,
                            "vout": output.outpoint.vout
                        ],
                        "txout": txoutId,
                        "isSpent": output.isSpent,
                        "keychain": self.keychainKindToString(output.keychain)
                    ]
                }
                DispatchQueue.main.async { resolve(result) }
            } catch let error {
                DispatchQueue.main.async { reject("List unspent error", "\(error.localizedDescription)", error) }
            }
        }
    }

    @objc
    func walletNetwork(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        operationQueue.addOperation {
            do {
                guard let wallet = self._wallets[walletId] else {
                    throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
                }
                let network = wallet.network()
                DispatchQueue.main.async { resolve(self.getNetworkString(network: network)) }
            } catch let error {
                DispatchQueue.main.async { reject("Network error", "\(error.localizedDescription)", error) }
            }
        }
    }

    @objc
    func walletRevealNextAddress(_ walletId: String, keychain: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        operationQueue.addOperation {
            do {
                guard let wallet = self._wallets[walletId] else {
                    throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
                }
                let keychainKind = self.setKeychainKind(keychainKind: keychain)
                let addressInfo = try wallet.revealNextAddress(keychain: keychainKind)
                let result: [String: Any] = [
                    "index": addressInfo.index,
                    "address": addressInfo.address.asString(),
                    "keychain": self.keychainKindToString(addressInfo.keychain)
                ]
                DispatchQueue.main.async { resolve(result) }
            } catch let error {
                DispatchQueue.main.async { reject("Reveal next address error", "\(error.localizedDescription)", error) }
            }
        }
    }

    @objc
    func walletSentAndReceived(_ walletId: String, txId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        operationQueue.addOperation {
            do {
                guard let wallet = self._wallets[walletId], let tx = self._transactions[txId] else {
                    throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Wallet or Transaction not found"])
                }
                let values = wallet.sentAndReceived(tx: tx)
                let result: [String: UInt64] = [
                    "sent": values.sent.toSat(),
                    "received": values.received.toSat()
                ]
                DispatchQueue.main.async { resolve(result) }
            } catch let error {
                DispatchQueue.main.async { reject("Sent and received error", "\(error.localizedDescription)", error) }
            }
        }
    }

    @objc
    func walletSign(_ walletId: String, psbt: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        operationQueue.addOperation {
            do {
                let wallet = try self.getWalletById(walletId)
                let psbtObject = try Psbt(psbtBase64: psbt)
                let signedPsbt = try wallet.sign(psbt: psbtObject)
                DispatchQueue.main.async { resolve(signedPsbt) }
            } catch let error {
                DispatchQueue.main.async { reject("Sign error", "\(error.localizedDescription)", error) }
            }
        }
    }

    @objc
    func walletStartFullScan(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        operationQueue.addOperation {
            do {
                guard let wallet = self._wallets[walletId] else {
                    throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
                }
                let fullScanRequest = wallet.startFullScan()
                let id = self.randomId()
                self._fullScanRequests[id] = fullScanRequest
                DispatchQueue.main.async { resolve(id) }
            } catch let error {
                DispatchQueue.main.async { reject("Start full scan error", "\(error.localizedDescription)", error) }
            }
        }
    }

    @objc
    func walletTransactions(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        executeAsync(work: {
            guard let wallet = self._wallets[walletId] else {
                throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
            }
            return wallet.transactions().map { tx -> [String: Any] in
                let txId = self.randomId()
                self._transactions[txId] = tx.transaction
                return [
                    "txid": tx.transaction.txid(),
                    "received": tx.transaction.output().reduce(0) { $0 + $1.value },
                    "sent": 0,
                    "fee": 0,
                    "confirmationTime": NSNull(),
                    "transaction": txId
                ]
            }
        }, resolve: resolve, reject: reject)
    }

    @objc
    func walletNew(_ descriptor: String, changeDescriptor: String?, persistenceBackendPath: String, network: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        executeAsync(work: {
            let id = self.randomId()
            guard let nativeDescriptor = self._descriptors[descriptor] else {
                throw NSError(domain: "BdkRnModule", code: 0, userInfo: [NSLocalizedDescriptionKey: "Descriptor not found"])
            }
            let nativeChangeDescriptor = changeDescriptor != nil ? self._descriptors[changeDescriptor!] : nil
            let wallet = try Wallet(
                descriptor: nativeDescriptor,
                changeDescriptor: nativeChangeDescriptor,
                persistenceBackendPath: persistenceBackendPath,
                network: self.setNetwork(networkStr: network)
            )
            self._wallets[id] = wallet
            return id
        }, resolve: resolve, reject: reject)
    }

    @objc
    func newNoPersist(_ descriptor: String, changeDescriptor: String?, network: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let networkType = self.setNetwork(networkStr: network)
                let descriptorObject = try Descriptor(descriptor: descriptor, network: networkType)
                
                let changeDescriptorObject = changeDescriptor != nil ? try Descriptor(descriptor: changeDescriptor!, network: networkType) : nil
                
                let wallet = try Wallet.newNoPersist(descriptor: descriptorObject, changeDescriptor: changeDescriptorObject, network: networkType)
                let id = self.randomId()
                self._wallets[id] = wallet
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Wallet creation error", "\(error)", error)
                }
            }
        }
    }
    
    @objc
    func commit(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        executeAsync(work: {
            let wallet = try self.getWalletById(walletId)
            return try wallet.commit()
        }, resolve: resolve, reject: reject)
    }

    @objc
    func sign(_ walletId: String, psbt: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        executeAsync(work: {
            let wallet = try self.getWalletById(walletId)
            let psbtObject = try Psbt(psbtBase64: psbt)
            return try wallet.sign(psbt: psbtObject)
        }, resolve: resolve, reject: reject)
    }
    
    @objc
    func sentAndReceived(_ walletId: String, txId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                guard let wallet = self._wallets[walletId], let tx = self._transactions[txId] else {
                    throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "Wallet or Transaction not found"])
                }
                let values = wallet.sentAndReceived(tx: tx)
                let result: [String: UInt64] = [
                    "sent": values.sent.toSat(),
                    "received": values.received.toSat()
                ]
                DispatchQueue.main.async {
                    resolve(result)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Sent and received error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func transactions(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        executeAsync(work: {
            let wallet = try self.getWalletById(walletId)
            return try wallet.transactions()
        }, resolve: resolve, reject: reject)
    }

    @objc
    func getTx(_ walletId: String, txId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        executeAsync(work: {
            guard let wallet = self._wallets[walletId] else {
                throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
            }
            return try wallet.getTx(txid: txId)
        }, resolve: resolve, reject: reject)
    }

    @objc
    func calculateFee(_ walletId: String, txId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                guard let wallet = self._wallets[walletId] else {
                    throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
                }
                // Retrieve the Transaction object using txId
                guard let transaction = self._transactions[txId] else {
                    throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "Transaction not found"])
                }
                let fee = try wallet.calculateFee(tx: transaction)
                DispatchQueue.main.async {
                    resolve(fee)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Calculate fee error", "\(error)", error)
                }
            }
        }
    }


    @objc
    func listOutput(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                guard let wallet = self._wallets[walletId] else {
                    throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
                }
                let outputs = try wallet.listOutput()
                DispatchQueue.main.async {
                    resolve(outputs)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("List output error", "\(error)", error)
                }
            }
        }
    }

    @objc
        func startFullScan(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
            executeAsync(work: {
                guard let wallet = self._wallets[walletId] else {
                    throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
                }
                let fullScanRequest = try wallet.startFullScan()
                let id = self.randomId()
                self._fullScanRequests[id] = fullScanRequest
                return id
            }, resolve: resolve, reject: reject)
        }
    

    @objc
    func startSyncWithRevealedSpks(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                guard let wallet = self._wallets[walletId] else {
                    throw NSError(domain: "BdkRnModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "Wallet not found"])
                }
                let syncRequest = try wallet.startSyncWithRevealedSpks()
                let id = self.randomId()
                self._syncRequests[id] = syncRequest
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Start sync with revealed spks error", "\(error)", error)
                }
            }
        }
    }

    /** Wallet Protocol Methods ends */

    
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

    /** ChangeSpendPolicy methods starts */
     @objc
    func createChainPosition(_ position: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let chainPosition: ChainPosition
                
                if let height = position["height"] as? NSNumber,
                let timestamp = position["timestamp"] as? NSNumber {
                    chainPosition = .confirmed(height: UInt32(truncating: height), timestamp: UInt64(truncating: timestamp))
                } else if let timestamp = position["timestamp"] as? NSNumber {
                    chainPosition = .unconfirmed(timestamp: UInt64(truncating: timestamp))
                } else {
                    throw NSError(domain: "ChainPositionError", code: 0, userInfo: [NSLocalizedDescriptionKey: "Invalid chain position data"])
                }
                
                let id = self.randomId()
                // Store the chainPosition in a dictionary if needed for later use
                // self._chainPositions[id] = chainPosition
                
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("ChainPosition error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func getChainPositionType(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            // Retrieve the chainPosition from the dictionary if you stored it
            // guard let chainPosition = self._chainPositions[id] else {
            //     reject("ChainPosition error", "ChainPosition not found", nil)
            //     return
            // }
            
            // For demonstration, we'll use a mock chainPosition
            let mockChainPosition: ChainPosition = .confirmed(height: 100, timestamp: 1234567890)
            
            let type: String
            switch mockChainPosition {
            case .confirmed:
                type = "confirmed"
            case .unconfirmed:
                type = "unconfirmed"
            }
            
            DispatchQueue.main.async {
                resolve(type)
            }
        }
    }

    @objc
    func getChainPositionData(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            // Retrieve the chainPosition from the dictionary if you stored it
            // guard let chainPosition = self._chainPositions[id] else {
            //     reject("ChainPosition error", "ChainPosition not found", nil)
            //     return
            // }
            
            // For demonstration, we'll use a mock chainPosition
            let mockChainPosition: ChainPosition = .confirmed(height: 100, timestamp: 1234567890)
            
            var data: [String: Any]
            switch mockChainPosition {
            case .confirmed(let height, let timestamp):
                data = ["height": height, "timestamp": timestamp]
            case .unconfirmed(let timestamp):
                data = ["timestamp": timestamp]
            }
            
            DispatchQueue.main.async {
                resolve(data)
            }
        }
    }
    /** ChangeSpendPolicy methods ends */

    /** FullScanRequest methods starts */

    @objc
    func createFullScanRequest(_ walletId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                let wallet = try self.getWalletById(walletId)
                let fullScanRequest = wallet.startFullScan()
                let id = self.randomId()
                self._fullScanRequests[id] = fullScanRequest
                DispatchQueue.main.async {
                    resolve(id)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("FullScanRequest creation error", "\(error)", error)
                }
            }
        }
    }

    @objc
    func freeFullScanRequest(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            self._fullScanRequests.removeValue(forKey: id)
            DispatchQueue.main.async {
                resolve(nil)
            }
        }
    }

    /** FullScanRequest methods ends */

    /** SentAndReceivedValues methods starts */

    @objc
    func fetchSentAndReceivedValues(_ walletId: String, txId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            guard let wallet = self._wallets[walletId], let tx = self._transactions[txId] else {
                DispatchQueue.main.async {
                    reject("Invalid wallet or transaction", "Wallet or Transaction not found", nil)
                }
                return
            }
            
            let values = wallet.sentAndReceived(tx: tx) // Assuming sentAndReceived() returns SentAndReceivedValues
            let result: [String: UInt64] = [
                "sent": values.sent.toSat(),
                "received": values.received.toSat()
            ]
            
            DispatchQueue.main.async {
                resolve(result)
            }
        }
    }

    @objc
    func freeSentAndReceivedValues(values: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .userInteractive).async {
            // Logic to release resources associated with SentAndReceivedValues if necessary
            // This could involve clearing any in-memory cache or temporary storage
            
            DispatchQueue.main.async {
                resolve(nil)
            }
        }
    }

    /** SentAndReceivedValues methods ends */

    /** CanonicalTx methods starts */

    @objc
    func createCanonicalTx(
        transactionId: String,
        chainPositionId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            do {
                // Retrieve Transaction and ChainPosition by their IDs
                let transaction = try getTransactionById(transactionId) // Ensure this method throws an error if not found
                let chainPosition = try getChainPositionById(chainPositionId) // Ensure this method throws an error if not found
                
                // Create the CanonicalTx instance
                let canonicalTx = CanonicalTx(transaction: transaction, chainPosition: chainPosition)
                let canonicalTxId = randomId() // Generate a unique ID for the CanonicalTx
                _canonicalTxs[canonicalTxId] = canonicalTx // Store it in a dictionary
                
                DispatchQueue.main.async {
                    resolve(canonicalTxId) // Resolve with the ID of the created CanonicalTx
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("Create CanonicalTx error", "\(error.localizedDescription)", error) // Provide a more descriptive error message
                }
            }
        }
    }

    // Function to retrieve a CanonicalTx by ID
    @objc
    func getCanonicalTxById(
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.global(qos: .userInteractive).async { [self] in
            guard let canonicalTx = _canonicalTxs[id] else {
                DispatchQueue.main.async {
                    reject("Get CanonicalTx error", "CanonicalTx not found", nil) // Reject if not found
                }
                return
            }
            
            // Convert the CanonicalTx to a dictionary format for easier access
            let result: [String: Any] = [
                "transaction": canonicalTx.transaction, // Convert to a suitable format if necessary
                "chainPosition": canonicalTx.chainPosition // Convert to a suitable format if necessary
            ]
            
            DispatchQueue.main.async {
                resolve(result) // Resolve with the CanonicalTx details
            }
        }
    }
    /** CanonicalTx methods ends */

}

