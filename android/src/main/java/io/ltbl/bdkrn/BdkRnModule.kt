package io.ltbl.bdkrn

import android.util.Log
import com.facebook.react.bridge.*

class BdkRnModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BdkRnModule"
    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }

    @ReactMethod
    fun genSeed(password: String?, result: Promise) {
        try {
            val seed = BdkFunctions.seed(false)
            result.resolve(seed.mnemonic)
        } catch (error: Throwable) {
            return result.reject("Gen Seed Error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun createDescriptor(mnemonic: String, password: String? = null, result: Promise) {
        try {
            val descriptor = BdkFunctions.createDescriptor(mnemonic, password)
            result.resolve(descriptor)
        } catch (error: Throwable) {
            return result.reject("Create descriptor error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun initWallet(
        mnemonic: String,
        password: String?,
        network: String?,
        blockChainConfigUrl: String,
        blockChainSocket5: String?,
        retry: String?,
        timeOut: String?,
        blockChain: String?,
        result: Promise
    ) {
        try {
            val responseObject =
                BdkFunctions.initWallet(
                    mnemonic,
                    password,
                    network,
                    blockChainConfigUrl,
                    blockChainSocket5,
                    retry,
                    timeOut,
                    blockChain
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
            val transactions = BdkFunctions.pendingTransactionsList()
            result.resolve(Arguments.makeNativeArray(transactions))
        } catch (error: Throwable) {
            return result.reject("Get Pending TransactionsError", error.localizedMessage, error)
        }
    }
    @ReactMethod
    fun getConfirmedTransactions(result: Promise) {
        try {
            val transactions = BdkFunctions.confirmedTransactionsList()
            result.resolve(Arguments.makeNativeArray(transactions))
        } catch (error: Throwable) {
            return result.reject("Get confirmed Transactions Error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getWallet(result: Promise) {
        try {
            val wallet: String = BdkFunctions.getWallet()
            result.resolve(wallet)
        } catch (error: Throwable) {
            return result.reject("Get Wallet Error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun resetWallet(result: Promise) {
        try {
            result.resolve(BdkFunctions.resetWallet())
        } catch (error: Throwable) {
            return result.reject("Progress Log resetWallet Error", error.localizedMessage, error)
        }
    }
}

