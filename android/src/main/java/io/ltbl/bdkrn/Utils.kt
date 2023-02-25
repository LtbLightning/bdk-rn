package io.ltbl.bdkrn
import android.util.Log
import org.bitcoindevkit.*

object ProgressLog : Progress {
    override fun update(progress: Float, message: String?) {
        Log.i(progress.toString(), "Progress Log")
    }
}

fun createChangeDescriptor(descriptor: String): String {
    return descriptor.replace("/84'/1'/0'/0/*", "/84'/1'/0'/1/*")
}

fun setNetwork(networkStr: String? = "testnet"): Network {
    return when (networkStr) {
        "testnet" -> Network.TESTNET
        "bitcoin" -> Network.BITCOIN
        "regtest" -> Network.REGTEST
        "signet" -> Network.SIGNET
        else -> {
            Network.TESTNET
        }
    }
}

fun getNetworkString(network: Network): String {
    return when (network) {
        Network.TESTNET -> "testnet"
        Network.BITCOIN -> "bitcoin"
        Network.REGTEST -> "regtest"
        Network.SIGNET  ->  "signet"
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

fun getEntropy(length: Int): List<UByte> {
    var entropyArray = ArrayList<UByte>()
    for (i in 1..length) {
        entropyArray.add((0..256).random().toUByte())
    }
    return entropyArray
}