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
    private var defaultBlockchainConfig =
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
    }

    // Default wallet for initialization, which must be replaced with custom wallet for personal
    // use
    private fun initWallet(): BdkWallet {
        val netWork = setNetwork();
        val key: ExtendedKeyInfo = generateExtendedKey(netWork, WordCount.WORDS12,"")
        val descriptor = createDefaultDescriptor(key.xprv)
        val changeDescriptor = createChangeDescriptorFromDescriptor(descriptor)

        this.wallet = BdkWallet(
          descriptor,
          changeDescriptor,
          netWork,
          databaseConfig
        )
        return this.wallet
    }

   fun createWallet(
        mnemonic: String = "", password: String?, network: String?,
        blockChainConfigUrl: String, blockChainSocket5: String?,
        retry: String?, timeOut: String?, blockChainName: String?, descriptor: String = ""
    ): Map<String, Any?> {
        try {
            var networkName: Network = setNetwork(network);
            var newDescriptor = "";
            if(descriptor == ""){
                val keyInfo = restoreExtendedKey(networkName, mnemonic, password)
                newDescriptor = createDefaultDescriptor(keyInfo.xprv);
            }
            val finalDescriptor: String  = if(descriptor!="") descriptor else newDescriptor
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
    private fun createDefaultDescriptor(xprv: String): String {
        return "wpkh(" + xprv + "/84'/1'/0'/0/*)"
    }

    private fun createChangeDescriptorFromDescriptor(descriptor: String): String {
        return descriptor.replace("/84'/1'/0'/0/*", "/84'/1'/0'/1/*")
    }

    fun generateMnemonic(
        wordCount: Int = 12,
        network: String
    ): String {
        var number: WordCount;
        when (wordCount) {
            12 -> number = WordCount.WORDS12
            15 -> number = WordCount.WORDS15
            18 -> number = WordCount.WORDS18
            21 -> number = WordCount.WORDS21
            24 -> number = WordCount.WORDS24
            else -> {
                number = WordCount.WORDS12
            }
        }
        try {
          var networkName: Network = setNetwork(network);
          return generateExtendedKey(networkName, number, "").mnemonic;
        } catch (error: Throwable){
            throw error
        }
    }

    fun extendedKeyInfo(network: Network, mnemonic: String, password: String? = null): Map<String, Any?> {
        try {
            val keysInfo: ExtendedKeyInfo = restoreExtendedKey(network, mnemonic, password)
            val responseObject = mutableMapOf<String, Any?>()
            responseObject["fingerprint"] = keysInfo.fingerprint
            responseObject["mnemonic"] = keysInfo.mnemonic
            responseObject["xprv"] = keysInfo.xprv
            return responseObject
        } catch (error: Throwable) {
            throw error
        }
    }

    fun syncWallet(): Unit {
        this.blockChain = Blockchain(defaultBlockchainConfig)
        this.wallet.sync(this.blockChain, ProgressLog)
    }

    private fun createBlockchainConfig(
        blockChainConfigUrl: String, blockChainSocket5: String?,
        retry: String?, timeOut: String?, blockChain: String?
    ) {
      try {
        val updatedConfig: BlockchainConfig;
        val _blockChainName = if (blockChain != "") blockChain else defaultBlockChain;
        val _blockChainUrl = if (blockChainConfigUrl != "") blockChainConfigUrl else defaultBlockChainConfigUrl;
        val _socks = if (blockChainSocket5 != "") blockChainSocket5 else null;
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
      } catch (e: Throwable){
        throw e
      }
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
}
