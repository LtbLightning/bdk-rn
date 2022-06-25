package io.ltbl.bdkrn

import com.facebook.react.bridge.*

class BdkRnModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BdkRnModule"
    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }

    @ReactMethod
    fun genSeed(password: String?, promise: Promise) {
        Bdk.genSeed(password, promise)
    }

    @ReactMethod
    fun createWallet(
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
        Bdk.createWallet(
            mnemonic, password, network, blockChainConfigUrl, blockChainSocket5, retry,
            timeOut, blockChain, result
        )
    }

    @ReactMethod
    fun restoreWallet(
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
        Bdk.restoreWallet(
            mnemonic, password, network, blockChainConfigUrl, blockChainSocket5, retry,
            timeOut, blockChain, result
        )
    }

    @ReactMethod
    fun getNewAddress(promise: Promise) {
        Bdk.getNewAddress(promise)
    }

    @ReactMethod
    fun getBalance(promise: Promise) {
        Bdk.getBalance(promise)
    }

    @ReactMethod
    fun broadcastTx(recepient: String, amount: Integer, promise: Promise) {
        Bdk.broadcastTx(recepient, amount.toDouble(), promise)
    }

    @ReactMethod
    fun genPendingTransactions(promise: Promise) {
        Bdk.getPendingTransactions(promise)
    }

    @ReactMethod
    fun getConfirmedTransactions(promise: Promise) {
        Bdk.getConfirmedTransactions(promise)
    }
}

