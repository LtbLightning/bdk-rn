package io.ltbl.bdkrn

import android.annotation.SuppressLint
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise as Result

@SuppressLint("LongLogTag")
object Bdk {
    const val TAG = "BDK-F"

    fun getWallet(result: Result) {
        try {
            val wallet: String = BdkFunctions.getWallet()
            result.resolve(wallet)
        } catch (error: Throwable) {
            return result.reject("Get Wallet Error", error.localizedMessage, error)
        }
    }

    fun getNewAddress(result: Result) {
        try {
            val address: String = BdkFunctions.getNewAddress()
            result.resolve(address)
        } catch (error: Throwable) {
            return result.reject("Get address Error", error.localizedMessage, error)
        }
    }

    fun getBalance(result: Result) {
        try {
            val balance: String = BdkFunctions.getBalance()
            result.resolve(balance)
        } catch (error: Throwable) {
            return result.reject("Get Balance Error", error.localizedMessage, error)
        }
    }

    fun genSeed(password: String?, result: Result) {
        try {
            val seed = BdkFunctions.seed(false)
            result.resolve(seed.mnemonic)
        } catch (error: Throwable) {
            return result.reject("Gen Seed Error", error.localizedMessage, error)
        }
    }

    fun createWallet(
        mnemonic: String,
        password: String?,
        network: String?,
        blockChainConfigUrl: String,
        blockChainSocket5: String?,
        retry: String?,
        timeOut: String?,
        blockChain: String?,
        result: Result
    ) {
        return try {
            val responseObject =
                BdkFunctions.createWallet(
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
            return result.reject("Create Wallet Error", error.localizedMessage, error)
        }
    }

    fun restoreWallet(
        mnemonic: String,
        password: String?,
        network: String?,
        blockChainConfigUrl: String,
        blockChainSocket5: String?,
        retry: String?,
        timeOut: String?,
        blockChain: String?,
        result: Result
    ) {
        try {
            val responseObject =
                BdkFunctions.restoreWallet(
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
            return result.reject("Restore Wallet Error", error.localizedMessage, error)
        }
    }

    fun broadcastTx(recipient: String, amount: Double, result: Result) {
        try {
            val transaction: String = BdkFunctions.broadcastTx(recipient, amount)
            result.resolve(transaction)
        } catch (error: Throwable) {
            return result.reject("Broadcast Transaction Error", error.message, error.cause)
        }
    }

    fun getConfirmedTransactions(result: Result) {
        try {
            val transactions = BdkFunctions.confirmedTransactionsList()
            result.resolve(Arguments.makeNativeArray(transactions))
        } catch (error: Throwable) {
            return result.reject("Get confirmed Transactions Error", error.localizedMessage, error)
        }
    }

    fun getPendingTransactions(result: Result) {
        try {
            val transactions = BdkFunctions.pendingTransactionsList()
            result.resolve(Arguments.makeNativeArray(transactions))
        } catch (error: Throwable) {
            return result.reject("Get Pending TransactionsError", error.localizedMessage, error)
        }
    }

    fun resetWallet(result: Result) {
        try {
            Log.i(BdkFunctions.getWallet(), "Progress Log resetWallet Success")
            result.resolve(BdkFunctions.resetWallet())
        } catch (error: Throwable) {
            return result.reject("Progress Log resetWallet Error", error.localizedMessage, error)
        }
    }
}



