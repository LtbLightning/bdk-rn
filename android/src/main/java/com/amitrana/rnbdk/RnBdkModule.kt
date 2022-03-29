package com.ltbl.rnbdk

import android.util.Log
import com.facebook.react.bridge.*
import org.bitcoindevkit.*

class RnBdkModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RnBdkModule"
    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }

    // BDK module's real properties and methods
    private val externalDescriptor =
        "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/0/*)"
    private val internalDescriptor =
        "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/1/*)"
    private val databaseConfig = DatabaseConfig.Memory("")
    private val blockchainConfig =
        BlockchainConfig.Electrum(
            ElectrumConfig("ssl://electrum.blockstream.info:60002", null, 5u, null, 10u)
        )
    private lateinit var wallet: Wallet

    // Init wallet
    object LogProgress: BdkProgress {
        override fun update(progress: Float, message: String?) {
            Log.i("Progress", "Sync wallet $progress $message")
        }
    }

    init {
        this.wallet = Wallet(
            externalDescriptor,
            internalDescriptor,
            Network.TESTNET,
            databaseConfig,
            blockchainConfig
        )
    }

    @ReactMethod
    fun getNewAddress(promise: Promise) {
        promise.resolve(this.wallet.getNewAddress())
    }

    @ReactMethod
    fun getBalance(promise: Promise) {
        try {
            this.wallet.sync(LogProgress, null)
            val balance = this.wallet.getBalance().toString()
            promise.resolve(balance)
        } catch (err: Error){
            promise.reject(err)
        }
    }
}

