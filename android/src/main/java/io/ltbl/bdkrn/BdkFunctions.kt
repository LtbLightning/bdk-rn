package io.ltbl.bdkrn

import android.util.Log
import org.bitcoindevkit.*
import java.io.FileDescriptor
import org.bitcoindevkit.Wallet as BdkWallet

object BdkFunctions {
    private lateinit var wallet: BdkWallet
    private lateinit var blockChain: Blockchain
    const val TAG = "BDK-F"
    private val databaseConfig = DatabaseConfig.Memory
    val defaultBlockChainConfigUrl = "ssl://electrum.blockstream.info:60002"
    val defaultBlockChain = "ELECTRUM"
    private val defaultBlockchainConfig =
        BlockchainConfig.Electrum(
            ElectrumConfig(defaultBlockChainConfigUrl, null, 5u, null, 10u)
        )
    private var nodeNetwork = Network.TESTNET

    object ProgressLog : Progress {
        override fun update(progress: Float, message: String?) {
            Log.i(progress.toString(), "Progress Log")
        }
    }

    //Init wallet
    init {
        initWallet()
        sync(defaultBlockchainConfig)
    }

    // Default wallet for initialization, which must be replaced with custom wallet for personal
    // use
    private fun initWallet(): BdkWallet {
        val key: ExtendedKeyInfo = seed(false, "default mnemonic", "password")
        createRestoreWallet(
            key,
            null,
            "",
            "",
            "",
            "",
            ""
        )
        return this.wallet
    }

    private fun createRestoreWallet(
        keys: ExtendedKeyInfo, network: String?,
        blockChainConfigUrl: String, blockChainSocket5: String?,
        retry: String?, timeOut: String?, blockChainName: String?
    ) {
        try {
            val descriptor: String = createDefaultDescriptor(keys)
            val changeDescriptor: String = createChangeDescriptorFromDescriptor(descriptor)
            val config = createDatabaseConfig(
                blockChainConfigUrl,
                blockChainSocket5,
                retry,
                timeOut,
                blockChainName ?: defaultBlockChain
            )
            this.wallet = BdkWallet(
                descriptor,
                changeDescriptor,
                setNetwork(network),
                databaseConfig
            )
            sync(config)
        } catch (error: Error) {
            throw error
        }
    }

    fun initWallet(
        mnemonic: String, password: String?, network: String?,
        blockChainConfigUrl: String, blockChainSocket5: String?,
        retry: String?, timeOut: String?, blockChainName: String?
    ): Map<String, Any?> {
        try {
            val keys: ExtendedKeyInfo = seed(true, mnemonic, password)
            createRestoreWallet(
                keys, network, blockChainConfigUrl, blockChainSocket5, retry,
                timeOut, blockChainName
            )
            val responseObject = mutableMapOf<String, Any?>()
            responseObject["address"] = getNewAddress()
            responseObject["balance"] = wallet.getBalance().toString()
            Log.i(responseObject.toString(), "Progress Log Restore Success")
            return responseObject
        } catch (error: Throwable) {
            throw(error)
        }
    }

    // please remove this
    fun getWallet(): String {
        try {
            return this.wallet.toString()
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
            Log.i(wallet.getBalance().toString(), "Progress Log Balance")
            return this.wallet.getBalance().toString()
        } catch (error: Throwable) {
            throw(error)
        }
    }

    fun broadcastTx(recipient: String, amount: Double): String {
        try {

            val longAmt: Long = amount.toLong()
            val txBuilder = TxBuilder().addRecipient(recipient, longAmt.toULong())
            val psbt = txBuilder.finish(wallet)
            wallet.sign(psbt)
            blockChain.broadcast(psbt)
            return (psbt.txid())
        } catch (error: Throwable) {
            throw(error)
        }
    }

    // retrieve transactions for an address
    fun pendingTransactionsList(): List<Map<String, Any?>> {
        try {
            val transactions =
                this.wallet.getTransactions().filterIsInstance<Transaction.Unconfirmed>()
            if (transactions.isEmpty()) {
                return emptyList()
            } else {
                val unconfirmedTransactions: MutableList<Map<String, Any?>> = mutableListOf()
                for (item in transactions) {
                    val responseObject = mutableMapOf<String, Any?>()
                    responseObject["received"] = item.details.received.toString()
                    responseObject["sent"] = item.details.sent.toString()
                    responseObject["fees"] = item.details.fee.toString()
                    responseObject["txid"] = item.details.txid
                    unconfirmedTransactions.add(responseObject)
                }

                return unconfirmedTransactions
            }
        } catch (error: Throwable) {
            throw(error)
        }
    }

