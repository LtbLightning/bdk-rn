package io.ltbl.bdkrn

import android.util.Log
import org.bitcoindevkit.*
import org.bitcoindevkit.Wallet as BdkWallet

object BdkFunctions {
    private lateinit var wallet: BdkWallet
    private lateinit var blockChain: Blockchain
    private val databaseConfig = DatabaseConfig.Memory
    private var defaultBlockChainConfigUrl = "ssl://electrum.blockstream.info:60002"
    private var defaultBlockChain = "ELECTRUM"
    private var defaultBlockchainConfig =
        BlockchainConfig.Electrum(
            ElectrumConfig(defaultBlockChainConfigUrl, null, 5u, null, 10u)
        )

    object ProgressLog : Progress {
        override fun update(progress: Float, message: String?) {
            Log.i(progress.toString(), "Progress Log")
        }
    }

    //Init wallet
    init {
        initWallet()
    }

    // Default wallet for initialization, which must be replaced with custom wallet for personal
    // use
    private fun initWallet(): BdkWallet {
        val netWork = setNetwork()
        val keyInfo = DescriptorSecretKey(netWork, Mnemonic(WordCount.WORDS12), "")
        val descriptor = createDefaultDescriptor(keyInfo)
        val changeDescriptor = createChangeDescriptorFromDescriptor(descriptor)

        this.wallet = BdkWallet(
            descriptor,
            changeDescriptor,
            netWork,
            databaseConfig
        )
        return this.wallet
    }

    fun syncWallet() {
        this.blockChain = Blockchain(defaultBlockchainConfig)
        this.wallet.sync(this.blockChain, ProgressLog)
    }

    fun setNetwork(networkStr: String? = "testnet"): Network {
        return when (networkStr) {
            "testnet" -> Network.TESTNET
            "bitcoin" -> Network.BITCOIN
            "regtest" -> Network.REGTEST
            "signet" -> Network.SIGNET
            else -> {
                Network.TESTNET
            }
        }
    }

    private fun createDefaultDescriptor(rootKey: DescriptorSecretKey): String {
        val path = DerivationPath("m/84h/1h/0h/0")
        val xprv = rootKey.extend(path).asString()
        return "wpkh($xprv)"
    }

    private fun createChangeDescriptorFromDescriptor(descriptor: String): String {
        return descriptor.replace("/84'/1'/0'/0/*", "/84'/1'/0'/1/*")
    }

    private fun createBlockchainConfig(
        blockChainConfigUrl: String, blockChainSocket5: String?,
        retry: String?, timeOut: String?, blockChain: String?
    ) {
        try {
            val updatedConfig: BlockchainConfig
            val _blockChainName = if (blockChain != "") blockChain else defaultBlockChain
            val _blockChainUrl =
                if (blockChainConfigUrl != "") blockChainConfigUrl else defaultBlockChainConfigUrl
            val _socks = if (blockChainSocket5 != "") blockChainSocket5 else null
            when (_blockChainName) {
                "ELECTRUM" -> updatedConfig = BlockchainConfig.Electrum(
                    ElectrumConfig(
                        _blockChainUrl,
                        null, 5u, null, 10u
                    )
                )
                "ESPLORA" -> updatedConfig = BlockchainConfig.Esplora(
                    EsploraConfig(
                        _blockChainUrl,
                        _socks,
                        retry?.toUByte() ?: 5u,
                        timeOut?.toULong() ?: 5u,
                        10u
                    )
                )
                else -> {
                    updatedConfig = this.defaultBlockchainConfig
                }
            }
            this.defaultBlockchainConfig = updatedConfig as BlockchainConfig.Electrum
        } catch (e: Throwable) {
            throw e
        }
    }

