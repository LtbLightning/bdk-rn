package io.ltbl.bdkrn

import com.facebook.react.bridge.*
import org.bitcoindevkit.Network

class BdkRnModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BdkRnModule"
    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }

    @ReactMethod
    fun generateMnemonic(wordCount: Int = 12, result: Promise) {
        try {
            val mnemonic = BdkFunctions.generateMnemonic(wordCount)
            result.resolve(mnemonic)
        } catch (error: Throwable) {
            return result.reject("Generate Mnemonic Error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getExtendedKeyInfo(
        network: String,
        mnemonic: String,
        password: String? = null,
        result: Promise
    ) {
        try {
            val networkName: Network = BdkFunctions.setNetwork(network)
            val responseObject = BdkFunctions.extendedKeyInfo(networkName, mnemonic, password)
            result.resolve(Arguments.makeNativeMap(responseObject))
        } catch (error: Throwable) {
            return result.reject("Get extended keys error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun createWallet(
        mnemonic: String = "",
        password: String?,
        network: String?,
        blockChainConfigUrl: String,
        blockChainSocket5: String?,
        retry: String?,
        timeOut: String?,
        blockChain: String?,
        descriptor: String = "",
        result: Promise
    ) {
        try {
            val responseObject =
                BdkFunctions.createWallet(
                    mnemonic,
                    password,
                    network,
                    blockChainConfigUrl,
                    blockChainSocket5,
                    retry,
                    timeOut,
                    blockChain,
                    descriptor
                )
            result.resolve(Arguments.makeNativeMap(responseObject))
        } catch (error: Throwable) {
            return result.reject("Init Wallet Error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getNewAddress(result: Promise) {
        try {
            val address: String = BdkFunctions.getNewAddress()
            result.resolve(address)
        } catch (error: Throwable) {
            return result.reject("Get address Error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun syncWallet(result: Promise) {
        try {
            BdkFunctions.syncWallet()
            result.resolve("wallet sync complete")
        } catch (error: Throwable) {
            return result.reject("Get address Error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getBalance(result: Promise) {
        try {
            val balance: String = BdkFunctions.getBalance()
            result.resolve(balance)
        } catch (error: Throwable) {
            return result.reject("Get Balance Error", error.localizedMessage, error)
        }
    }


    @ReactMethod
    fun broadcastTx(recipient: String, amount: Double, result: Promise) {
        try {
            val transaction: String = BdkFunctions.broadcastTx(recipient, amount)
            result.resolve(transaction)
        } catch (error: Throwable) {
            return result.reject("Broadcast Transaction Error", error.message, error.cause)
        }
    }

    @ReactMethod
    fun getPendingTransactions(result: Promise) {
        try {
            val transactions = BdkFunctions.transactionsList(true)
            result.resolve(Arguments.makeNativeArray(transactions))
        } catch (error: Throwable) {
            return result.reject("Get Pending TransactionsError", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getConfirmedTransactions(result: Promise) {
        try {
            val transactions = BdkFunctions.transactionsList()
            result.resolve(Arguments.makeNativeArray(transactions))
        } catch (error: Throwable) {
            return result.reject("Get confirmed Transactions Error", error.localizedMessage, error)
        }
    }
}

