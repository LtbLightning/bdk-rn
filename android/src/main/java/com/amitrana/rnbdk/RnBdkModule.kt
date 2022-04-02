package com.ltbl.rnbdk

import android.util.Log
import com.facebook.react.bridge.*
import org.bitcoindevkit.*

val TAG = "RN-BDK"

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
    private var nodeNetwork = Network.TESTNET

    // Init wallet
    object Progress : BdkProgress {
        override fun update(progress: Float, message: String?) {
            Log.i("Progress", "Sync wallet $progress $message")
        }
    }

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

    @ReactMethod
    fun getNewAddress(promise: Promise) {
        promise.resolve(this.wallet.getNewAddress())
    }

    @ReactMethod
    fun getBalance(promise: Promise) {
        try {
            val balance = this.wallet.getBalance().toString()
            promise.resolve(balance)
        } catch (err: Error) {
            promise.reject(err)
        }
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

    @ReactMethod
    fun genSeed(password: String?, promise: Promise) {
        try {
            val seed = _seed(false)
            promise.resolve(seed.mnemonic)
        } catch (err: Error) {
            promise.reject(err)
        }
    }

    @ReactMethod
    fun createWallet(mnemonic: String = "", password: String?, promise: Promise) {
        try {
            val keys: ExtendedKeyInfo =
                _seed(if (mnemonic != "") true else false, mnemonic, password)
            val newWallet = createRestoreWallet(keys)
            promise.resolve("Address: ${newWallet.getNewAddress()}, Mnemonic: ${keys.mnemonic}")
        } catch (err: Error) {
            promise.reject(err)
        }
    }

    @ReactMethod
    fun restoreWallet(mnemonic: String, password: String? = null, promise: Promise) {
        try {
            val keys: ExtendedKeyInfo = _seed(true, mnemonic, password)
            val newWallet = createRestoreWallet(keys)
            promise.resolve("Balance: ${newWallet.getBalance()} Address: ${newWallet.getNewAddress()}")
        } catch (err: Error) {
            promise.reject(err)
        }
    }

    private fun createRestoreWallet(keys: ExtendedKeyInfo): Wallet {
        try {
            val descriptor: String = createDescriptor(keys)
            val changeDescriptor: String = createChangeDescriptor(keys)
            val newWallet = Wallet(
                descriptor,
                changeDescriptor,
                nodeNetwork,
                databaseConfig,
                blockchainConfig
            )
            newWallet.sync(Progress, null)
            return newWallet
        } catch (err: Error) {
            throw err
        }
    }


    private fun createDescriptor(keys: ExtendedKeyInfo): String {
        return ("wpkh(" + keys.xprv + "/84'/1'/0'/0/*)")
    }

    private fun createChangeDescriptor(keys: ExtendedKeyInfo): String {
        return ("wpkh(" + keys.xprv + "/84'/1'/0'/1/*)")
    }


    @ReactMethod
    fun broadcastTx(recepient: String, amount: Integer, promise: Promise) {
        try {
            val longAmt: Long = amount.toLong();
            val keys: ExtendedKeyInfo = _seed(
                "cushion merry upper hat mind tip fly ritual scheme civil disease since",
                null
            )
            val newWal: Wallet = createRestoreWallet(keys)
            Log.i("Custom Logs=======", "")
            Log.i(TAG, newWal.getNewAddress());
            Log.i(TAG, newWal.getBalance().toString())
            Log.i("=======Custom Logs", "")

            val psbt: PartiallySignedBitcoinTransaction =
                this.createTransaction(newWal, recepient, longAmt.toULong(), null)
            newWal.sign(psbt)

//            val transaction: Transaction = newWal.broadcast(psbt)
//            Log.i(TAG, "Transaction Completed", transaction.toString())
//
//            val details = when (transaction) {
//                is Transaction.Confirmed -> transaction.details
//                is Transaction.Unconfirmed -> transaction.details
//            }
//
//            val txidString = details.txid

//            Log.i("TxID", "Transaction was broadcast! txid: $txidString")
            Log.i("TxID", "Transaction was broadcast!!!")
        } catch (err: Error) {
            promise.reject(err)
        }
    }

    fun createTransaction(
        wall: Wallet,
        recipient: String,
        amount: ULong,
        fee_rate: Float?
    ): PartiallySignedBitcoinTransaction {
        return PartiallySignedBitcoinTransaction(wall, recipient, amount, fee_rate)
    }
}

