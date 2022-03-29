package com.ltbl.rnbdk

import com.facebook.react.bridge.*
import org.bitcoindevkit.*

class RnBdkModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "RnBdkModule"

    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }

    @ReactMethod
    fun getNewAddress(promise: Promise) {

        val externalDescriptor =
                "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/0/*)"
        val internalDescriptor =
                "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/1/*)"

        val databaseConfig = DatabaseConfig.Memory("")

        val blockchainConfig =
                BlockchainConfig.Electrum(
                        ElectrumConfig("ssl://electrum.blockstream.info:60002", null, 5u, null, 10u)
                )
        val wallet =
                Wallet(
                        externalDescriptor,
                        internalDescriptor,
                        Network.TESTNET,
                        databaseConfig,
                        blockchainConfig
                )
        val newAddress = wallet.getNewAddress()
        promise.resolve(newAddress)
    }
}
