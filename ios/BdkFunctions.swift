import Foundation
class BdkProgress: Progress {
    func update(progress: Float, message: String?) {
        print("progress", progress, message as Any)
    }
}

class BdkFunctions: NSObject {
    var wallet: Wallet
    var blockChain: Blockchain
    let databaseConfig = DatabaseConfig.memory
    let defaultBlockChainConfigUrl: String = "ssl://electrum.blockstream.info:60002"
    let defaultBlockChain = "ELECTRUM"
    var blockchainConfig = BlockchainConfig.electrum(
        config: ElectrumConfig(
            url: "ssl://electrum.blockstream.info:60002",
            socks5: nil,
            retry: 5,
            timeout: nil,
            stopGap: 10))
    let defaultNodeNetwork = "testnet"
    let defaultDescriptor = "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/0/*)"
    let defaultChangeDescriptor = "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/1/*)"


    override init() {
        self.blockChain = try! Blockchain(config: blockchainConfig)
        self.wallet = try! Wallet.init(descriptor: defaultDescriptor, changeDescriptor: defaultChangeDescriptor, network: Network.testnet, databaseConfig: databaseConfig)
    }


    func syncWallet() {
        try? self.wallet.sync(blockchain: Blockchain.init(config: blockchainConfig), progress: BdkProgress())
    }

    func setNetwork(networkStr: String?) -> Network {
        switch (networkStr) {
            case "testnet": return Network.testnet
            case "bitcoin": return Network.bitcoin
            case "regtest": return Network.regtest
            case "signet": return Network.signet
            default: return Network.testnet
        }
    }


    func createDefaultDescriptor(xprv: String) -> String {
        return ("wpkh(" + xprv + ")")
    }

    func createChangeDescriptor(descriptor: String) -> String {
        return descriptor.replacingOccurrences(of: "/84'/1'/0'/0/*", with: "/84'/1'/0'/1/*")
    }
    
    
    // only create BIP84 compatible wallets
    private func createExternalDescriptor(rootKey: DescriptorSecretKey) -> String {
        let path: DerivationPath = try! DerivationPath(path: "m/84h/1h/0h/0")
        let descriptor = "wpkh(\(rootKey.extend(path: path).asString())"
        return descriptor
    }
    
    private func createInternalDescriptor(rootKey: DescriptorSecretKey) -> String {
        let path: DerivationPath = try! DerivationPath(path: "m/84h/1h/0h/1")
        let descriptor = "wpkh(\(rootKey.extend(path: path).asString())"
        return descriptor
    }



    private func createBlockchainConfig(
        blockChainConfigUrl: String?, blockChainSocket5: String?,
        retry: String?, timeOut: String?, blockChainName: String?
    ) -> BlockchainConfig {
        let blockChainUrl =  blockChainConfigUrl != "" ? blockChainConfigUrl! :  defaultBlockChainConfigUrl;
        let socks5 = blockChainSocket5 != "" ? blockChainSocket5! :  nil;
        switch (blockChainName) {
        case "ELECTRUM": return BlockchainConfig.electrum(config:
                    ElectrumConfig(
                    url: blockChainUrl, socks5: socks5,
                    retry: UInt8(retry ?? "") ?? 5, timeout: UInt8(timeOut ?? "") ?? 5,
                    stopGap: 5
                )
            )
        case "ESPLORA": return BlockchainConfig.esplora(config:
                    EsploraConfig(
                    baseUrl: blockChainUrl, proxy: nil,
                    concurrency: UInt8(retry ?? "") ?? 5, stopGap: UInt64(timeOut ?? "") ?? 5,
                    timeout: 5
                )
            )
        default: return blockchainConfig

        }
    }

    func extendedKeyInfo(network: Network, mnemonic: String, password: String? = nil) throws -> [String: Any?] {
        do {
            let keysInfo = try DescriptorSecretKey(
                network: network,
                mnemonic: Mnemonic.fromString(mnemonic: mnemonic),
                password: password
            )
            let responseObject = [
                "mnemonic": mnemonic,
                "xprv": keysInfo.asString()
            ] as [String: Any]
            return responseObject
        } catch {
            throw error
        }
    }

