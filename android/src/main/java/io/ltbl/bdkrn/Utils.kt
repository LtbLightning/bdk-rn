package io.ltbl.bdkrn

import android.util.Log
import com.facebook.react.bridge.NativeMap
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import org.bitcoindevkit.*
import java.util.*
import kotlin.collections.ArrayList

object BdkProgress : Progress {
    override fun update(progress: Float, message: String?) {
        Log.i(progress.toString(), "Progress Log")
    }
}

fun setNetwork(networkStr: String? = "testnet"): Network {
    return when (networkStr) {
        "testnet" -> Network.TESTNET
        "bitcoin" -> Network.BITCOIN
        "regtest" -> Network.REGTEST
        "signet" -> Network.SIGNET
        else -> Network.TESTNET
    }
}

fun getNetworkString(network: Network): String {
    return when (network) {
        Network.TESTNET -> "testnet"
        Network.BITCOIN -> "bitcoin"
        Network.REGTEST -> "regtest"
        Network.SIGNET -> "signet"
        else -> "testnet"
    }
}

fun setWordCount(wordCount: Int?): WordCount {
    return when (wordCount) {
        15 -> WordCount.WORDS15
        18 -> WordCount.WORDS18
        21 -> WordCount.WORDS21
        24 -> WordCount.WORDS24
        else -> WordCount.WORDS12
    }
}

fun getEntropy(entropy: ReadableArray): List<UByte> {
    val entropyArray = ArrayList<UByte>()
    for (i in 0 until entropy.size()) {
        entropyArray.add(entropy.getInt(i).toUByte())
    }
    return entropyArray
}

fun setAddressIndex(addressIndex: String?): AddressIndex {
    return when (addressIndex) {
        "new" -> return AddressIndex.New
        "lastUnused" -> return AddressIndex.LastUnused
        else -> AddressIndex.New
    }
}

fun randomId() = UUID.randomUUID().toString()

fun getTransactionObject(transaction: TransactionDetails): MutableMap<String, Any> {
    return mutableMapOf<String, Any>(
        "received" to transaction.received.toInt(),
        "sent" to transaction.sent.toInt(),
        "fee" to transaction.fee!!.toInt(),
        "txid" to transaction.txid,
        "confirmationTime" to mutableMapOf<String, Any>(
            "height" to (transaction.confirmationTime?.height?.toInt() ?: 0),
            "timestamp" to (transaction.confirmationTime?.timestamp?.toInt() ?: 0),
        )
    )
}

fun getPSBTObject(txResult: TxBuilderResult?): MutableMap<String, Any> {
    return mutableMapOf(
        "base64" to txResult!!.psbt.serialize(),
        "transactionDetails" to getTransactionObject(txResult.transactionDetails),
    )
}

fun createOutPoint(outPoint: ReadableMap): OutPoint {
    return OutPoint(
        outPoint.getString("txid").toString(),
        outPoint.getInt("vout").toUInt(),
    )
}

fun setKeychainKind(keychainKind: String? = "external"): KeychainKind {
    return when (keychainKind) {
        "external" -> KeychainKind.EXTERNAL
        "internal" -> KeychainKind.INTERNAL
        else -> KeychainKind.EXTERNAL
    }
}

fun getTxBytes(bytes: ReadableArray): List<UByte> {
    val bytesArray = ArrayList<UByte>()
    for (i in 0 until bytes.size()) {
        bytesArray.add(bytes.getInt(i).toUByte())
    }
    return bytesArray
}

fun makeNativeArray(bytes: List<UByte>): WritableNativeArray{
    val arr = WritableNativeArray()
    for (i in bytes) arr.pushInt(i.toInt())
    return  arr
}
