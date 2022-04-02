package com.ltbl.rnbdk

import android.util.Log
import android.util.Log.DEBUG
import android.util.LogPrinter
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
        this.wallet.sync(LogProgress, null)
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
        } catch (err: Error){
            promise.reject(err)
        }
    }

    @ReactMethod
    fun createWallet(promise: Promise) {
        try {
            val keys: ExtendedKeyInfo = generateExtendedKey(Network.TESTNET, WordCount.WORDS12, null)
            val descriptor: String = createDescriptor(keys)
            val changeDescriptor: String = createChangeDescriptor(keys)
            val newWallet: Wallet = Wallet(descriptor, changeDescriptor, Network.TESTNET, databaseConfig, blockchainConfig)
            Log.i("New Wallet", newWallet.toString())
            promise.resolve(keys.mnemonic)
        } catch (err: Error){
            promise.reject(err)
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

            val psbt: PartiallySignedBitcoinTransaction = this.createTransaction(recepient, longAmt.toULong(), null)
            Log.i("", psbt.toString());
            this.wallet.sign(psbt)
            val transaction: Transaction = this.wallet.broadcast(psbt)

            val details = when (transaction) {
                is Transaction.Confirmed -> transaction.details
                is Transaction.Unconfirmed -> transaction.details
            }

            val txidString = details.txid

            Log.i("TxID", "Transaction was broadcast! txid: $txidString")
//            promise.resolve(psbt)
        } catch (err: Error){
            promise.reject(err)
        }
    }

    fun createTransaction(recipient: String, amount: ULong, fee_rate: Float?): PartiallySignedBitcoinTransaction {
        return PartiallySignedBitcoinTransaction(this.wallet, recipient, amount, fee_rate)
    }
}

