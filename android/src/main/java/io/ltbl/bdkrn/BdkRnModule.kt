package io.ltbl.bdkrn

import com.facebook.react.bridge.*
import com.facebook.react.bridge.Arguments.makeNativeArray
import com.facebook.react.bridge.UiThreadUtil.runOnUiThread
import org.bitcoindevkit.*
import org.bitcoindevkit.Descriptor.Companion.newBip44
import org.bitcoindevkit.Descriptor.Companion.newBip44Public
import org.bitcoindevkit.Descriptor.Companion.newBip49
import org.bitcoindevkit.Descriptor.Companion.newBip49Public
import org.bitcoindevkit.Descriptor.Companion.newBip84
import org.bitcoindevkit.Descriptor.Companion.newBip84Public
import org.bitcoindevkit.Descriptor.Companion.newBip86
import org.bitcoindevkit.Descriptor.Companion.newBip86Public
import org.bitcoindevkit.Amount
import org.bitcoindevkit.OutPoint
import org.bitcoindevkit.KeychainKind
import io.ltbl.bdkrn.getTxBytes

class BdkRnModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BdkRnModule"
    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }
    private val _canonicalTxs: MutableMap<String, CanonicalTx> = mutableMapOf()

    private fun getTransactionById(id: String): Transaction {
        return _transactions[id] ?: throw Exception("Transaction not found")
    }

    private fun getChainPositionById(id: String): ChainPosition {
        return _chainPositions[id] ?: throw Exception("ChainPosition not found")
    }
    private val _chainPositions: MutableMap<String, ChainPosition> = mutableMapOf() 
    private var _descriptorSecretKeys = mutableMapOf<String, DescriptorSecretKey>()
    private var _descriptorPublicKeys = mutableMapOf<String, DescriptorPublicKey>()

    private var _wallets = mutableMapOf<String, Wallet>()
    private var _addresses = mutableMapOf<String, Address>()
    private var _scripts = mutableMapOf<String, org.bitcoindevkit.Script>()
    private var _txBuilders = mutableMapOf<String, TxBuilder>()
    private var _descriptors = mutableMapOf<String, Descriptor>()

    private var _derivationPaths = mutableMapOf<String, DerivationPath>()
    private var _bumpFeeTxBuilders = mutableMapOf<String, BumpFeeTxBuilder>()
    private var _transactions = mutableMapOf<String, Transaction>()

    private var _outPoints = mutableMapOf<String, org.bitcoindevkit.OutPoint>()
    private var _txOuts = mutableMapOf<String, org.bitcoindevkit.TxOut>()
    private var _feeRates = mutableMapOf<String, FeeRate>()
    private val _localOutputs = mutableMapOf<String, LocalOutput>()

    private var _blockChains = mutableMapOf<String, Any>()
    private var _fullScanRequests = mutableMapOf<String, FullScanRequest>()
    private var _syncRequests = mutableMapOf<String, SyncRequest>()
    private val _updates = mutableMapOf<String, Any>()

    private fun <T> getAndStoreObject(objectMap: MutableMap<String, T>, createObject: () -> T): String {
        val objectId = randomId()
        objectMap[objectId] = createObject()
        return objectId
    }

    /** Mnemonic methods starts */
    @ReactMethod
        fun generateSeedFromWordCount(wordCount: Int, result: Promise) {
            Thread {
                try {
                    val response = Mnemonic(setWordCount(wordCount))
                    result.resolve(response.asString()) // Resolve with the seed string
                } catch (error: Throwable) {
                    result.reject("Generate seed error", error.localizedMessage, error) // Reject with error
                }
            }.start()
        }

    @ReactMethod
    fun generateSeedFromString(mnemonic: String, result: Promise) {
        Thread {
            try {
                val response = Mnemonic.fromString(mnemonic)
                result.resolve(response.asString()) // Resolve with the seed string
            } catch (error: Throwable) {
                result.reject("Generate seed error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun generateSeedFromEntropy(entropy: ReadableArray, result: Promise) {
        Thread {
            try {
                val response = Mnemonic.fromEntropy(getEntropy(entropy))
                result.resolve(response.asString()) // Resolve with the seed string
            } catch (error: Throwable) {
                result.reject("Generate seed error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    /** Mnemonic methods ends */

    /** Derviation path methods starts */
    @ReactMethod
    fun createDerivationPath(path: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _derivationPaths[id] = DerivationPath(path)
                result.resolve(id) // Resolve with the derivation path ID
            } catch (error: Throwable) {
                result.reject("Create Derivation path error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun derivationPathToString(id: String, result: Promise) {
        Thread {
            try {
                val derivationPath = _derivationPaths[id] ?: throw Exception("DerivationPath not found")
                result.resolve(id) // Resolve with the derivation path ID
            } catch (error: Throwable) {
                result.reject("DerivationPath error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    /** Derviation path methods ends */

    /** EsploraClient methods starts */

    @ReactMethod
    fun createEsploraClient(url: String, promise: Promise) {
        Thread {
            try {
                val esploraClient = EsploraClient(url)
                val id = getAndStoreObject(_blockChains) { esploraClient }
                promise.resolve(id)
            } catch (error: Throwable) {
                promise.reject("EsploraClient error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun esploraClientBroadcast(clientId: String, txid: String, promise: Promise) {
        Thread {
            try {
                val esploraClient = _blockChains[clientId] as? EsploraClient
                    ?: throw Exception("EsploraClient not found")
                val transaction = _transactions[txid]
                    ?: throw Exception("Transaction not found")

                esploraClient.broadcast(transaction)
                promise.resolve(null) // Resolve with no value
            } catch (error: Throwable) {
                promise.reject("Broadcast error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun esploraClientFullScan(clientId: String, fullScanRequestId: String, stopGap: Double, parallelRequests: Double, promise: Promise) {
        Thread {
            try {
                val esploraClient = _blockChains[clientId] as? EsploraClient
                    ?: throw Exception("EsploraClient not found")
                val fullScanRequest = _fullScanRequests[fullScanRequestId]
                    ?: throw Exception("FullScanRequest not found")

                val update = esploraClient.fullScan(fullScanRequest,
                    stopGap.toUInt().toULong(), parallelRequests.toUInt().toULong()
                )
                val updateId = randomId()
                _updates[updateId] = update
                promise.resolve(updateId) // Resolve with the update ID
            } catch (error: Throwable) {
                promise.reject("Full scan error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun esploraClientSync(clientId: String, syncRequestId: String, parallelRequests: Double, promise: Promise) {
        Thread {
            try {
                val esploraClient = _blockChains[clientId] as? EsploraClient
                    ?: throw Exception("EsploraClient not found")
                val syncRequest = _syncRequests[syncRequestId]
                    ?: throw Exception("SyncRequest not found")

                val update = esploraClient.sync(syncRequest, parallelRequests.toUInt().toULong())
                val updateId = randomId()
                _updates[updateId] = update
                promise.resolve(updateId) // Resolve with the update ID
            } catch (error: Throwable) {
                promise.reject("Sync error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    /** EsploraClient methods ends */

    /** ElectrumClient methods starts */
    @ReactMethod
    fun createElectrumClient(url: String, promise: Promise) {
        Thread {
            try {
                val client = ElectrumClient(url)
                val id = getAndStoreObject(_blockChains) { client }
                promise.resolve(id)
            } catch (error: Throwable) {
                promise.reject("ElectrumClient creation error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun electrumClientBroadcast(clientId: String, transactionId: String, promise: Promise) {
        Thread {
            try {
                val client = _blockChains[clientId] as? ElectrumClient
                    ?: throw Exception("ElectrumClient not found")
                val transaction = _transactions[transactionId]
                    ?: throw Exception("Transaction not found")

                val txid = client.broadcast(transaction)
                promise.resolve(txid) // Resolve with the transaction ID
            } catch (error: Throwable) {
                promise.reject("Broadcast error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun electrumClientFullScan(clientId: String, fullScanRequestId: String, stopGap: Double, batchSize: Double, fetchPrevTxouts: Boolean, promise: Promise) {
        Thread {
            try {
                val client = _blockChains[clientId] as? ElectrumClient
                    ?: throw Exception("ElectrumClient not found")
                val fullScanRequest = _fullScanRequests[fullScanRequestId]
                    ?: throw Exception("FullScanRequest not found")

                val update = client.fullScan(fullScanRequest,
                    stopGap.toUInt().toULong(), batchSize.toUInt().toULong(), fetchPrevTxouts)
                val updateId = randomId()
                _updates[updateId] = update
                promise.resolve(updateId) // Resolve with the update ID
            } catch (error: Throwable) {
                promise.reject("Full scan error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun electrumClientSync(clientId: String, syncRequestId: String, batchSize: Double, fetchPrevTxouts: Boolean, promise: Promise) {
        Thread {
            try {
                val client = _blockChains[clientId] as? ElectrumClient
                    ?: throw Exception("ElectrumClient not found")
                val syncRequest = _syncRequests[syncRequestId]
                    ?: throw Exception("SyncRequest not found")

                val update = client.sync(syncRequest, batchSize.toUInt().toULong(), fetchPrevTxouts)
                val updateId = randomId()
                _updates[updateId] = update
                promise.resolve(updateId) // Resolve with the update ID
            } catch (error: Throwable) {
                promise.reject("Sync error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    /** ElectrumClient methods ends */

    /** SyncRequest methods starts */

    @ReactMethod
    fun createSyncRequest(walletId: String, promise: Promise) {
        Thread {
            val wallet = _wallets[walletId]
            if (wallet == null) {
                runOnUiThread {
                    promise.reject("Invalid wallet", "Wallet not found", null) // Reject if wallet not found
                }
                return@Thread
            }

            try {
                val syncRequest = wallet.startSyncWithRevealedSpks()
                val id = getAndStoreObject(_syncRequests) { syncRequest }
                runOnUiThread {
                    promise.resolve(id) // Resolve with the sync request ID
                }
            } catch (error: Throwable) {
                runOnUiThread {
                    promise.reject("SyncRequest creation error", error.localizedMessage, error) // Reject with error
                }
            }
        }.start()
    }

    @ReactMethod
    fun freeSyncRequest(id: String, promise: Promise) {
        Thread {
            _syncRequests.remove(id)
            runOnUiThread {
                promise.resolve(null) // Resolve with no value
            }
        }.start()
    }

    /** SyncRequest methods ends */

   /** Descriptor secret key methods starts */
    @ReactMethod
    fun createDescriptorSecretKey(network: String, mnemonic: String, password: String?, result: Promise) {
        Thread {
            try {
                val mnemonicObj = Mnemonic.fromString(mnemonic)
                val descriptorSecretKey = DescriptorSecretKey(
                    setNetwork(network),
                    mnemonicObj,
                    password
                )
                val id = randomId()
                _descriptorSecretKeys[id] = descriptorSecretKey
                result.resolve(id) // Resolve with the secret key ID
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretKeyFromString(secretKey: String, result: Promise) {
        Thread {
            try {
                val descriptorSecretKey = DescriptorSecretKey.fromString(secretKey)
                val id = randomId()
                _descriptorSecretKeys[id] = descriptorSecretKey
                result.resolve(id) // Resolve with the secret key ID
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretKeyAsPublic(id: String, result: Promise) {
        Thread {
            try {
                val descriptorSecretKey = _descriptorSecretKeys[id] ?: throw Exception("DescriptorSecretKey not found")
                val descriptorPublicKey = descriptorSecretKey.asPublic()
                val publicKeyId = randomId()
                _descriptorPublicKeys[publicKeyId] = descriptorPublicKey
                result.resolve(publicKeyId) // Resolve with the public key ID
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretKeyAsString(id: String, result: Promise) {
        Thread {
            try {
                val descriptorSecretKey = _descriptorSecretKeys[id] ?: throw Exception("DescriptorSecretKey not found")
                result.resolve(descriptorSecretKey.asString()) // Resolve with the secret key string
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretKeyDerive(id: String, path: String, result: Promise) {
        Thread {
            try {
                val descriptorSecretKey = _descriptorSecretKeys[id] ?: throw Exception("DescriptorSecretKey not found")
                val derivationPath = DerivationPath(path)
                val derivedKey = descriptorSecretKey.derive(derivationPath)
                val newId = randomId()
                _descriptorSecretKeys[newId] = derivedKey
                result.resolve(newId) // Resolve with the derived key ID
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey derive error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretKeyExtend(id: String, path: String, result: Promise) {
        Thread {
            try {
                val descriptorSecretKey = _descriptorSecretKeys[id] ?: throw Exception("DescriptorSecretKey not found")
                val derivationPath = DerivationPath(path)
                val extendedKey = descriptorSecretKey.extend(derivationPath)
                val newId = randomId()
                _descriptorSecretKeys[newId] = extendedKey
                result.resolve(newId) // Resolve with the extended key ID
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey extend error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretKeySecretBytes(id: String, result: Promise) {
        Thread {
            try {
                val descriptorSecretKey = _descriptorSecretKeys[id] ?: throw Exception("DescriptorSecretKey not found")
                val secretBytes = descriptorSecretKey.secretBytes()
                result.resolve(Arguments.makeNativeArray(secretBytes)) // Resolve with the secret bytes
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    /** Descriptor secret key methods ends */

    /** Descriptor public key methods starts */
     @ReactMethod
    fun createDescriptorPublic(publicKey: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _descriptorPublicKeys[id] = DescriptorPublicKey.fromString(publicKey)
                result.resolve(id) // Resolve with the public key ID
            } catch (error: Throwable) {
                result.reject("DescriptorPublic create error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun descriptorPublicDerive(publicKeyId: String, derivationPathId: String, result: Promise) {
        Thread {
            try {
                val keyInfo =
                    _descriptorPublicKeys[publicKeyId]!!.derive(_derivationPaths[derivationPathId]!!)
                result.resolve(keyInfo.asString()) // Resolve with the derived key string
            } catch (error: Throwable) {
                result.reject("DescriptorPublic derive error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun descriptorPublicExtend(publicKeyId: String, derivationPathId: String, result: Promise) {
        Thread {
            try {
                val keyInfo =
                    _descriptorPublicKeys[publicKeyId]!!.extend(_derivationPaths[derivationPathId]!!)
                result.resolve(keyInfo.asString()) // Resolve with the extended key string
            } catch (error: Throwable) {
                result.reject("DescriptorPublic extend error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun descriptorPublicAsString(publicKeyId: String, result: Promise) {
        Thread {
            result.resolve(_descriptorPublicKeys[publicKeyId]!!.asString()) // Resolve with the public key string
        }.start()
    }

    /** Descriptor public key methods ends */

    /** Wallet methods starts*/
    private fun getWalletById(id: String): Wallet {
        return _wallets[id]!!
    }

    @ReactMethod
    fun revealNextAddress(id: String, addressIndex: Dynamic, result: Promise) {
        Thread {
            try {
                val keychain = when (addressIndex.type) {
                    ReadableType.Boolean -> {
                        if (addressIndex.asBoolean()) org.bitcoindevkit.KeychainKind.INTERNAL 
                        else org.bitcoindevkit.KeychainKind.EXTERNAL
                    }
                    else -> org.bitcoindevkit.KeychainKind.EXTERNAL
                }
                
                val addressInfo = getWalletById(id).revealNextAddress(keychain)
                val randomId = randomId()
                _addresses[randomId] = addressInfo.address
                
                val responseObject = mutableMapOf<String, Any?>()
                responseObject["index"] = addressInfo.index.toInt()
                responseObject["address"] = randomId
                responseObject["keychain"] = addressInfo.keychain.toString()
                
                result.resolve(Arguments.makeNativeMap(responseObject)) // Resolve with the address info
            } catch (error: Throwable) {
                result.reject("Reveal next address error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    
    @ReactMethod
    fun isMine(id: String, scriptId: String, result: Promise) {
        Thread {
            try {
                val isMine = getWalletById(id).isMine(_scripts[scriptId]!!)
                result.resolve(isMine) // Resolve with the isMine boolean
            } catch (error: Throwable) {
                result.reject("Check wallet isMine error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun getNetwork(id: String, result: Promise) {
        Thread {
            try {
                val network = getWalletById(id).network()
                result.resolve(getNetworkString(network)) // Resolve with the network string
            } catch (error: Throwable) {
                result.reject("Get network error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    
    @ReactMethod
    fun walletGetBalance(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                val responseObject = mutableMapOf<String, Any?>()
                responseObject["immature"] = balance.immature
                responseObject["trustedPending"] = balance.trustedPending
                responseObject["untrustedPending"] = balance.untrustedPending
                responseObject["confirmed"] = balance.confirmed
                responseObject["trustedSpendable"] = balance.trustedSpendable
                responseObject["total"] = balance.total
                
                promise.resolve(Arguments.makeNativeMap(responseObject)) // Resolve with the balance info
            } catch (error: Throwable) {
                promise.reject("Get wallet balance error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun listUnspent(id: String, result: Promise) {
        Thread {
            try {
                val unspentList = getWalletById(id).listUnspent()
                val unspents = unspentList.map { item ->
                    mutableMapOf<String, Any?>().apply {
                        put("outpoint", getOutPoint(item.outpoint))
                        put("txout", createTxOut(item.txout, _scripts))
                        put("isSpent", item.isSpent)
                        put("keychain", item.keychain.toString())
                    }
                }
                result.resolve(Arguments.makeNativeArray(unspents)) // Resolve with the unspent outputs
            } catch (error: Throwable) {
                result.reject("List unspent outputs error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

   @ReactMethod
    fun walletNew(
        descriptor: String,
        changeDescriptor: String?,
        persistenceBackendPath: String,
        network: String,
        promise: Promise
    ) {
        Thread {
            try {
                val id = randomId() // Generate a unique ID for the wallet
                val nativeDescriptor = _descriptors[descriptor] ?: throw Exception("Descriptor not found")
                val nativeChangeDescriptor = changeDescriptor?.let { _descriptors[it] } // Look up change descriptor if provided

                // Create the wallet using the descriptors and persistence path
                val wallet = Wallet(
                    descriptor = nativeDescriptor,
                    changeDescriptor = nativeChangeDescriptor,
                    persistenceBackendPath = persistenceBackendPath,
                    network = setNetwork(network) // Convert network string to network type
                )

                _wallets[id] = wallet // Store the wallet in the mutable map
                promise.resolve(id) // Resolve the promise with the wallet ID
            } catch (error: Throwable) {
                promise.reject("Create wallet error", error.localizedMessage, error) // Reject the promise with the error
            }
        }.start()
    }

      @ReactMethod
    fun newNoPersist(descriptor: String, changeDescriptor: String?, network: String, promise: Promise) {
        Thread {
            try {
                val networkType = setNetwork(network) // Implement this method
                val descriptorObject = Descriptor(descriptor, networkType) // Assuming Descriptor has a constructor
                val changeDescriptorObject = changeDescriptor?.let { Descriptor(it, networkType) }

                val wallet = Wallet.newNoPersist(descriptorObject, changeDescriptorObject, networkType) // Assuming Wallet has a newNoPersist method
                val id = randomId() // Generate a unique ID for the wallet
                _wallets[id] = wallet // Store the wallet in a mutable map

                promise.resolve(id) // Resolve the promise with the wallet ID
            } catch (error: Throwable) {
                promise.reject("Wallet creation error", error.localizedMessage, error) // Reject the promise with the error
            }
        }.start()
    }

    @ReactMethod
    fun commit(walletId: String, promise: Promise) {
        Thread {
            try {
                val wallet = _wallets[walletId] ?: throw Exception("Wallet not found")
                val result = wallet.commit()
                promise.resolve(result) // Resolve with the commit result
            } catch (error: Throwable) {
                promise.reject("Commit error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun sign(walletId: String, psbt: String, promise: Promise) {
        Thread {
            try {
                val wallet = _wallets[walletId] ?: throw Exception("Wallet not found")
                val psbtObject = Psbt(psbt)
                val signedPsbt = wallet.sign(psbtObject)
                promise.resolve(signedPsbt) // Resolve with the signed PSBT
            } catch (error: Throwable) {
                promise.reject("Sign error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun sentAndReceived(walletId: String, txId: String, promise: Promise) {
        Thread {
            try {
                val wallet = _wallets[walletId] ?: throw Exception("Wallet not found")
                val tx = _transactions[txId] ?: throw Exception("Transaction not found")
                val values = wallet.sentAndReceived(tx)
                promise.resolve(mapOf("sent" to values.sent, "received" to values.received)) // Resolve with sent and received values
            } catch (error: Throwable) {
                promise.reject("Sent and received error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun transactions(walletId: String, promise: Promise) {
        Thread {
            try {
                val wallet = _wallets[walletId] ?: throw Exception("Wallet not found")
                val txList = wallet.transactions()
                promise.resolve(txList) // Resolve with the transaction list
            } catch (error: Throwable) {
                promise.reject("Transactions error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun getTx(walletId: String, txId: String, promise: Promise) {
        Thread {
            try {
                val wallet = _wallets[walletId] ?: throw Exception("Wallet not found")
                val tx = wallet.getTx(txId)
                promise.resolve(tx) // Resolve with the transaction
            } catch (error: Throwable) {
                promise.reject("Get transaction error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun calculateFee(walletId: String, txId: String, promise: Promise) {
        Thread {
            try {
                val wallet = _wallets[walletId] ?: throw Exception("Wallet not found")
                val transaction = _transactions[txId] ?: throw Exception("Transaction not found")
                val fee = wallet.calculateFee(transaction)
                promise.resolve(fee) // Resolve with the fee
            } catch (error: Throwable) {
                promise.reject("Calculate fee error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun calculateFeeRate(walletId: String, txId: String, promise: Promise) {
        Thread {
            try {
                val wallet = _wallets[walletId] ?: throw Exception("Wallet not found")
                val transaction = _transactions[txId] ?: throw Exception("Transaction not found")
                val feeRate = wallet.calculateFeeRate(transaction)
                promise.resolve(feeRate) // Resolve with the fee rate
            } catch (error: Throwable) {
                promise.reject("Calculate fee rate error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun listOutput(walletId: String, promise: Promise) {
        Thread {
            try {
                val wallet = _wallets[walletId] ?: throw Exception("Wallet not found")
                val outputs = wallet.listOutput()
                promise.resolve(outputs) // Resolve with the outputs
            } catch (error: Throwable) {
                promise.reject("List output error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun startFullScan(walletId: String, promise: Promise) {
        Thread {
            try {
                val wallet = _wallets[walletId] ?: throw Exception("Wallet not found")
                val fullScanRequest = wallet.startFullScan()
                val id = randomId()
                _fullScanRequests[id] = fullScanRequest
                promise.resolve(id) // Resolve with the full scan request ID
            } catch (error: Throwable) {
                promise.reject("Start full scan error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun startSyncWithRevealedSpks(walletId: String, promise: Promise) {
        Thread {
            try {
                val wallet = _wallets[walletId] ?: throw Exception("Wallet not found")
                val syncRequest = wallet.startSyncWithRevealedSpks()
                val id = randomId()
                _syncRequests[id] = syncRequest
                promise.resolve(id) // Resolve with the sync request ID
            } catch (error: Throwable) {
                promise.reject("Start sync with revealed spks error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    /** Wallet methods ends*/

    /** Balance methods starts */
    @ReactMethod
    fun getBalance(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                val responseObject = mutableMapOf<String, Any?>()
                responseObject["immature"] = balance.immature
                responseObject["trustedPending"] = balance.trustedPending
                responseObject["untrustedPending"] = balance.untrustedPending
                responseObject["confirmed"] = balance.confirmed
                responseObject["trustedSpendable"] = balance.trustedSpendable
                responseObject["total"] = balance.total
                
                promise.resolve(Arguments.makeNativeMap(responseObject)) // Resolve with the balance info
            } catch (error: Throwable) {
                promise.reject("Get wallet balance error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun getBalanceImmature(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                promise.resolve(balance.immature)
            } catch (error: Throwable) {
                promise.reject("Get wallet immature balance error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBalanceTrustedPending(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                promise.resolve(balance.trustedPending)
            } catch (error: Throwable) {
                promise.reject("Get wallet trusted pending balance error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBalanceUntrustedPending(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                promise.resolve(balance.untrustedPending)
            } catch (error: Throwable) {
                promise.reject("Get wallet untrusted pending balance error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBalanceConfirmed(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                promise.resolve(balance.confirmed)
            } catch (error: Throwable) {
                promise.reject("Get wallet confirmed balance error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBalanceTrustedSpendable(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                promise.resolve(balance.trustedSpendable)
            } catch (error: Throwable) {
                promise.reject("Get wallet trusted spendable balance error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBalanceTotal(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                promise.resolve(balance.total)
            } catch (error: Throwable) {
                promise.reject("Get wallet total balance error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Balance methods ends */


    /** Address methods starts */
    @ReactMethod
    fun initAddress(address: String, network: String, promise: Promise) {
        Thread {
            try {
                val id = randomId()
                _addresses[id] = Address(address, setNetwork(network))
                promise.resolve(id) // Resolve with the address ID
            } catch (error: Throwable) {
                promise.reject("Address error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun addressToScriptPubkeyHex(id: String, promise: Promise) {
        Thread {
            try {
                val address = _addresses[id] ?: throw Exception("Address not found")
                val scriptId = randomId()
                _scripts[scriptId] = address.scriptPubkey()
                promise.resolve(scriptId) // Resolve with the script ID
            } catch (error: Throwable) {
                promise.reject("Script pubkey error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun addressNetwork(id: String, promise: Promise) {
        Thread {
            try {
                val address = _addresses[id] ?: throw Exception("Address not found")
                val network = address.network()
                promise.resolve(getNetworkString(network)) // Resolve with the network string
            } catch (error: Throwable) {
                promise.reject("Network error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun addressToQrUri(id: String, promise: Promise) {
        Thread {
            try {
                val address = _addresses[id] ?: throw Exception("Address not found")
                promise.resolve(address.toQrUri()) // Resolve with the QR URI
            } catch (error: Throwable) {
                promise.reject("QR URI error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun addressAsString(id: String, promise: Promise) {
        Thread {
            try {
                val address = _addresses[id] ?: throw Exception("Address not found")
                promise.resolve(address.asString()) // Resolve with the address string
            } catch (error: Throwable) {
                promise.reject("Address string error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun addressIsValidForNetwork(id: String, network: String, promise: Promise) {
        Thread {
            try {
                val address = _addresses[id] ?: throw Exception("Address not found")
                val isValid = address.isValidForNetwork(setNetwork(network))
                promise.resolve(isValid) // Resolve with the validity boolean
            } catch (error: Throwable) {
                promise.reject("Network validation error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    /** Address methods ends */

    /** Amount methods starts */
    @ReactMethod
    fun createAmountFromSat(sat: Double, promise: Promise) {
        Thread {
            try {
                val amount = Amount.fromSat(sat.toLong().toULong())
                val id = getAndStoreObject(_amounts) { amount }
                promise.resolve(id) // Resolve with the amount ID
            } catch (error: Throwable) {
                promise.reject("Amount creation error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun createAmountFromBtc(btc: Double, promise: Promise) {
        Thread {
            try {
                val amount = Amount.fromBtc(btc)
                val id = getAndStoreObject(_amounts) { amount }
                promise.resolve(id) // Resolve with the amount ID
            } catch (error: Throwable) {
                promise.reject("Amount creation error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun amountAsSats(sats: Double, promise: Promise) {
        Thread {
            try {
                val amount = Amount.fromSat(sats.toLong().toULong())
                val id = getAndStoreObject(_amounts) { amount }
                promise.resolve(id) // Resolve with the amount ID
            } catch (error: Throwable) {
                promise.reject("Amount conversion error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun amountAsBtc(sats: Double, promise: Promise) {
        Thread {
            try {
                val amount = Amount.fromSat(sats.toLong().toULong())
                val id = getAndStoreObject(_amounts) { amount }
                promise.resolve(id) // Resolve with the amount ID
            } catch (error: Throwable) {
                promise.reject("Amount conversion error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    /** Amount methods ends */

    /** TxBuilder methods starts */
    @ReactMethod
    fun createTxBuilder(result: Promise) {
        Thread {
            val id = randomId()
            _txBuilders[id] = TxBuilder()
            result.resolve(id) // Resolve with the transaction builder ID
        }.start()
    }

    // `addRecipient`
    @ReactMethod
    fun addRecipient(id: String, scriptId: String, amount: Double, promise: Promise) {
        Thread {
            try {
                val satAmount = amount.toLong().toULong()
                val amountObj = Amount.fromSat(satAmount)
                val builder = _txBuilders[id] ?: throw Exception("TxBuilder not found")
                val script = _scripts[scriptId] ?: throw Exception("Script not found")
                
                _txBuilders[id] = builder.addRecipient(script, amountObj)
                promise.resolve(true) // Resolve with success
            } catch (error: Throwable) {
                promise.reject("Add recipient error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }


    // `addUnspendable`
    @ReactMethod
    fun addUnspendable(id: String, outPoint: ReadableMap, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.addUnspendable(createOutPoint(outPoint))
            result.resolve(true) // Resolve with success
        }.start()
    }

    // `addUtxo`
    @ReactMethod
    fun addUtxo(id: String, outPoint: ReadableMap, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.addUtxo(createOutPoint(outPoint))
            result.resolve(true) // Resolve with success
        }.start()
    }

    // `addUtxos`
    @ReactMethod
    fun addUtxos(id: String, outPoints: ReadableArray, promise: Promise) {
        Thread {
            try {
                val builder = _txBuilders[id] ?: throw Exception("TxBuilder not found")
                
                for (i in 0 until outPoints.size()) {
                    val outPoint = outPoints.getMap(i)
                    val mappedOutPoint = createOutPoint(outPoint)
                    _txBuilders[id] = builder.addUtxo(mappedOutPoint)
                }
                
                promise.resolve(true) // Resolve with success
            } catch (error: Throwable) {
                promise.reject("Add UTXOs error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    // `doNotSpendChange`
    @ReactMethod
    fun doNotSpendChange(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.doNotSpendChange()
            result.resolve(true) // Resolve with success
        }.start()
    }

    // `manuallySelectedOnly`
    @ReactMethod
    fun manuallySelectedOnly(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.manuallySelectedOnly()
            result.resolve(true) // Resolve with success
        }.start()
    }

    // `onlySpendChange`
    @ReactMethod
    fun onlySpendChange(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.onlySpendChange()
            result.resolve(true) // Resolve with success
        }.start()
    }

    // `unspendable`
    @ReactMethod
    fun unspendable(id: String, outPoints: ReadableArray, result: Promise) {
        Thread {
            val mappedOutPoints: MutableList<OutPoint> = mutableListOf()
            for (i in 0 until outPoints.size())
                mappedOutPoints.add(createOutPoint(outPoints.getMap(i)))
            _txBuilders[id] = _txBuilders[id]!!.unspendable(mappedOutPoints)
            result.resolve(true) // Resolve with success
        }.start()
    }

    /** LocalOutput methods starts */
    @ReactMethod
    fun getLocalOutputOutpoint(id: String, promise: Promise) {
        Thread {
            try {
                val localOutput = _localOutputs[id] ?: run {
                    promise.reject("Invalid LocalOutput", "LocalOutput not found", null)
                    return@Thread
                }
                val outpointId = randomId()
                _outPoints[outpointId] = localOutput.outpoint
                promise.resolve(outpointId) // Resolve with the outpoint ID
            } catch (error: Throwable) {
                promise.reject("Invalid LocalOutput", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun getLocalOutputTxout(id: String, promise: Promise) {
        Thread {
            try {
                val localOutput = _localOutputs[id] ?: run {
                    promise.reject("Invalid LocalOutput", "LocalOutput not found", null)
                    return@Thread
                }
                val txoutId = randomId()
                _txOuts[txoutId] = localOutput.txout
                promise.resolve(txoutId) // Resolve with the txout ID
            } catch (error: Throwable) {
                promise.reject("Invalid LocalOutput", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun getLocalOutputKeychain(id: String, promise: Promise) {
        Thread {
            try {
                val localOutput = _localOutputs[id] ?: run {
                    promise.reject("Invalid LocalOutput", "LocalOutput not found", null)
                    return@Thread
                }
                promise.resolve(localOutput.keychain.toString()) // Resolve with the keychain string
            } catch (error: Throwable) {
                promise.reject("Invalid LocalOutput", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun isLocalOutputSpent(id: String, promise: Promise) {
        Thread {
            try {
                val localOutput = _localOutputs[id] ?: run {
                    promise.reject("Invalid LocalOutput", "LocalOutput not found", null)
                    return@Thread
                }
                promise.resolve(localOutput.isSpent) // Resolve with the spent status
            } catch (error: Throwable) {
                promise.reject("Invalid LocalOutput", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    /** LocalOutput methods ends */

    /** FeeRate methods starts */
    @ReactMethod
    fun createFeeRateFromSatPerVb(satPerVb: Double, promise: Promise) {
        Thread {
            try {
                val feeRate = FeeRate.fromSatPerVb(satPerVb.toLong().toULong())
                val id = randomId()
                _feeRates[id] = feeRate
                promise.resolve(id) // Resolve with the fee rate ID
            } catch (error: Throwable) {
                promise.reject("FeeRate error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun createFeeRateFromSatPerKwu(satPerKwu: Double, promise: Promise) {
        Thread {
            try {
                val feeRate = FeeRate.fromSatPerKwu(satPerKwu.toLong().toULong())
                val id = randomId()
                _feeRates[id] = feeRate
                promise.resolve(id) // Resolve with the fee rate ID
            } catch (error: Throwable) {
                promise.reject("FeeRate error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun feeRateToSatPerVbCeil(id: String, promise: Promise) {
        Thread {
            try {
                val feeRate = _feeRates[id] ?: run {
                    promise.reject("FeeRate error", "FeeRate not found", null)
                    return@Thread
                }
                promise.resolve(feeRate.toSatPerVbCeil()) // Resolve with the ceiling value
            } catch (error: Throwable) {
                promise.reject("FeeRate error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun feeRateToSatPerVbFloor(id: String, promise: Promise) {
        Thread {
            try {
                val feeRate = _feeRates[id] ?: run {
                    promise.reject("FeeRate error", "FeeRate not found", null)
                    return@Thread
                }
                promise.resolve(feeRate.toSatPerVbFloor()) // Resolve with the floor value
            } catch (error: Throwable) {
                promise.reject("FeeRate error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun feeRateToSatPerKwu(id: String, promise: Promise) {
        Thread {
            try {
                val feeRate = _feeRates[id] ?: run {
                    promise.reject("FeeRate error", "FeeRate not found", null)
                    return@Thread
                }
                promise.resolve(feeRate.toSatPerKwu()) // Resolve with the fee rate
            } catch (error: Throwable) {
                promise.reject("FeeRate error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    /** FeeRate methods ends */

    // `feeAbsolute`
 @ReactMethod
    fun feeAbsolute(id: String, feeRate: Int, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.feeAbsolute(feeRate.toULong())
            result.resolve(true) // Resolve with success
        }.start()
    }

    // `drainWallet`
    @ReactMethod
    fun drainWallet(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.drainWallet()
            result.resolve(true) // Resolve with success
        }.start()
    }

    // `drainTo`
    @ReactMethod
    fun drainTo(id: String, scriptId: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.drainTo(_scripts[scriptId]!!)
            result.resolve(true) // Resolve with success
        }.start()
    }

    // `enableRbf`
    @ReactMethod
    fun enableRbf(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.enableRbf()
            result.resolve(true) // Resolve with success
        }.start()
    }

    // `enableRbfWithSequence`
    @ReactMethod
    fun enableRbfWithSequence(id: String, nsequence: Int, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.enableRbfWithSequence(nsequence.toUInt())
            result.resolve(true) // Resolve with success
        }.start()
    }

    
    // `setRecipients`
    @ReactMethod
    fun setRecipients(id: String, recipients: ReadableArray, promise: Promise) {
        Thread {
            try {
                val scriptAmounts = mutableListOf<ScriptAmount>()
                
                for (i in 0 until recipients.size()) {
                    val item = recipients.getMap(i)
                    val amountValue = item.getDouble("amount").toLong().toULong()
                    val amount = Amount.fromSat(amountValue)
                    
                    val script = item.getMap("script") ?: throw Exception("Script object not found")
                    val scriptId = script.getString("id") ?: throw Exception("Script ID not found")
                    val scriptObj = _scripts[scriptId] ?: throw Exception("Script not found for ID: $scriptId")
                    
                    val scriptAmount = ScriptAmount(scriptObj, amount)
                    scriptAmounts.add(scriptAmount)
                }
                
                val builder = _txBuilders[id] ?: throw Exception("TxBuilder not found")
                _txBuilders[id] = builder.setRecipients(scriptAmounts)
                promise.resolve(true) // Resolve with success
                
            } catch (error: Throwable) {
                promise.reject("Set recipients error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun finish(id: String, walletId: String, promise: Promise) {
        Thread {
            try {
                val builder = _bumpFeeTxBuilders[id] ?: throw Exception("BumpFeeTxBuilder not found")
                val wallet = getWalletById(walletId)
                val result = builder.finish(wallet)
                promise.resolve(result.serialize()) // Resolve with the serialized result
            } catch (error: Throwable) {
                promise.reject("BumpFee TxBuilder finish error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    /** TxBuilder methods ends */

    /** Descriptor Templates method starts */
    @ReactMethod
    fun createDescriptor(descriptor: String, network: String, result: Promise) {
        Thread {
            try {
                val id = getAndStoreObject(_descriptors) { Descriptor(descriptor, setNetwork(network)) }
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create Descriptor error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorAsString(descriptorId: String, result: Promise) {
        Thread {
            result.resolve(_descriptors[descriptorId]!!.asString())
        }.start()
    }

    @ReactMethod
    fun descriptorAsStringPrivate(descriptorId: String, result: Promise) {
        Thread {
            result.resolve(_descriptors[descriptorId]!!.asStringPrivate())
        }.start()
    }

    @ReactMethod
    fun newBip44(secretKeyId: String, keychain: String, network: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip44(
                    _descriptorSecretKeys[secretKeyId]!!,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip44 error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip44Public(
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        result: Promise
    ) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip44Public(
                    _descriptorPublicKeys[publicKeyId]!!,
                    fingerprint,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip44Public error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip49(secretKeyId: String, keychain: String, network: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip49(
                    _descriptorSecretKeys[secretKeyId]!!,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip49 error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip49Public(
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        result: Promise
    ) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip49Public(
                    _descriptorPublicKeys[publicKeyId]!!,
                    fingerprint,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip49Public error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip84(secretKeyId: String, keychain: String, network: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip84(
                    _descriptorSecretKeys[secretKeyId]!!,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip84 error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip84Public(
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        result: Promise
    ) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip84Public(
                    _descriptorPublicKeys[publicKeyId]!!,
                    fingerprint,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip84Public error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip86(secretKeyId: String, keychain: String, network: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip86(
                    _descriptorSecretKeys[secretKeyId]!!,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip86 error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip86Public(
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        result: Promise
    ) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip86Public(
                    _descriptorPublicKeys[publicKeyId]!!,
                    fingerprint,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip86Public error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Descriptor Templates method ends */

    /** Psbt method starts */
    @ReactMethod
    fun extractTx(base64: String, promise: Promise) {
        Thread {
            try {
                val id = randomId()
                _transactions[id] = Psbt(base64).extractTx()
                promise.resolve(id)
            } catch (error: Throwable) {
                promise.reject("PSBT extract error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun serialize(base64: String, promise: Promise) {
        Thread {
            try {
                val hex = Psbt(base64).serialize()
                promise.resolve(hex)
            } catch (error: Throwable) {
                promise.reject("Bump TX finish error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun txid(base64: String, promise: Promise) {
        Thread {
            try {
                val txid = Psbt(base64).extractTx().txid()
                promise.resolve(txid)
            } catch (error: Throwable) {
                promise.reject("PSBT txid error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Psbt method ends */

    /** BumpFeeTxBuilder methods starts */
    @ReactMethod
    fun bumpFeeTxBuilderInit(txid: String, newFeeRate: Double, promise: Promise) {
        Thread {
            try {
                val id = randomId()
                val feeRate = FeeRate.fromSatPerVb(newFeeRate.toLong().toULong())
                _bumpFeeTxBuilders[id] = BumpFeeTxBuilder(txid, feeRate)
                promise.resolve(id)
            } catch (error: Throwable) {
                promise.reject("BumpFeeTxBuilder init error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun bumpFeeTxBuilderEnableRbf(id: String, promise: Promise) {
        Thread {
            try {
                val builder = _bumpFeeTxBuilders[id] ?: throw Exception("BumpFeeTxBuilder not found")
                _bumpFeeTxBuilders[id] = builder.enableRbf()
                promise.resolve(true)
            } catch (error: Throwable) {
                promise.reject("BumpFeeTxBuilder enable RBF error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun bumpFeeTxBuilderEnableRbfWithSequence(id: String, nSequence: Double, promise: Promise) {
        Thread {
            try {
                val builder = _bumpFeeTxBuilders[id] ?: throw Exception("BumpFeeTxBuilder not found")
                _bumpFeeTxBuilders[id] = builder.enableRbfWithSequence(nSequence.toUInt())
                promise.resolve(true)
            } catch (error: Throwable) {
                promise.reject("BumpFeeTxBuilder enable RBF with sequence error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun bumpFeeTxBuilderFinish(id: String, walletId: String, promise: Promise) {
        Thread {
            try {
                val builder = _bumpFeeTxBuilders[id] ?: throw Exception("BumpFeeTxBuilder not found")
                val wallet = getWalletById(walletId)
                val result = builder.finish(wallet)
                promise.resolve(result.serialize())
            } catch (error: Throwable) {
                promise.reject("BumpFee TxBuilder finish error", error.localizedMessage, error)
            }
        }.start()
    }
    /** BumpFeeTxBuilder methods ends */

    /** Transaction methods starts*/
    @ReactMethod
    fun createTransaction(bytes: ReadableArray, result: Promise) {
        Thread {
            try {
                val id = randomId()
                val txBytes = getTxBytes(bytes)
                _transactions[id] = Transaction(txBytes)
                result.resolve(id) // Resolve with the transaction ID
            } catch (error: Throwable) {
                result.reject("Transaction creation error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun serializeTransaction(id: String, result: Promise) {
        Thread {
            val uBytes = _transactions[id]!!.serialize()
            result.resolve(makeNativeArray(uBytes)) // Resolve with the serialized transaction
        }.start()
    }

    @ReactMethod
    fun transactionTxid(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.txid()) // Resolve with the transaction ID
        }.start()
    }

    @ReactMethod
    fun txWeight(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.weight().toDouble()) // Resolve with the weight
        }.start()
    }

    @ReactMethod
    fun txSize(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.totalSize().toDouble()) // Resolve with the size
        }.start()
    }

    @ReactMethod
    fun txVsize(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.vsize().toDouble()) // Resolve with the virtual size
        }.start()
    }

    @ReactMethod
    fun txIsCoinBase(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.isCoinbase()) // Resolve with the coinbase status
        }.start()
    }

    @ReactMethod
    fun txIsExplicitlyRbf(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.isExplicitlyRbf()) // Resolve with the RBF status
        }.start()
    }

    @ReactMethod
    fun txIsLockTimeEnabled(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.isLockTimeEnabled()) // Resolve with the lock time status
        }.start()
    }

    @ReactMethod
    fun txVersion(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.version()) // Resolve with the transaction version
        }.start()
    }

    @ReactMethod
    fun txLockTime(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.lockTime().toInt()) // Resolve with the lock time
        }.start()
    }

    @ReactMethod
    fun txInput(id: String, result: Promise) {
        Thread {
            val items = _transactions[id]!!.input()
            val list: MutableList<Map<String, Any?>> = mutableListOf()
            for (item in items) {
                list.add(createTxIn(item, _scripts))
            }
            result.resolve(Arguments.makeNativeArray(list)) // Resolve with the input list
        }.start()
    }

    @ReactMethod
    fun txOutput(id: String, result: Promise) {
        Thread {
            val items = _transactions[id]!!.output()
            val list: MutableList<Map<String, Any?>> = mutableListOf()
            for (item in items) {
                list.add(createTxOut(item, _scripts))
            }
            result.resolve(Arguments.makeNativeArray(list)) // Resolve with the output list
        }.start()
    }
    /** Transaction methods ends*/

    /** ChainPosition methods starts */
    @ReactMethod
    fun createChainPosition(position: ReadableMap, result: Promise) {
        Thread {
            try {
                val chainPosition: ChainPosition

                val height = position.getInt("height")
                val timestamp = position.getInt("timestamp")

                chainPosition = if (height != null && timestamp != null) {
                    ChainPosition.Confirmed(height.toUInt(), timestamp.toULong())
                } else if (timestamp != null) {
                    ChainPosition.Unconfirmed(timestamp.toULong())
                } else {
                    throw Exception("Invalid chain position data")
                }

                val id = randomId()
                // Store the chainPosition in a map if needed for later use
                // _chainPositions[id] = chainPosition

                result.resolve(id) // Resolve with the chain position ID
            } catch (error: Throwable) {
                result.reject("ChainPosition error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun getChainPositionType(id: String, result: Promise) {
        Thread {
            try {
                // Retrieve the chainPosition from the map if you stored it
                // val chainPosition = _chainPositions[id] ?: throw Exception("ChainPosition not found")

                // For demonstration, we'll use a mock chainPosition
                val mockChainPosition: ChainPosition = ChainPosition.Confirmed(100u, 1234567890u)

                val type = when (mockChainPosition) {
                    is ChainPosition.Confirmed -> "confirmed"
                    is ChainPosition.Unconfirmed -> "unconfirmed"
                    // Ensure to handle all cases
                }

                result.resolve(type) // Resolve with the chain position type
            } catch (error: Throwable) {
                result.reject("ChainPosition error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun getChainPositionData(id: String, result: Promise) {
        Thread {
            try {
                // Retrieve the chainPosition from the map if you stored it
                // val chainPosition = _chainPositions[id] ?: throw Exception("ChainPosition not found")

                // For demonstration, we'll use a mock chainPosition
                val mockChainPosition: ChainPosition = ChainPosition.Confirmed(100u, 1234567890u)

                val data = when (mockChainPosition) {
                    is ChainPosition.Confirmed -> {
                        mapOf("height" to mockChainPosition.height, "timestamp" to mockChainPosition.timestamp)
                    }
                    is ChainPosition.Unconfirmed -> {
                        mapOf("timestamp" to mockChainPosition.timestamp)
                    }
                    // Ensure to handle all cases
                }

                result.resolve(data) // Resolve with the chain position data
            } catch (error: Throwable) {
                result.reject("ChainPosition error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }
    /** ChainPosition methods ends */

    /** Script methods starts*/
    @ReactMethod
    fun toBytes(id: String, result: Promise) {
        Thread {
            result.resolve(makeNativeArray(_scripts[id]!!.toBytes())) // Resolve with the byte array
        }.start()
    }
    /** Script methods ends*/

    /** FullScanRequest methods starts */

    @ReactMethod
    fun createFullScanRequest(walletId: String, promise: Promise) {
        Thread {
            val wallet = _wallets[walletId]
            if (wallet == null) {
                runOnUiThread {
                    promise.reject("Invalid wallet", "Wallet not found", null) // Reject if wallet not found
                }
                return@Thread
            }

            try {
                val fullScanRequest = wallet.startFullScan() // Assuming this method exists in your Wallet class
                val id = randomId()
                _fullScanRequests[id] = fullScanRequest
                runOnUiThread {
                    promise.resolve(id) // Resolve with the full scan request ID
                }
            } catch (error: Throwable) {
                runOnUiThread {
                    promise.reject("FullScanRequest creation error", error.localizedMessage, error) // Reject with error
                }
            }
        }.start()
    }

    @ReactMethod
    fun freeFullScanRequest(id: String, promise: Promise) {
        Thread {
            _fullScanRequests.remove(id)
            runOnUiThread {
                promise.resolve(null) // Resolve with no value
            }
        }.start()
    }

    /** FullScanRequest methods ends */

    /** SentAndRecievedValues methods starts  */

    @ReactMethod
    fun createSentAndReceivedValues(sent: Amount, received: Amount, promise: Promise) {
        Thread {
            val values = SentAndReceivedValues(sent, received)
            promise.resolve(values) // Resolve with the values
        }.start()
    }

    @ReactMethod
    fun freeSentAndReceivedValues(values: SentAndReceivedValues, promise: Promise) {
        Thread {
            // Freeing logic if needed
            promise.resolve(null) // Resolve with no value
        }.start()
    }

    /** SentAndReceivedValues methods ends */

    /** CanonicalTx methods starts */

       @ReactMethod
    fun createCanonicalTx(
        transactionId: String,
        chainPositionId: String,
        promise: Promise
    ) {
        Thread {
            try {
                val transaction = getTransactionById(transactionId)
                val chainPosition = getChainPositionById(chainPositionId)

                val canonicalTx = CanonicalTx(transaction, chainPosition)
                val canonicalTxId = randomId()
                _canonicalTxs[canonicalTxId] = canonicalTx

                promise.resolve(canonicalTxId) // Resolve with the canonical transaction ID
            } catch (error: Throwable) {
                promise.reject("Create CanonicalTx error", error.localizedMessage, error) // Reject with error
            }
        }.start()
    }

    @ReactMethod
    fun getCanonicalTxById(
        id: String,
        promise: Promise
    ) {
        Thread {
            val canonicalTx = _canonicalTxs[id]
            if (canonicalTx == null) {
                promise.reject("Get CanonicalTx error", "CanonicalTx not found") // Reject if not found
                return@Thread
            }

            val result = mapOf(
                "transaction" to canonicalTx.transaction,
                "chainPosition" to canonicalTx.chainPosition
            )

            promise.resolve(result) // Resolve with the canonical transaction data
        }.start()
    }

    /** CanonicalTx methods ends */

}


