package io.ltbl.bdkrn

import com.facebook.react.bridge.*
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

class BdkRnModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BdkRnModule"
    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }

    private var _descriptorSecretKeys = mutableMapOf<String, DescriptorSecretKey>()
    private var _descriptorPublicKeys = mutableMapOf<String, DescriptorPublicKey>()
    private var _blockChains = mutableMapOf<String, Blockchain>()

    private var _wallets = mutableMapOf<String, Wallet>()
    private var _addresses = mutableMapOf<String, Address>()
    private var _scripts = mutableMapOf<String, Script>()
    private var _txBuilders = mutableMapOf<String, TxBuilder>()
    private var _descriptors = mutableMapOf<String, Descriptor>()

    private var _derivationPaths = mutableMapOf<String, DerivationPath>()
    private var _databaseConfigs = mutableMapOf<String, DatabaseConfig>()
    private var _bumpFeeTxBuilders = mutableMapOf<String, BumpFeeTxBuilder>()
    private var _transactions = mutableMapOf<String, Transaction>()


    /** Mnemonic methods starts */
    @ReactMethod
    fun generateSeedFromWordCount(wordCount: Int, result: Promise) {
        Thread {
            val response = Mnemonic(setWordCount(wordCount))
            result.resolve(response.asString())
        }.start()
    }

    @ReactMethod
    fun generateSeedFromString(mnemonic: String, result: Promise) {
        Thread {
            try {
                val response = Mnemonic.fromString(mnemonic)
                result.resolve(response.asString())
            } catch (error: Throwable) {
                result.reject("Generate seed error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun generateSeedFromEntropy(entropy: ReadableArray, result: Promise) {
        Thread {
            try {
                val response = Mnemonic.fromEntropy(getEntropy(entropy))
                result.resolve(response.asString())
            } catch (error: Throwable) {
                result.reject("Generate seed error", error.localizedMessage, error)
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
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create Derivation path error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Derviation path methods ends */

    /** Descriptor secret key methods starts */
    @ReactMethod
    fun createDescriptorSecret(
        network: String, mnemonic: String, password: String? = null, result: Promise
    ) {
        Thread {
            try {
                val id = randomId()
                _descriptorSecretKeys[id] =
                    DescriptorSecretKey(
                        setNetwork(network),
                        Mnemonic.fromString(mnemonic),
                        password
                    )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("DescriptorSecret create error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretDerive(secretKeyId: String, derivationPathId: String, result: Promise) {
        Thread {
            try {
                val keyInfo =
                    _descriptorSecretKeys[secretKeyId]!!.derive(_derivationPaths[derivationPathId]!!)
                result.resolve(keyInfo.asString())
            } catch (error: Throwable) {
                result.reject("DescriptorSecret derive error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretExtend(secretKeyId: String, derivationPathId: String, result: Promise) {
        Thread {
            try {
                val keyInfo =
                    _descriptorSecretKeys[secretKeyId]!!.extend(_derivationPaths[derivationPathId]!!)
                result.resolve(keyInfo.asString())
            } catch (error: Throwable) {
                result.reject("DescriptorSecret extend error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretAsPublic(secretKeyId: String, result: Promise) {
        Thread {
            val id = randomId()
            _descriptorPublicKeys[id] = _descriptorSecretKeys[secretKeyId]!!.asPublic()
            result.resolve(id)
        }.start()
    }

    @ReactMethod
    fun descriptorSecretAsString(secretKeyId: String, result: Promise) {
        Thread {
            result.resolve(_descriptorSecretKeys[secretKeyId]!!.asString())
        }.start()
    }

    @ReactMethod
    fun descriptorSecretAsSecretBytes(secretKeyId: String, result: Promise) {
        Thread {
            val secretBytes = _descriptorSecretKeys[secretKeyId]!!.secretBytes()
            result.resolve(makeNativeArray(secretBytes))
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
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("DescriptorPublic create error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorPublicDerive(publicKeyId: String, derivationPathId: String, result: Promise) {
        Thread {
            try {
                val keyInfo =
                    _descriptorPublicKeys[publicKeyId]!!.derive(_derivationPaths[derivationPathId]!!)
                result.resolve(keyInfo.asString())
            } catch (error: Throwable) {
                result.reject("DescriptorPublic derive error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorPublicExtend(publicKeyId: String, derivationPathId: String, result: Promise) {
        Thread {
            try {
                val keyInfo =
                    _descriptorPublicKeys[publicKeyId]!!.extend(_derivationPaths[derivationPathId]!!)
                result.resolve(keyInfo.asString())
            } catch (error: Throwable) {
                result.reject("DescriptorPublic extend error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorPublicAsString(publicKeyId: String, result: Promise) {
        Thread {
            result.resolve(_descriptorPublicKeys[publicKeyId]!!.asString())
        }.start()
    }

    /** Descriptor public key methods ends */

    /** Blockchain methods starts */
    private fun getBlockchainById(id: String): Blockchain {
        return _blockChains[id]!!
    }

    @ReactMethod
    fun initElectrumBlockchain(
        url: String,
        sock5: String?,
        retry: Int,
        timeout: Int,
        stopGap: Int,
        validateDomain: Boolean,
        result: Promise
    ) {
        Thread {
            try {
                val _blockchainConfig = BlockchainConfig.Electrum(
                    ElectrumConfig(
                        url,
                        sock5 ?: null,
                        retry.toUByte(),
                        timeout.toUByte(),
                        stopGap.toULong(),
                        validateDomain
                    )
                )
                val blockChainId = randomId()
                _blockChains[blockChainId] = Blockchain(_blockchainConfig)
                result.resolve(blockChainId)
            } catch (error: Throwable) {
                result.reject("BlockchainElectrum init error", error.localizedMessage, error)
            }
        }.start()
    }


    @ReactMethod
    fun initEsploraBlockchain(
        baseUrl: String,
        proxy: String?,
        concurrency: Int,
        stopGap: Int,
        timeout: Int,
        result: Promise
    ) {
        Thread {
            try {
                val _blockchainConfig = BlockchainConfig.Esplora(
                    EsploraConfig(
                        baseUrl,
                        proxy ?: null,
                        concurrency.toUByte(),
                        stopGap.toULong(),
                        timeout.toULong(),
                    )
                )
                val blockChainId = randomId()
                _blockChains[blockChainId] = Blockchain(_blockchainConfig)
                result.resolve(blockChainId)
            } catch (error: Throwable) {
                result.reject("BlockchainEsplora init error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun initRpcBlockchain(config: ReadableMap, result: Promise) {
        Thread {
            try {
                var authType: Auth = Auth.None
                if (config.getString("authCookie") != null) {
                    authType = Auth.Cookie(config.getString("authCookie")!!)
                }

                if (config.getMap("authUserPass") != null) {
                    val userPass = config.getMap("authUserPass") as ReadableMap
                    authType = Auth.UserPass(
                        userPass.getString("username")!!,
                        userPass.getString("password")!!
                    )
                }
                var syncParams: RpcSyncParams? = null
                if (config.getMap("syncParams") != null) {
                    val syncParamsConfig = config.getMap("syncParams") as ReadableMap
                    syncParams = RpcSyncParams(
                        syncParamsConfig.getInt("startScriptCount").toULong()!!,
                        syncParamsConfig.getInt("startTime").toULong()!!,
                        syncParamsConfig.getBoolean("forceStartTime"),
                        syncParamsConfig.getInt("pollRateSec").toULong()!!,
                    )
                }

                val _blockchainConfig = BlockchainConfig.Rpc(
                    RpcConfig(
                        config.getString("url")!!,
                        authType,
                        setNetwork(config.getString("network")!!),
                        config.getString("walletName")!!,
                        syncParams
                    )
                )
                val blockChainId = randomId()
                _blockChains[blockChainId] = Blockchain(_blockchainConfig)
                result.resolve(blockChainId)
            } catch (error: Throwable) {
                result.reject("BlockchainRpc init error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBlockchainHeight(id: String, result: Promise) {
        Thread {
            try {
                result.resolve(getBlockchainById(id).getHeight().toInt())
            } catch (error: Throwable) {
                result.reject("Blockchain get height error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBlockchainHash(id: String, height: Int, result: Promise) {
        Thread {
            try {
                result.resolve(getBlockchainById(id).getBlockHash(height.toUInt()))
            } catch (error: Throwable) {
                result.reject(
                    "Blockchain get block hash error",
                    error.localizedMessage,
                    error
                )
            }
        }.start()
    }

    @ReactMethod
    fun broadcast(id: String, txId: String, result: Promise) {
        Thread {
            try {
                getBlockchainById(id).broadcast(_transactions[txId]!!)
                result.resolve(true)
            } catch (error: Throwable) {
                result.reject("Broadcast transaction error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun estimateFee(id: String, target: Int, result: Promise) {
        Thread {
            try {
                val fee = getBlockchainById(id).estimateFee(target.toULong())
                result.resolve(fee.asSatPerVb())
            } catch (error: Throwable) {
                result.reject("Estimate Fee error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Blockchain methods ends */


    /** DB configuration methods starts*/
    @ReactMethod
    fun memoryDBInit(result: Promise) {
        Thread {
            val id = randomId()
            _databaseConfigs[id] = DatabaseConfig.Memory
            result.resolve(id)
        }.start()
    }

    @ReactMethod
    fun sledDBInit(path: String, treeName: String, result: Promise) {
        Thread {
            val id = randomId()
            _databaseConfigs[id] = DatabaseConfig.Sled(SledDbConfiguration(path, treeName))
            result.resolve(id)
        }.start()
    }

    @ReactMethod
    fun sqliteDBInit(path: String, result: Promise) {
        Thread {
            val id = randomId()
            _databaseConfigs[id] = DatabaseConfig.Sqlite(SqliteDbConfiguration(path))
            result.resolve(id)
        }.start()
    }
    /** DB configuration methods ends*/


    /** Wallet methods starts*/
    private fun getWalletById(id: String): Wallet {
        return _wallets[id]!!
    }

    @ReactMethod
    fun walletInit(
        descriptor: String,
        changeDescriptor: String? = null,
        network: String,
        dbConfigID: String,
        result: Promise
    ) {
        Thread {
            try {
                val id = randomId()
                _wallets[id] = Wallet(
                    _descriptors[descriptor]!!,
                    if (changeDescriptor != null) _descriptors[changeDescriptor]!! else null,
                    setNetwork(network),
                    _databaseConfigs[dbConfigID]!!
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Init wallet error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun sync(id: String, blockChainId: String, result: Promise) {
        Thread {
            try {
                getWalletById(id).sync(getBlockchainById(blockChainId), BdkProgress)
                result.resolve(true)
            } catch (error: Throwable) {
                result.reject("Sync wallet error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getAddress(id: String, addressIndex: Dynamic, result: Promise) {
        Thread {
            try {
                val randomId = randomId()

                var resolvedIndex: Any = "new"
                when (val type = addressIndex.getType()) {
                    ReadableType.String -> {
                        resolvedIndex = (addressIndex as Dynamic).asString() ?: "new"
                    }
                    ReadableType.Number -> {
                        resolvedIndex = (addressIndex as Dynamic).asDouble() ?: "new"
                    }
                    else -> {
                        resolvedIndex = setAddressIndex("new")
                    }
                }

                val addressInfo = getWalletById(id).getAddress(setAddressIndex(resolvedIndex))
                _addresses[randomId] = addressInfo.address
                val responseObject = mutableMapOf<String, Any?>()
                responseObject["index"] = addressInfo.index.toInt()
                responseObject["address"] = randomId
                responseObject["keychain"] = addressInfo.keychain.toString()
                result.resolve(Arguments.makeNativeMap(responseObject))
            } catch (error: Throwable) {
                result.reject("Get wallet address error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getInternalAddress(id: String, addressIndex: Dynamic, result: Promise) {
        Thread {
            try {
                val randomId = randomId()
                var resolvedIndex: Any = "new"
                when (val type = addressIndex.getType()) {
                    ReadableType.String -> {
                        resolvedIndex = (addressIndex as Dynamic).asString() ?: "new"
                    }
                    ReadableType.Number -> {
                        resolvedIndex = (addressIndex as Dynamic).asDouble() ?: "new"
                    }
                    else -> {
                        resolvedIndex = setAddressIndex("new")
                    }
                }

                val addressInfo = getWalletById(id).getAddress(setAddressIndex(resolvedIndex))
                _addresses[randomId] = addressInfo.address
                val responseObject = mutableMapOf<String, Any?>()
                responseObject["index"] = addressInfo.index.toInt()
                responseObject["address"] = randomId
                responseObject["keychain"] = addressInfo.keychain.toString()
                result.resolve(Arguments.makeNativeMap(responseObject))
            } catch (error: Throwable) {
                result.reject("Get internal address error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun isMine(id: String, scriptId: String, result: Promise) {
        Thread {
            try {
                result.resolve(getWalletById(id).isMine(_scripts[scriptId]!!))
            } catch (error: Throwable) {
                result.reject("Get isMine error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBalance(id: String, result: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                val responseObject = mutableMapOf<String, Any?>()
                responseObject["trustedPending"] = balance.trustedPending.toDouble()
                responseObject["untrustedPending"] = balance.untrustedPending.toDouble()
                responseObject["confirmed"] = balance.confirmed.toDouble()
                responseObject["spendable"] = balance.spendable.toDouble()
                responseObject["total"] = balance.total.toDouble()
                result.resolve(Arguments.makeNativeMap(responseObject))
            } catch (error: Throwable) {
                result.reject("Get wallet balance error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getNetwork(id: String, result: Promise) {
        Thread {
            val network = getWalletById(id).network()
            result.resolve(getNetworkString(network))
        }.start()
    }

    @ReactMethod
    fun listUnspent(id: String, result: Promise) {
        Thread {
            try {
                val unspentList = getWalletById(id).listUnspent()
                val unpents: MutableList<Map<String, Any?>> = mutableListOf()
                for (item in unspentList) {
                    val unspentObject = mutableMapOf<String, Any?>()
                    unspentObject["outpoint"] = getOutPoint(item.outpoint)
                    unspentObject["txout"] = createTxOut(item.txout, _scripts)
                    unspentObject["isSpent"] = item.isSpent
                    unspentObject["keychain"] = item.keychain.toString()
                    unpents.add(unspentObject)
                }
                result.resolve(Arguments.makeNativeArray(unpents))
            } catch (error: Throwable) {
                result.reject("List unspent outputs error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun listTransactions(id: String, includeRaw: Boolean, result: Promise) {
        Thread {
            try {
                val list = getWalletById(id).listTransactions(includeRaw)
                val transactions: MutableList<Map<String, Any?>> = mutableListOf()
                for (item in list) {
                    var txObject = getTransactionObject(item)
                    if (item.transaction != null) {
                        val randomId = randomId()
                        _transactions[randomId] = item.transaction!!
                        txObject["transaction"] = randomId
                    } else {
                        txObject["transaction"] = false
                    }
                    transactions.add(txObject)
                }
                result.resolve(Arguments.makeNativeArray(transactions))
            } catch (error: Throwable) {
                result.reject("List transactions error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun sign(id: String, psbtBase64: String, signOptions: ReadableMap? = null, result: Promise) {
        Thread {
            try {
                var options: SignOptions? = null
                if (signOptions != null) options = createSignOptions(signOptions)

                val psbt = PartiallySignedTransaction(psbtBase64)
                getWalletById(id).sign(psbt, options)
                result.resolve(psbt.serialize())
            } catch (error: Throwable) {
                result.reject("Sign PSBT error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Wallet methods ends*/


    /** Address methods starts*/
    @ReactMethod
    fun initAddress(address: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _addresses[id] = Address(address)
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Address error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun addressFromScript(scriptId: String, network: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _addresses[id] = Address.fromScript(_scripts[scriptId]!!, setNetwork(network))
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Address from script error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun addressToScriptPubkeyHex(id: String, result: Promise) {
        Thread {
            val scriptId = randomId()
            _scripts[scriptId] = _addresses[id]!!.scriptPubkey()
            result.resolve(scriptId)
        }.start()
    }

    @ReactMethod
    fun addressPayload(id: String, result: Promise) {
        Thread {
            val pay = _addresses[id]!!.payload()
            result.resolve(Arguments.makeNativeMap(getPayload(pay)))
        }.start()
    }

    @ReactMethod
    fun addressNetwork(id: String, result: Promise) {
        Thread {
            result.resolve(getNetworkString(_addresses[id]!!.network()))
        }.start()
    }

    @ReactMethod
    fun addressToQrUri(id: String, result: Promise) {
        Thread {
            result.resolve(_addresses[id]!!.toQrUri())
        }.start()
    }

    @ReactMethod
    fun addressAsString(id: String, result: Promise) {
        Thread {
            try {
                result.resolve(_addresses[id]!!.asString())
            } catch (error: Throwable) {
                result.reject("Couldn't parse address string", error.localizedMessage, error)
            }
        }.start()
    }

    /** Address methods ends*/


    /** TxBuilder methods starts */
    @ReactMethod
    fun createTxBuilder(result: Promise) {
        Thread {
            val id = randomId()
            _txBuilders[id] = TxBuilder()
            result.resolve(id)
        }.start()
    }

    @ReactMethod
    fun addRecipient(id: String, scriptId: String, amount: Int, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.addRecipient(_scripts[scriptId]!!, amount.toULong())
            result.resolve(true)
        }.start()
    }


    // `addUnspendable`
    @ReactMethod
    fun addUnspendable(id: String, outPoint: ReadableMap, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.addUnspendable(createOutPoint(outPoint))
            result.resolve(true)
        }.start()
    }

    // `addUtxo`
    @ReactMethod
    fun addUtxo(id: String, outPoint: ReadableMap, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.addUtxo(createOutPoint(outPoint))
            result.resolve(true)
        }.start()
    }

    // `addUtxos`
    @ReactMethod
    fun addUtxos(id: String, outPoints: ReadableArray, result: Promise) {
        Thread {
            val mappedOutPoints: MutableList<OutPoint> = mutableListOf()
            for (i in 0 until outPoints.size())
                mappedOutPoints.add(createOutPoint(outPoints.getMap(i)))
            _txBuilders[id] = _txBuilders[id]!!.addUtxos(mappedOutPoints)
            result.resolve(true)
        }.start()
    }

    // `doNotSpendChange`
    @ReactMethod
    fun doNotSpendChange(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.doNotSpendChange()
            result.resolve(true)
        }.start()
    }

    // `manuallySelectedOnly`
    @ReactMethod
    fun manuallySelectedOnly(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.manuallySelectedOnly()
            result.resolve(true)
        }.start()
    }

    // `onlySpendChange`
    @ReactMethod
    fun onlySpendChange(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.onlySpendChange()
            result.resolve(true)
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
            result.resolve(true)
        }.start()
    }

    // `feeRate`
    @ReactMethod
    fun feeRate(id: String, feeRate: Int, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.feeRate(feeRate.toFloat())
            result.resolve(true)
        }.start()
    }

    // `feeAbsolute`
    @ReactMethod
    fun feeAbsolute(id: String, feeRate: Int, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.feeAbsolute(feeRate.toULong())
            result.resolve(true)
        }.start()
    }

    // `drainWallet`
    @ReactMethod
    fun drainWallet(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.drainWallet()
            result.resolve(true)
        }.start()
    }

    // `drainTo`
    @ReactMethod
    fun drainTo(id: String, scriptId: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.drainTo(_scripts[scriptId]!!)
            result.resolve(true)
        }.start()
    }

    // `enableRbf`
    @ReactMethod
    fun enableRbf(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.enableRbf()
            result.resolve(true)
        }.start()
    }

    // `enableRbfWithSequence`
    @ReactMethod
    fun enableRbfWithSequence(id: String, nsequence: Int, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.enableRbfWithSequence(nsequence.toUInt())
            result.resolve(true)
        }.start()
    }

    // `addData`
    @ReactMethod
    fun addData(id: String, data: ReadableArray, result: Promise) {
        Thread {
            var dataList: MutableList<UByte> = mutableListOf<UByte>()
            for (i in 0 until data.size()) dataList.add(data.getInt(i).toUByte())
            _txBuilders[id] = _txBuilders[id]!!.addData(dataList)
            result.resolve(true)
        }.start()
    }

    // `setRecipients`
    @ReactMethod
    fun setRecipients(id: String, recipients: ReadableArray, result: Promise) {
        Thread {
            var scriptAmounts: MutableList<ScriptAmount> = mutableListOf()
            for (i in 0 until recipients.size()) {
                val item = recipients.getMap(i)
                val amount = item.getInt("amount").toULong()
                val scriptId = item.getMap("script")!!.getString("id")
                val scriptAmount = ScriptAmount(_scripts[scriptId]!!, amount)
                scriptAmounts.add(scriptAmount)
            }
            _txBuilders[id] = _txBuilders[id]!!.setRecipients(scriptAmounts)
            result.resolve(true)
        }.start()
    }

    @ReactMethod
    fun finish(id: String, walletId: String, result: Promise) {
        Thread {
            try {
                val details = _txBuilders[id]?.finish(getWalletById(walletId))
                val responseObject = getPSBTObject(details)
                result.resolve(Arguments.makeNativeMap(responseObject))
            } catch (error: Throwable) {
                result.reject("Finish tx error", error.localizedMessage, error)
            }
        }.start()
    }
    /** TxBuilder methods ends */

    /** Descriptor Templates method starts */
    @ReactMethod
    fun createDescriptor(descriptor: String, network: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = Descriptor(descriptor, setNetwork(network))
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
        try {
            Thread {
                val id = randomId()
                _descriptors[id] = newBip86(
                    _descriptorSecretKeys[secretKeyId]!!,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            }.start()
        } catch (error: Throwable) {
            result.reject("Create bip86 error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun newBip86Public(
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        result: Promise
    ) {
        try {
            Thread {
                val id = randomId()
                _descriptors[id] = newBip86Public(
                    _descriptorPublicKeys[publicKeyId]!!,
                    fingerprint,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            }.start()
        } catch (error: Throwable) {
            result.reject("Create bip86Public error", error.localizedMessage, error)
        }
    }
    /** Descriptor Templates method ends */

    /** PartiallySignedTransaction method starts */
    @ReactMethod
    fun combine(base64: String, other: String, result: Promise) {
        Thread {
            try {
                val newPsbt =
                    PartiallySignedTransaction(base64).combine(PartiallySignedTransaction(other))
                result.resolve(newPsbt.serialize())
            } catch (error: Throwable) {
                result.reject("PSBT combine error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun extractTx(base64: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _transactions[id] = PartiallySignedTransaction(base64).extractTx()
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("PSBT extract error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun serialize(base64: String, result: Promise) {
        Thread {
            try {
                val bytes = PartiallySignedTransaction(base64).serialize();
                result.resolve(bytes)
            } catch (error: Throwable) {
                result.reject("PSBT serialize error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun txid(base64: String, result: Promise) {
        Thread {
            try {
                result.resolve(PartiallySignedTransaction(base64).txid())
            } catch (error: Throwable) {
                result.reject("PSBT txid error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun feeAmount(base64: String, result: Promise) {
        Thread {
            try {
                result.resolve(PartiallySignedTransaction(base64).feeAmount()!!.toDouble())
            } catch (error: Throwable) {
                result.reject("PSBT feeAmount error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun psbtFeeRate(base64: String, result: Promise) {
        Thread {
            try {
                result.resolve(PartiallySignedTransaction(base64).feeRate()!!.asSatPerVb())
            } catch (error: Throwable) {
                result.reject("PSBT feeRate error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun jsonSerialize(base64: String, result: Promise) {
        Thread {
            try {
                result.resolve(PartiallySignedTransaction(base64).jsonSerialize())
            } catch (error: Throwable) {
                result.reject("PSBT jsonSerialize error", error.localizedMessage, error)
            }
        }.start()
    }
    /** PartiallySignedTransaction method ends */

    /** BumpFeeTxBuilder methods starts*/
    @ReactMethod
    fun bumpFeeTxBuilderInit(txid: String, newFeeRate: Int, result: Promise) {
        Thread {
            val id = randomId()
            _bumpFeeTxBuilders[id] = BumpFeeTxBuilder(txid, newFeeRate.toFloat())
            result.resolve(id)
        }.start()
    }

    @ReactMethod
    fun bumpFeeTxBuilderAllowShrinking(id: String, address: String, result: Promise) {
        Thread {
            _bumpFeeTxBuilders[id] = _bumpFeeTxBuilders[id]!!.allowShrinking(address)
            result.resolve(true)
        }.start()
    }

    @ReactMethod
    fun bumpFeeTxBuilderEnableRbf(id: String, result: Promise) {
        Thread {
            _bumpFeeTxBuilders[id] = _bumpFeeTxBuilders[id]!!.enableRbf()
            result.resolve(true)
        }.start()
    }

    @ReactMethod
    fun bumpFeeTxBuilderEnableRbfWithSequence(id: String, nSequence: Int, result: Promise) {
        Thread {
            _bumpFeeTxBuilders[id] =
                _bumpFeeTxBuilders[id]!!.enableRbfWithSequence(nSequence.toUInt())
            result.resolve(true)
        }.start()
    }

    @ReactMethod
    fun bumpFeeTxBuilderFinish(id: String, walletId: String, result: Promise) {
        Thread {
            try {
                val res = _bumpFeeTxBuilders[id]!!.finish(getWalletById(walletId))
                result.resolve(res.serialize())
            } catch (error: Throwable) {
                result.reject("BumpFee Txbuilder finish error", error.localizedMessage, error)
            }
        }.start()
    }
    /** BumpFeeTxBuilder methods ends*/

    /** Transaction methods starts*/
    @ReactMethod
    fun createTransaction(bytes: ReadableArray, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _transactions[id] = Transaction(getTxBytes(bytes))
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("BumpFee Txbuilder finish error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun serializeTransaction(id: String, result: Promise) {
        Thread {
            val uBytes = _transactions[id]!!.serialize()
            result.resolve(makeNativeArray(uBytes))
        }.start()
    }

    @ReactMethod
    fun transactionTxid(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.txid())
        }.start()
    }

    @ReactMethod
    fun txWeight(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.weight().toDouble())
        }.start()
    }

    @ReactMethod
    fun txSize(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.size().toDouble())
        }.start()
    }

    @ReactMethod
    fun txVsize(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.vsize().toDouble())
        }.start()
    }

    @ReactMethod
    fun txIsCoinBase(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.isCoinBase())
        }.start()
    }

    @ReactMethod
    fun txIsExplicitlyRbf(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.isExplicitlyRbf())
        }.start()
    }

    @ReactMethod
    fun txIsLockTimeEnabled(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.isLockTimeEnabled())
        }.start()
    }

    @ReactMethod
    fun txVersion(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.version())
        }.start()
    }

    @ReactMethod
    fun txLockTime(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.lockTime().toInt())
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
            result.resolve(Arguments.makeNativeArray(list))
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
            result.resolve(Arguments.makeNativeArray(list))
        }.start()
    }
    /** Transaction methods ends*/


    /** Script methods starts*/
    @ReactMethod
    fun toBytes(id: String, result: Promise) {
        Thread {
            result.resolve(makeNativeArray(_scripts[id]!!.toBytes()))
        }.start()
    }
    /** Script methods ends*/
}

