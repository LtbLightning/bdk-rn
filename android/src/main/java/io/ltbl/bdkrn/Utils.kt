package io.ltbl.bdkrn

import android.util.Log
import com.facebook.react.bridge.Arguments
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
        "received" to transaction.received.toDouble(),
        "sent" to transaction.sent.toDouble(),
        "fee" to transaction.fee!!.toDouble(),
        "txid" to transaction.txid,
        "confirmationTime" to mutableMapOf<String, Any>(
            "height" to (transaction.confirmationTime?.height?.toInt() ?: 0),
            "timestamp" to (transaction.confirmationTime?.timestamp?.toDouble() ?: 0),
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

fun makeNativeArray(bytes: List<UByte>): WritableNativeArray {
    val arr = WritableNativeArray()
    for (i in bytes) arr.pushInt(i.toInt())
    return arr
}

fun getPayload(payload: Payload): MutableMap<String, Any> {
    var response = mutableMapOf<String, Any>();
    when (payload) {
        is Payload.PubkeyHash -> {
            response["type"] = "pubkeyHash"
            response["value"] = payload.pubkeyHash
        }

        is Payload.ScriptHash -> {
            response["type"] = "scriptHash"
            response["value"] = payload.scriptHash
        }

        is Payload.WitnessProgram -> {
            response["type"] = "witnessProgram"
            response["value"] = makeNativeArray(payload.program)
            response["version"] = payload.version.toString()
        }
    }
    return response
}


fun createTxOut(txOut: TxOut, _scripts: MutableMap<String, Script>): MutableMap<String, Any> {
    val randomId = randomId()
    _scripts[randomId] = txOut.scriptPubkey
    return mutableMapOf("script" to randomId, "value" to txOut.value.toDouble())
}

fun createTxIn(txIn: TxIn, _scripts: MutableMap<String, Script>): MutableMap<String, Any> {
    val randomId = randomId()
    _scripts[randomId] = txIn.scriptSig
    var witnessList = mutableListOf<Any>();
    for(item in txIn.witness) {
        witnessList.add(makeNativeArray(item))
    }
    return mutableMapOf(
        "scriptSig" to randomId,
        "previousOutput" to getOutPoint(txIn.previousOutput),
        "sequence" to txIn.sequence.toInt(),
        "witness" to witnessList
    )
}

fun getOutPoint(outPoint: OutPoint): MutableMap<String, Any> {
    return mutableMapOf("txid" to outPoint.txid, "vout" to outPoint.vout.toInt())
}


fun createSignOptions(options: ReadableMap): SignOptions? {
    return SignOptions(
        options.getBoolean("trustWitnessUtxo"),
        options.getInt("assumeHeight").toUInt(),
        options.getBoolean("allowAllSighashes"),
        options.getBoolean("removePartialSigs"),
        options.getBoolean("tryFinalize"),
        options.getBoolean("signWithTapInternalKey"),
        options.getBoolean("allowGrinding"),
    )
}