    fun confirmedTransactionsList(): List<Map<String, Any?>> {
        try {
            val transactions = wallet.getTransactions().filterIsInstance<Transaction.Confirmed>()
            if (transactions.isEmpty()) {
                return emptyList()
            } else {
                val confirmedTransactions: MutableList<Map<String, Any?>> = mutableListOf()
                for (item in transactions) {
                    val responseObject = mutableMapOf<String, Any?>()
                    responseObject["received"] = item.details.received.toString()
                    responseObject["sent"] = item.details.sent.toString()
                    responseObject["fees"] = item.details.fee.toString()
                    responseObject["txid"] = item.details.txid
                    responseObject["confirmation_time"] = item.confirmation.timestamp.toString()
                    confirmedTransactions.add(responseObject)
                }
                return confirmedTransactions
            }
        } catch (error: Throwable) {
            throw(error)
        }
    }

    fun resetWallet(): Boolean {
        try {
            wallet.destroy()
            Log.i(wallet.toString(), "Progress Log resetWallet Success")
            return true

        } catch (error: Throwable) {
            throw(error)
        }
    }

    fun getLastUnusedAddress(): String {
        try {
            val addressInfo = wallet.getAddress(AddressIndex.LAST_UNUSED)
            return addressInfo.address
        } catch (error: Throwable) {
            throw(error)
        }
    }
    // Bitcoin js functions

    //Generate a SegWit address descriptor
    private fun createDefaultDescriptor(keys: ExtendedKeyInfo): String {
        return "wpkh(" + keys.xprv + "/84'/1'/0'/0/*)"
    }

    // Generate a SegWit P2SH address descriptor
    private fun createP2SHP2WPKHDescriptor(
        mnemonic: String = "",
        password: String? = null
    ): String {
        val keys: ExtendedKeyInfo = seed(true, mnemonic, password)
        return "sh(wpkh(" + keys.xprv + "/84'/1'/0'/0/*))"
    }

    //Generate a Static P2PKH descriptor
    private fun createP2PKHDescriptor(mnemonic: String = "", password: String? = null): String {
        val keys: ExtendedKeyInfo = seed(true, mnemonic, password)
        return "pkh(" + keys.xprv + "/84'/1'/0'/0/*)"
    }

    //Generate a SegWit 2-of-2 P2SH multisig address descriptor
    private fun createP2SH2of2MultisigDescriptor(
        mnemonic: String = "",
        password: String? = null,
        recipientPublicKey: String
    ): String {
        val keys: ExtendedKeyInfo = seed(true, mnemonic, password)
        return "sh(multi(2" + keys.xprv + "," + recipientPublicKey + "/84'/1'/0'/0/*))"
    }

    private fun createP2SH3of4MultisigDescriptor(
        mnemonic: String = "",
        password: String? = null,
        recipientPublicKey1: String,
        recipientPublicKey2: String,
        recipientPublicKey3: String
    ): String {
        val keys: ExtendedKeyInfo = seed(true, mnemonic, password)
        return "sh(multi(2" + keys.xprv + "," + recipientPublicKey1 + "," + recipientPublicKey2 + "," + recipientPublicKey3 + "/84'/1'/0'/0/*))"
    }

    private fun createChangeDescriptorFromDescriptor(descriptor: String): String {
        return descriptor.replace("/84'/1'/0'/0/*", "/84'/1'/0'/1/*")
    }

    fun seed(
        recover: Boolean = false,
        mnemonic: String = "",
        password: String? = null
    ): ExtendedKeyInfo {
        return if (!recover) generateExtendedKey(
            nodeNetwork,
            WordCount.WORDS12,
            password
        ) else restoreExtendedKey(nodeNetwork, mnemonic, password)
    }

    fun createDescriptor(mnemonic: String, password: String? = null): String {
        try {
            val keys: ExtendedKeyInfo = seed(true, mnemonic, password)
            return keys.xprv
        } catch (error: Throwable) {
            throw error
        }
    }

    fun sync(config: BlockchainConfig?): Unit {
        this.blockChain = Blockchain(config ?: defaultBlockchainConfig)
        this.wallet.sync(this.blockChain, ProgressLog)
    }

    private fun createDatabaseConfig(
        blockChainConfigUrl: String, blockChainSocket5: String?,
        retry: String?, timeOut: String?, blockChain: String?
    ): BlockchainConfig {
        return when (blockChain) {
            "ELECTRUM" -> BlockchainConfig.Electrum(
                ElectrumConfig(
                    blockChainConfigUrl ?: defaultBlockChainConfigUrl,
                    blockChainSocket5 ?: null,
                    retry?.toUByte() ?: 5u,
                    timeOut?.toUByte() ?: 5u,
                    10u
                )
            )
            "ESPLORA" -> BlockchainConfig.Esplora(
                EsploraConfig(
                    blockChainConfigUrl ?: defaultBlockChainConfigUrl,
                    blockChainSocket5 ?: null,
                    retry?.toUByte() ?: 5u,
                    timeOut?.toULong() ?: 5u,
                    10u
                )
            )
            else -> {
                return defaultBlockchainConfig
            }
        }

    }

    private fun setNetwork(networkStr: String?): Network {
        return when (networkStr) {
            "TESTNET" -> Network.TESTNET
            "BITCOIN" -> Network.BITCOIN
            "REGTEST" -> Network.REGTEST
            "SIGNET" -> Network.SIGNET
            else -> {
                Network.TESTNET
            }
        }
    }
}