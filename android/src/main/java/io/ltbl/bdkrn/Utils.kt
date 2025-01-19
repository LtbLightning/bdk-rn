package io.ltbl.bdkrn

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Arguments.makeNativeArray
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import org.bitcoindevkit.*
import java.util.*
import kotlin.collections.ArrayList
import org.bitcoindevkit.KeychainKind

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
        15 -> WordCount.WORDS12
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

sealed class AddressIndex {
    object New : AddressIndex()
    object LastUnused : AddressIndex()
    data class Peek(val index: UInt) : AddressIndex()
}

fun setAddressIndex(addressIndex: Any?): AddressIndex {
    return when (addressIndex) {
        is String -> when (addressIndex) {
            "new" -> AddressIndex.New
            "lastUnused" -> AddressIndex.LastUnused
            else -> AddressIndex.New
        }
        is Double -> AddressIndex.Peek(addressIndex.toUInt())
        else -> AddressIndex.New
    }
}

fun randomId() = UUID.randomUUID().toString()

data class TransactionDetails(
    val txid: String,
    val received: Long,
    val sent: Long,
    val fee: Long?,
    val confirmationTime: ConfirmationTime?
)

data class ConfirmationTime(
    val height: UInt,
    val timestamp: UInt
)

fun getTransactionObject(transaction: TransactionDetails): MutableMap<String, Any> {
    return mutableMapOf(
        "received" to transaction.received.toDouble(),
        "sent" to transaction.sent.toDouble(),
        "fee" to (transaction.fee?.toDouble() ?: 0.0),
        "txid" to transaction.txid,
        "confirmationTime" to mutableMapOf(
            "height" to (transaction.confirmationTime?.height?.toInt() ?: 0),
            "timestamp" to (transaction.confirmationTime?.timestamp?.toDouble() ?: 0.0)
        )
    )
}

data class TxBuilderResult(
    val psbt: Psbt,
    val transactionDetails: TransactionDetails
)

fun getPSBTObject(txResult: TxBuilderResult?): MutableMap<String, Any> {
    return mutableMapOf(
        "base64" to txResult!!.psbt.serialize(),
        "transactionDetails" to getTransactionObject(txResult.transactionDetails)
    )
}

enum class KeychainKind {
    EXTERNAL,
    INTERNAL
}

fun setKeychainKind(keychainKind: String? = "external"): KeychainKind {
    return when (keychainKind) {
        "external" -> KeychainKind.EXTERNAL
        "internal" -> KeychainKind.INTERNAL
        else -> KeychainKind.EXTERNAL
    }
}

sealed class Payload {
    data class PubkeyHash(val pubkeyHash: String) : Payload()
    data class ScriptHash(val scriptHash: String) : Payload()
    data class WitnessProgram(val program: List<UByte>, val version: Int) : Payload()
}

fun getPayload(payload: Payload): MutableMap<String, Any> {
    return when (payload) {
        is Payload.PubkeyHash -> mutableMapOf(
            "type" to "pubkeyHash",
            "value" to payload.pubkeyHash
        )
        is Payload.ScriptHash -> mutableMapOf(
            "type" to "scriptHash",
            "value" to payload.scriptHash
        )
        is Payload.WitnessProgram -> mutableMapOf(
            "type" to "witnessProgram",
            "value" to makeNativeArray(payload.program),
            "version" to payload.version.toString()
        )
    }
}

data class TxOut(
    val value: Long,
    val scriptPubkey: Script
)

data class TxIn(
    val previousOutput: OutPoint,
    val scriptSig: Script,
    val sequence: UInt,
    val witness: List<List<UByte>>
)

data class Script(val script: String)

data class SignOptions(
    val trustWitnessUtxo: Boolean,
    val assumeHeight: UInt,
    val allowAllSighashes: Boolean,
    val removePartialSigs: Boolean,
    val tryFinalize: Boolean,
    val signWithTapInternalKey: Boolean,
    val allowGrinding: Boolean
)

fun createSignOptions(options: ReadableMap): SignOptions {
    return SignOptions(
        options.getBoolean("trustWitnessUtxo"),
        options.getInt("assumeHeight").toUInt(),
        options.getBoolean("allowAllSighashes"),
        options.getBoolean("removePartialSigs"),
        options.getBoolean("tryFinalize"),
        options.getBoolean("signWithTapInternalKey"),
        options.getBoolean("allowGrinding")
    )
}

private val _outPoints = mutableMapOf<String, org.bitcoindevkit.OutPoint>()

fun getOutPoint(outpoint: org.bitcoindevkit.OutPoint): Map<String, Any> {
    val id = randomId()
    _outPoints[id] = outpoint
    
    return mapOf(
        "id" to id,
        "txid" to outpoint.txid,
        "vout" to outpoint.vout
    )
}

fun createTxOut(txOut: org.bitcoindevkit.TxOut, scripts: MutableMap<String, org.bitcoindevkit.Script>): Map<String, Any> {
    val scriptId = randomId()
    scripts[scriptId] = txOut.scriptPubkey
    
    return mapOf(
            "value" to txOut.value,
            "script" to mapOf(
                "id" to scriptId
            )
    )
}

fun createOutPoint(outPoint: ReadableMap): OutPoint {
    val txid = outPoint.getString("txid") ?: throw Exception("txid is required")
    val vout = outPoint.getDouble("vout").toInt().toUInt()
    return org.bitcoindevkit.OutPoint(txid, vout)
    }

fun getTxBytes(array: ReadableArray): List<UByte> {
    return List(array.size()) { i ->
        array.getInt(i).toUByte()
    }
}

fun createTxIn(
    txIn: org.bitcoindevkit.TxIn,
    scripts: MutableMap<String, org.bitcoindevkit.Script>
): Map<String, Any?> {
    val scriptSigId = randomId()
    scripts[scriptSigId] = txIn.scriptSig

    return mapOf(
        "previousOutput" to mapOf(
            "txid" to txIn.previousOutput.txid,
            "vout" to txIn.previousOutput.vout
        ),
        "scriptSig" to mapOf(
            "id" to scriptSigId
        ),
        "sequence" to txIn.sequence,
        "witness" to txIn.witness.map { witnessData ->
            witnessData.map { it.toInt() }
        }
    )
}