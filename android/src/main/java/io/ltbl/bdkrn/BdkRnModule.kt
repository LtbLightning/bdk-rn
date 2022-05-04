package io.ltbl.bdkrn

import android.util.Log
import com.facebook.react.bridge.*
import org.bitcoindevkit.*

val TAG = "BDK-RN"

object Progress : BdkProgress {
    override fun update(progress: Float, message: String?) {
        Log.i("Progress", "Sync wallet $progress $message")
    }
}

class BdkRnModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BdkRnModule"
    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }

    // BDK module's real properties and methods
    private val externalDescriptor =
        "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/0/*)"
    private val internalDescriptor =
        "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/1/*)"

    private val databaseConfig = DatabaseConfig.Memory

    private val blockchainConfig =
        BlockchainConfig.Electrum(
            ElectrumConfig("ssl://electrum.blockstream.info:60002", null, 5u, null, 10u)
        )
    private lateinit var wallet: Wallet
    private var nodeNetwork = Network.TESTNET


    // Init wallet
    init {
        this.wallet = Wallet(
            externalDescriptor,
            internalDescriptor,
            nodeNetwork,
            databaseConfig,
            blockchainConfig
        )
        this.wallet.sync(Progress, null)
    }

    fun _seed(
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

    private fun createRestoreWallet(keys: ExtendedKeyInfo) {
        try{
            val descriptor: String = createDescriptor(keys)
            val changeDescriptor: String = createChangeDescriptor(keys)
            wallet = Wallet(
                descriptor,
                changeDescriptor,
                nodeNetwork,
                databaseConfig,
                blockchainConfig
            )
            wallet.sync(Progress, null)
        } catch (error: Error){
            throw error
        }
    }

    private fun createDescriptor(keys: ExtendedKeyInfo): String {
        return "wpkh(" + keys.xprv + "/84'/1'/0'/0/*)"
    }

    private fun createChangeDescriptor(keys: ExtendedKeyInfo): String {
        return "wpkh(" + keys.xprv + "/84'/1'/0'/1/*)"
    }

    @ReactMethod
    fun genSeed(password: String?, promise: Promise) {
        try {
            val seed = _seed(false)
            promise.resolve(seed.mnemonic)
        } catch (error: Throwable) {
            return promise.reject("Gen Seed Error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun createWallet(mnemonic: String = "", password: String?, promise: Promise) {
        try {
            val keys: ExtendedKeyInfo =
                _seed(if (mnemonic != "") true else false, mnemonic, password)
            createRestoreWallet(keys)
            val responseObject = WritableNativeMap()
            responseObject.putString("address", wallet.getNewAddress())
            responseObject.putString("mnemonic", keys.mnemonic)
            promise.resolve(responseObject)
        } catch (error: Throwable) {
            return promise.reject("Create Wallet Error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun restoreWallet(mnemonic: String, password: String? = null, promise: Promise) {
        try {
            val keys: ExtendedKeyInfo = _seed(true, mnemonic, password)
            createRestoreWallet(keys)
            val responseObject = WritableNativeMap()
            responseObject.putString("address", wallet.getNewAddress())
            responseObject.putString("balance", wallet.getBalance().toString())
            promise.resolve(responseObject)
        } catch (error: Throwable) {
            return promise.reject("Restore Wallet Error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getNewAddress(promise: Promise) {
        promise.resolve(wallet.getNewAddress())
    }

    @ReactMethod
    fun getBalance(promise: Promise) {
        try {
            this.wallet.sync(Progress, null)
            val balance = this.wallet.getBalance().toString()
            promise.resolve(balance)
        } catch (error: Throwable) {
            return promise.reject("Get Balance Error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun broadcastTx(recepient: String, amount: Integer, promise: Promise) {
        try {
            val longAmt: Long = amount.toLong();
            val psbt =
                PartiallySignedBitcoinTransaction(wallet, recepient, longAmt.toULong(), null)
            wallet.sign(psbt)
            val transaction: String = wallet.broadcast(psbt)
            promise.resolve(transaction)
        } catch (error: Throwable) {
            return promise.reject("Transaction Error", error.localizedMessage, error)
        }
    }
}

