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
        val response = Mnemonic(setWordCount(wordCount))
        result.resolve(response.asString())
    }

    @ReactMethod
    fun generateSeedFromString(mnemonic: String, result: Promise) {
        try {
            val response = Mnemonic.fromString(mnemonic)
            result.resolve(response.asString())
        } catch (error: Throwable) {
            return result.reject("Generate seed error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun generateSeedFromEntropy(entropy: ReadableArray, result: Promise) {
        try {
            val response = Mnemonic.fromEntropy(getEntropy(entropy))
            result.resolve(response.asString())
        } catch (error: Throwable) {
            return result.reject("Generate seed error", error.localizedMessage, error)
        }
    }
    /** Mnemonic methods ends */

    /** Derviation path methods starts */
    @ReactMethod
    fun createDerivationPath(path: String, result: Promise) {
        try {
            val id = randomId()
            _derivationPaths[id] = DerivationPath(path)
            result.resolve(id)
        } catch (error: Throwable) {
            return result.reject("Create Derivation path error", error.localizedMessage, error)
        }
    }
    /** Derviation path methods ends */

    /** Descriptor secret key methods starts */
    @ReactMethod
    fun createDescriptorSecret(
        network: String, mnemonic: String, password: String? = null, result: Promise
    ) {
        try {
            val id = randomId()
            _descriptorSecretKeys[id] =
                DescriptorSecretKey(setNetwork(network), Mnemonic.fromString(mnemonic), password)
            result.resolve(id)
        } catch (error: Throwable) {
            return result.reject("DescriptorSecret create error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun descriptorSecretDerive(secretKeyId: String, derivationPathId: String, result: Promise) {
        try {
            val keyInfo =
                _descriptorSecretKeys[secretKeyId]!!.derive(_derivationPaths[derivationPathId]!!)
            result.resolve(keyInfo.asString())
        } catch (error: Throwable) {
            return result.reject("DescriptorSecret derive error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun descriptorSecretExtend(secretKeyId: String, derivationPathId: String, result: Promise) {
        try {
            val keyInfo =
                _descriptorSecretKeys[secretKeyId]!!.extend(_derivationPaths[derivationPathId]!!)
            result.resolve(keyInfo.asString())
        } catch (error: Throwable) {
            return result.reject("DescriptorSecret extend error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun descriptorSecretAsPublic(secretKeyId: String, result: Promise) {
        val id = randomId()
        _descriptorPublicKeys[id] = _descriptorSecretKeys[secretKeyId]!!.asPublic()
        result.resolve(id)
    }

    @ReactMethod
    fun descriptorSecretAsString(secretKeyId: String, result: Promise) {
        result.resolve(_descriptorSecretKeys[secretKeyId]!!.asString())
    }

    @ReactMethod
    fun descriptorSecretAsSecretBytes(secretKeyId: String, result: Promise) {
        val scretBytes = _descriptorSecretKeys[secretKeyId]!!.secretBytes()
        result.resolve(makeNativeArray(scretBytes))
    }
    /** Descriptor secret key methods ends */

    /** Descriptor public key methods starts */
    @ReactMethod
    fun createDescriptorPublic(publicKey: String, result: Promise) {
        try {
            val id = randomId()
            _descriptorPublicKeys[id] = DescriptorPublicKey.fromString(publicKey)
            result.resolve(id)
        } catch (error: Throwable) {
            return result.reject("DescriptorPublic create error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun descriptorPublicDerive(publicKeyId: String, derivationPathId: String, result: Promise) {
        try {
            val keyInfo =
                _descriptorPublicKeys[publicKeyId]!!.derive(_derivationPaths[derivationPathId]!!)
            result.resolve(keyInfo.asString())
        } catch (error: Throwable) {
            return result.reject("DescriptorPublic derive error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun descriptorPublicExtend(publicKeyId: String, derivationPathId: String, result: Promise) {
        try {
            val keyInfo =
                _descriptorPublicKeys[publicKeyId]!!.extend(_derivationPaths[derivationPathId]!!)
            result.resolve(keyInfo.asString())
        } catch (error: Throwable) {
            return result.reject("DescriptorPublic extend error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun descriptorPublicAsString(publicKeyId: String, result: Promise) {
        result.resolve(_descriptorPublicKeys[publicKeyId]!!.asString())
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
            return result.reject("BlockchainElectrum init error", error.localizedMessage, error)
        }
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
            return result.reject("BlockchainEsplora init error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun initRpcBlockchain(config: ReadableMap, result: Promise) {
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
            return result.reject("BlockchainRpc init error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getBlockchainHeight(id: String, result: Promise) {
        try {
            result.resolve(getBlockchainById(id).getHeight().toInt())
        } catch (error: Throwable) {
            return result.reject("Blockchain get height error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getBlockchainHash(id: String, height: Int, result: Promise) {
        try {
            result.resolve(getBlockchainById(id).getBlockHash(height.toUInt()))
        } catch (error: Throwable) {
            return result.reject("Blockchain get block hash error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun broadcast(id: String, txId: String, result: Promise) {
        try {
            getBlockchainById(id).broadcast(_transactions[txId]!!)
            result.resolve(true)
        } catch (error: Throwable) {
            return result.reject("Broadcast transaction error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun estimateFee(id: String, target: Int, result: Promise) {
        try {
            val fee = getBlockchainById(id).estimateFee(target.toULong())
            result.resolve(fee.asSatPerVb())
        } catch (error: Throwable) {
            return result.reject("Estimate Fee error", error.localizedMessage, error)
        }
    }
    /** Blockchain methods ends */


    /** DB configuration methods starts*/
    @ReactMethod
    fun memoryDBInit(result: Promise) {
        val id = randomId()
        _databaseConfigs[id] = DatabaseConfig.Memory
        result.resolve(id)
    }

    @ReactMethod
    fun sledDBInit(path: String, treeName: String, result: Promise) {
        val id = randomId()
        _databaseConfigs[id] = DatabaseConfig.Sled(SledDbConfiguration(path, treeName))
        result.resolve(id)
    }

    @ReactMethod
    fun sqliteDBInit(path: String, result: Promise) {
        val id = randomId()
        _databaseConfigs[id] = DatabaseConfig.Sqlite(SqliteDbConfiguration(path))
        result.resolve(id)
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
    }

    @ReactMethod
    fun sync(id: String, blockChainId: String, result: Promise) {
        try {
            Thread {
                getWalletById(id).sync(getBlockchainById(blockChainId), BdkProgress)
                result.resolve(true)
            }.start()
        } catch (error: Throwable) {
            result.reject("Sync wallet error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getAddress(id: String, addressIndex: String, result: Promise) {
        try {
            Thread {
                val randomId = randomId()
                val addressInfo = getWalletById(id).getAddress(setAddressIndex(addressIndex))
                _addresses[randomId] = addressInfo.address
                val responseObject = mutableMapOf<String, Any?>()
                responseObject["index"] = addressInfo.index.toInt()
                responseObject["address"] = randomId
                responseObject["keychain"] = addressInfo.keychain.toString()
                result.resolve(Arguments.makeNativeMap(responseObject))
            }.start()
        } catch (error: Throwable) {
            result.reject("Get wallet address error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getBalance(id: String, result: Promise) {
        try {
            Thread {
                val balance = getWalletById(id).getBalance()
                val responseObject = mutableMapOf<String, Any?>()
                responseObject["trustedPending"] = balance.trustedPending.toInt()
                responseObject["untrustedPending"] = balance.untrustedPending.toInt()
                responseObject["confirmed"] = balance.confirmed.toInt()
                responseObject["spendable"] = balance.spendable.toInt()
                responseObject["total"] = balance.total.toInt()
                result.resolve(Arguments.makeNativeMap(responseObject))
            }.start()
        } catch (error: Throwable) {
            result.reject("Get wallet balance error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getNetwork(id: String, result: Promise) {
        val network = getWalletById(id).network()
        result.resolve(getNetworkString(network))
    }

    @ReactMethod
    fun listUnspent(id: String, result: Promise) {
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
    }

    @ReactMethod
    fun listTransactions(id: String, includeRaw: Boolean, result: Promise) {
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
    }

    @ReactMethod
    fun sign(id: String, psbtBase64: String, signOptions: ReadableMap? = null, result: Promise) {
        try {
            var options: SignOptions? = null
            if (signOptions != null) options = createSignOptions(signOptions)

            val psbt = PartiallySignedTransaction(psbtBase64)
            getWalletById(id).sign(psbt, options)
            result.resolve(psbt.serialize())
        } catch (error: Throwable) {
            result.reject("Sign PSBT error", error.localizedMessage, error)
        }
    }
    /** Wallet methods ends*/


    /** Address methods starts*/
    @ReactMethod
    fun initAddress(address: String, result: Promise) {
        try {
            val id = randomId()
            _addresses[id] = Address(address)
            result.resolve(id)
        } catch (error: Throwable) {
            result.reject("Address error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun addressFromScript(scriptId: String, network: String, result: Promise) {
        try {
            val id = randomId()
            _addresses[id] = Address.fromScript(_scripts[scriptId]!!, setNetwork(network))
            result.resolve(id)
        } catch (error: Throwable) {
            result.reject("Address from script error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun addressToScriptPubkeyHex(id: String, result: Promise) {
        val scriptId = randomId()
        _scripts[scriptId] = _addresses[id]!!.scriptPubkey()
        result.resolve(scriptId)
    }

    @ReactMethod
    fun addressPayload(id: String, result: Promise) {
        val pay = _addresses[id]!!.payload()
        result.resolve(Arguments.makeNativeMap(getPayload(pay)))
    }

    @ReactMethod
    fun addressNetwork(id: String, result: Promise) {
        result.resolve(getNetworkString(_addresses[id]!!.network()))
    }

    @ReactMethod
    fun addressToQrUri(id: String, result: Promise) {
        result.resolve(_addresses[id]!!.toQrUri())
    }

    @ReactMethod
    fun addressAsString(id: String, result: Promise) {
        result.resolve(_addresses[id]!!.asString())
    }

    /** Address methods ends*/


    /** TxBuilder methods starts */
    @ReactMethod
    fun createTxBuilder(result: Promise) {
        val id = randomId()
        _txBuilders[id] = TxBuilder()
        result.resolve(id)
    }

    @ReactMethod
    fun addRecipient(id: String, scriptId: String, amount: Int, result: Promise) {
        _txBuilders[id] = _txBuilders[id]!!.addRecipient(_scripts[scriptId]!!, amount.toULong())
        result.resolve(true)
    }


    // `addUnspendable`
    @ReactMethod
    fun addUnspendable(id: String, outPoint: ReadableMap, result: Promise) {
        _txBuilders[id] = _txBuilders[id]!!.addUnspendable(createOutPoint(outPoint))
        result.resolve(true)
    }

    // `addUtxo`
    @ReactMethod
    fun addUtxo(id: String, outPoint: ReadableMap, result: Promise) {
        _txBuilders[id] = _txBuilders[id]!!.addUtxo(createOutPoint(outPoint))
        result.resolve(true)
    }

    // `addUtxos`
    @ReactMethod
    fun addUtxos(id: String, outPoints: ReadableArray, result: Promise) {
        val mappedOutPoints: MutableList<OutPoint> = mutableListOf()
        for (i in 0 until outPoints.size())
            mappedOutPoints.add(createOutPoint(outPoints.getMap(i)))
        _txBuilders[id] = _txBuilders[id]!!.addUtxos(mappedOutPoints)
        result.resolve(true)
    }

    // `doNotSpendChange`
    @ReactMethod
    fun doNotSpendChange(id: String, result: Promise) {
        _txBuilders[id] = _txBuilders[id]!!.doNotSpendChange()
        result.resolve(true)
    }

    // `manuallySelectedOnly`
    @ReactMethod
    fun manuallySelectedOnly(id: String, result: Promise) {
        _txBuilders[id] = _txBuilders[id]!!.manuallySelectedOnly()
        result.resolve(true)
    }

    // `onlySpendChange`
    @ReactMethod
    fun onlySpendChange(id: String, result: Promise) {
        _txBuilders[id] = _txBuilders[id]!!.onlySpendChange()
        result.resolve(true)
    }

    // `unspendable`
    @ReactMethod
    fun unspendable(id: String, outPoints: ReadableArray, result: Promise) {
        val mappedOutPoints: MutableList<OutPoint> = mutableListOf()
        for (i in 0 until outPoints.size())
            mappedOutPoints.add(createOutPoint(outPoints.getMap(i)))
        _txBuilders[id] = _txBuilders[id]!!.unspendable(mappedOutPoints)
        result.resolve(true)
    }

    // `feeRate`
    @ReactMethod
    fun feeRate(id: String, feeRate: Int, result: Promise) {
        _txBuilders[id] = _txBuilders[id]!!.feeRate(feeRate.toFloat())
        result.resolve(true)
    }

    // `feeAbsolute`
    @ReactMethod
    fun feeAbsolute(id: String, feeRate: Int, result: Promise) {
        _txBuilders[id] = _txBuilders[id]!!.feeAbsolute(feeRate.toULong())
        result.resolve(true)
    }

    // `drainWallet`
    @ReactMethod
    fun drainWallet(id: String, result: Promise) {
        _txBuilders[id] = _txBuilders[id]!!.drainWallet()
        result.resolve(true)
    }

    // `drainTo`
    @ReactMethod
    fun drainTo(id: String, scriptId: String, result: Promise) {
        _txBuilders[id] = _txBuilders[id]!!.drainTo(_scripts[scriptId]!!)
        result.resolve(true)
    }

    // `enableRbf`
    @ReactMethod
    fun enableRbf(id: String, result: Promise) {
        _txBuilders[id] = _txBuilders[id]!!.enableRbf()
        result.resolve(true)
    }

    // `enableRbfWithSequence`
    @ReactMethod
    fun enableRbfWithSequence(id: String, nsequence: Int, result: Promise) {
        _txBuilders[id] = _txBuilders[id]!!.enableRbfWithSequence(nsequence.toUInt())
        result.resolve(true)
    }

    // `addData`
    @ReactMethod
    fun addData(id: String, data: ReadableArray, result: Promise) {
        var dataList: MutableList<UByte> = mutableListOf<UByte>()
        for (i in 0 until data.size()) dataList.add(data.getInt(i).toUByte())
        _txBuilders[id] = _txBuilders[id]!!.addData(dataList)
        result.resolve(true)
    }

    // `setRecipients`
    @ReactMethod
    fun setRecipients(id: String, recipients: ReadableArray, result: Promise) {
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
    }

    @ReactMethod
    fun finish(id: String, walletId: String, result: Promise) {
        try {
            val details = _txBuilders[id]?.finish(getWalletById(walletId))
            val responseObject = getPSBTObject(details)
            result.resolve(Arguments.makeNativeMap(responseObject))
        } catch (error: Throwable) {
            result.reject("Finish tx error", error.localizedMessage, error)
        }
    }
    /** TxBuilder methods ends */

    /** Descriptor Templates method starts */
    @ReactMethod
    fun createDescriptor(descriptor: String, network: String, result: Promise) {
        try {
            val id = randomId()
            _descriptors[id] = Descriptor(descriptor, setNetwork(network))
            result.resolve(id)
        } catch (error: Throwable) {
            result.reject("Create Descriptor error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun descriptorAsString(descriptorId: String, result: Promise) {
        result.resolve(_descriptors[descriptorId]!!.asString())
    }

    @ReactMethod
    fun descriptorAsStringPrivate(descriptorId: String, result: Promise) {
        result.resolve(_descriptors[descriptorId]!!.asStringPrivate())
    }

    @ReactMethod
    fun newBip44(secretKeyId: String, keychain: String, network: String, result: Promise) {
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
    }

    @ReactMethod
    fun newBip44Public(
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        result: Promise
    ) {
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
    }

    @ReactMethod
    fun newBip49(secretKeyId: String, keychain: String, network: String, result: Promise) {
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
    }

    @ReactMethod
    fun newBip49Public(
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        result: Promise
    ) {
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
    }

    @ReactMethod
    fun newBip84(secretKeyId: String, keychain: String, network: String, result: Promise) {
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
    }

    @ReactMethod
    fun newBip84Public(
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        result: Promise
    ) {
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
    }
    /** Descriptor Templates method ends */

    /** PartiallySignedTransaction method starts */
    @ReactMethod
    fun combine(base64: String, other: String, result: Promise) {
        try {
            val newPsbt =
                PartiallySignedTransaction(base64).combine(PartiallySignedTransaction(other))
            result.resolve(newPsbt.serialize())
        } catch (error: Throwable) {
            result.reject("PSBT combine error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun extractTx(base64: String, result: Promise) {
        try {
            val id = randomId()
            _transactions[id] = PartiallySignedTransaction(base64).extractTx()
            result.resolve(id)
        } catch (error: Throwable) {
            result.reject("PSBT extract error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun serialize(base64: String, result: Promise) {
        try {
            val bytes = PartiallySignedTransaction(base64).serialize();
            result.resolve(bytes)
        } catch (error: Throwable) {
            result.reject("PSBT serialize error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun txid(base64: String, result: Promise) {
        try {
            result.resolve(PartiallySignedTransaction(base64).txid())
        } catch (error: Throwable) {
            result.reject("PSBT txid error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun feeAmount(base64: String, result: Promise) {
        try {
            result.resolve(PartiallySignedTransaction(base64).feeAmount()!!.toInt())
        } catch (error: Throwable) {
            result.reject("PSBT feeAmount error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun psbtFeeRate(base64: String, result: Promise) {
        try {
            result.resolve(PartiallySignedTransaction(base64).feeRate()!!.asSatPerVb())
        } catch (error: Throwable) {
            result.reject("PSBT feeRate error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun jsonSerialize(base64: String, result: Promise) {
        try {
            result.resolve(PartiallySignedTransaction(base64).jsonSerialize())
        } catch (error: Throwable) {
            result.reject("PSBT jsonSerialize error", error.localizedMessage, error)
        }
    }
    /** PartiallySignedTransaction method ends */

    /** BumpFeeTxBuilder methods starts*/
    @ReactMethod
    fun bumpFeeTxBuilderInit(txid: String, newFeeRate: Int, result: Promise) {
        val id = randomId()
        _bumpFeeTxBuilders[id] = BumpFeeTxBuilder(txid, newFeeRate.toFloat())
        result.resolve(id)
    }

    @ReactMethod
    fun bumpFeeTxBuilderAllowShrinking(id: String, address: String, result: Promise) {
        _bumpFeeTxBuilders[id] = _bumpFeeTxBuilders[id]!!.allowShrinking(address)
        result.resolve(true)
    }

    @ReactMethod
    fun bumpFeeTxBuilderEnableRbf(id: String, result: Promise) {
        _bumpFeeTxBuilders[id] = _bumpFeeTxBuilders[id]!!.enableRbf()
        result.resolve(true)
    }

    @ReactMethod
    fun bumpFeeTxBuilderEnableRbfWithSequence(id: String, nSequence: Int, result: Promise) {
        _bumpFeeTxBuilders[id] = _bumpFeeTxBuilders[id]!!.enableRbfWithSequence(nSequence.toUInt())
        result.resolve(true)
    }

    @ReactMethod
    fun bumpFeeTxBuilderFinish(id: String, walletId: String, result: Promise) {
        try {
            val res = _bumpFeeTxBuilders[id]!!.finish(getWalletById(walletId))
            result.resolve(res.serialize())
        } catch (error: Throwable) {
            result.reject("BumpFee Txbuilder finish error", error.localizedMessage, error)
        }
    }
    /** BumpFeeTxBuilder methods ends*/

    /** Transaction methods starts*/
    @ReactMethod
    fun createTransaction(bytes: ReadableArray, result: Promise) {
        try {
            val id = randomId()
            _transactions[id] = Transaction(getTxBytes(bytes))
            result.resolve(id)
        } catch (error: Throwable) {
            result.reject("BumpFee Txbuilder finish error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun serializeTransaction(id: String, result: Promise) {
        val uBytes = _transactions[id]!!.serialize()
        result.resolve(makeNativeArray(uBytes))
    }
    /** Transaction methods ends*/
}