    func createWallet(
        mnemonic: String?,
        password: String? = nil,
        network: String?,
        blockChainConfigUrl: String?,
        blockChainSocket5: String?,
        retry: String?,
        timeOut: String?,
        blockChainName: String?,
        descriptor: String?
    ) throws -> [String: Any?] {
        do {

            let walletNetwork: Network = setNetwork(networkStr: network)
            var newDescriptor = "";
            if(descriptor == "") {
                let rootKey = try DescriptorSecretKey(
                    network: walletNetwork,
                    mnemonic: Mnemonic.fromString(mnemonic: mnemonic ?? ""),
                    password: password
                )
                newDescriptor = createDefaultDescriptor(xprv: rootKey.asString())
            } else {
                newDescriptor = descriptor ?? ""
            }

            self.blockchainConfig = createBlockchainConfig(blockChainConfigUrl: blockChainConfigUrl, blockChainSocket5: blockChainSocket5, retry: retry, timeOut: timeOut, blockChainName: blockChainName != "" ? blockChainName : defaultBlockChain)

            self.wallet = try Wallet.init(
                descriptor: newDescriptor,
                changeDescriptor: nil,
                network: walletNetwork,
                databaseConfig: databaseConfig)

            let addressInfo = try! self.wallet.getAddress(addressIndex: AddressIndex.new)
            let responseObject = ["address": addressInfo.address] as [String: Any]
            return responseObject
        } catch {
            throw error
        }
    }


    func getWallet()throws -> [String: Any?] {
        do {
            let addressInfo = try! self.wallet.getAddress(addressIndex: AddressIndex.new)
            let responseObject = [
                "address": addressInfo.address,
                "balance": try self.getBalance()
            ] as [String: Any]
            return responseObject
        } catch {
            throw error
        }
    }


    func getNewAddress() -> String {
        let addressInfo = try! self.wallet.getAddress(addressIndex: AddressIndex.new)
        return addressInfo.address
    }
    func getLastUnusedAddress() -> String {
        let addressInfo = try! self.wallet.getAddress(addressIndex: AddressIndex.lastUnused)
        return addressInfo.address
    }

    func getNetwork() -> Network {
        return self.wallet.network()
    }


    func getBalance() throws -> String {
        do {
            let balance = try self.wallet.getBalance()
            return String(balance.confirmed)
        } catch {
            throw error
        }
    }

    func transactionsList(pending: Bool? = false) throws -> [Any] {
        do {
            let transactions: [TransactionDetails] = try wallet.listTransactions()
            print(transactions);

            var confirmedTransactions: [Any] = []
            var pendingTransactions: [Any] = []
            for details in transactions {
                if (details.confirmationTime != nil) { // Confirmed transactions
                    let responseObject = [
                        "fee": details.fee!,
                        "received": details.received,
                        "sent": details.sent,
                        "txid": details.txid,
                        "confirmationTime": details.confirmationTime?.timestamp ?? "",
                    ] as [String: Any]
                    confirmedTransactions.append(responseObject)
                } else { // Pending transactions
                    let responseObject = [
                        "fee": details.fee!,
                        "received": details.received,
                        "sent": details.sent,
                        "txid": details.txid,
                    ] as [String: Any]
                    pendingTransactions.append(responseObject)
                }
            }
            return pending == true ? pendingTransactions : confirmedTransactions
        } catch {
            throw error
        }
    }


    func broadcastTx(_ recipient: String, amount: NSNumber) throws -> String {
        do {
            let address = try Address(address: recipient)
            let script = address.scriptPubkey()
            let txBuilder = TxBuilder().addRecipient(script: script, amount: UInt64(truncating: amount))
            let details = try txBuilder.finish(wallet: wallet)
            let _ = try wallet.sign(psbt: details.psbt)
            try blockChain.broadcast(psbt: details.psbt)
            let txid = details.psbt.txid()
            return txid;
        } catch {
            throw error
        }
    }
}