    fun extendedKeyInfo(
        network: Network,
        mnemonic: String,
        password: String? = null
    ): Map<String, Any?> {
        try {
            val keysInfo = DescriptorSecretKey(network, Mnemonic.fromString(mnemonic), password)
            val responseObject = mutableMapOf<String, Any?>()
            responseObject["xprv"] = keysInfo.asString().replace("/*", "")
            responseObject["mnemonic"] = mnemonic
            return responseObject
        } catch (error: Throwable) {
            throw error
        }
    }

    fun createWallet(
        mnemonic: String = "", password: String?, network: String?,
        blockChainConfigUrl: String, blockChainSocket5: String?,
        retry: String?, timeOut: String?, blockChainName: String?, descriptor: String = ""
    ): Map<String, Any?> {
        try {
            val networkName: Network = setNetwork(network)
            var newDescriptor = ""
            if (descriptor == "") {
                val keyInfo =
                    DescriptorSecretKey(networkName, Mnemonic.fromString(mnemonic), password)
                newDescriptor = createDefaultDescriptor(keyInfo)
            }
            val finalDescriptor: String = if (descriptor != "") descriptor else newDescriptor
            val changeDescriptor: String = createChangeDescriptorFromDescriptor(finalDescriptor)

            createBlockchainConfig(
                blockChainConfigUrl,
                blockChainSocket5,
                retry,
                timeOut,
                blockChainName
            )
            this.wallet = BdkWallet(
                finalDescriptor,
                changeDescriptor,
                networkName,
                databaseConfig
            )

            val responseObject = mutableMapOf<String, Any?>()
            responseObject["address"] = getNewAddress()
            return responseObject
        } catch (error: Throwable) {
            throw(error)
        }
    }

    fun getNewAddress(): String {
        try {
            val addressInfo = wallet.getAddress(AddressIndex.NEW)
            return addressInfo.address
        } catch (error: Throwable) {
            throw(error)
        }
    }

    fun getBalance(): String {
        try {
            return this.wallet.getBalance().confirmed.toString()
        } catch (error: Throwable) {
            throw(error)
        }
    }

    fun transactionsList(pending: Boolean = false): List<Map<String, Any?>> {
        try {
            val transactions = this.wallet.listTransactions()
            if (transactions.isEmpty()) {
                return emptyList()
            } else {
                val pendingList: MutableList<Map<String, Any?>> = mutableListOf()
                val confirmedList: MutableList<Map<String, Any?>> = mutableListOf()
                for (item in transactions) {
                    val responseObject = mutableMapOf<String, Any?>()
                    responseObject["received"] = item.received.toString()
                    responseObject["sent"] = item.sent.toString()
                    responseObject["fees"] = item.fee.toString()
                    responseObject["txid"] = item.txid
                    if (item.confirmationTime == null) {
                        pendingList.add(responseObject)
                    } else {
                        responseObject["confirmationTime"] = item.confirmationTime?.timestamp.toString()
                        confirmedList.add(responseObject)
                    }
                }
                return if (pending) pendingList else confirmedList
            }
        } catch (error: Throwable) {
            throw(error)
        }
    }


    fun broadcastTx(recipient: String, amount: Double): String {
        try {
            val longAmt: Long = amount.toLong()
            val address = Address(recipient)
            val script = address.scriptPubkey()
            val txBuilder = TxBuilder().addRecipient(script, longAmt.toULong())
            val details = txBuilder.finish(wallet)
            wallet.sign(details.psbt)
            blockChain.broadcast(details.psbt)
            val txid = details.psbt.txid()
            return (txid)
        } catch (error: Throwable) {
            throw(error)
        }
    }


    fun generateMnemonic(wordCount: Int = 12): String {
        val number: WordCount = when (wordCount) {
            12 -> WordCount.WORDS12
            15 -> WordCount.WORDS15
            18 -> WordCount.WORDS18
            21 -> WordCount.WORDS21
            24 -> WordCount.WORDS24
            else -> {
                WordCount.WORDS12
            }
        }
        try {
            return Mnemonic(number).asString()
        } catch (error: Throwable) {
            throw error
        }
    }


}
