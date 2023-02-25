package io.ltbl.bdkrn

import com.facebook.react.bridge.*
import org.bitcoindevkit.*

class BdkRnModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BdkRnModule"
    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }

    lateinit var _descriptorSecretKey: DescriptorSecretKey
    lateinit var _descriptorPublicKey: DescriptorPublicKey

    /** Mnemonic methods starts */
    @ReactMethod
    fun generateSeedFromWordCount(wordCount: Int, result: Promise) {
        val response = Mnemonic(setWordCount(wordCount))
        result.resolve(response.asString())
    }

    @ReactMethod
    fun generateSeedFromString(mnemonic: String, result: Promise) {
        try {
            val response = Mnemonic.fromString(mnemonic)
            result.resolve(response.asString())
        } catch (error: Throwable) {
            return result.reject("Generate seed error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun generateSeedFromEntropy(entropyLength: Int, result: Promise) {
        try {
            val response = Mnemonic.fromEntropy(getEntropy(entropyLength))
            result.resolve(response.asString())
        } catch (error: Throwable) {
            return result.reject("Generate seed error", error.localizedMessage, error)
        }
    }
    /** Mnemonic methods ends */

    /** Derviation path methods starts */
    @ReactMethod
    fun createDerivationPath(path: String, result: Promise) {
        try {
            DerivationPath(path)
            result.resolve(true)
        } catch (error: Throwable) {
            return result.reject("Create Derivation path error", error.localizedMessage, error)
        }
    }
    /** Derviation path methods ends */

    /** Descriptor secret key methods starts */
    @ReactMethod
    fun createDescriptorSecret(
        network: String, mnemonic: String, password: String? = null, result: Promise
    ) {
        try {
            val networkName: Network = setNetwork(network)
            val keyInfo = DescriptorSecretKey(networkName, Mnemonic.fromString(mnemonic), password)
            _descriptorSecretKey = keyInfo
            result.resolve(keyInfo.asString())
        } catch (error: Throwable) {
            return result.reject("DescriptorSecret create error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun descriptorSecretDerive(path: String, result: Promise) {
        try {
            val _path = DerivationPath(path)
            val keyInfo = _descriptorSecretKey.derive(_path)
            result.resolve(keyInfo.asString())
        } catch (error: Throwable) {
            return result.reject("DescriptorSecret derive error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun descriptorSecretExtend(path: String, result: Promise) {
        try {
            val _path = DerivationPath(path)
            val keyInfo = _descriptorSecretKey.extend(_path)
            result.resolve(keyInfo.asString())
        } catch (error: Throwable) {
            return result.reject("DescriptorSecret extend error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun descriptorSecretAsPublic(result: Promise) {
        result.resolve(_descriptorSecretKey.asPublic().asString())
    }

    @ReactMethod
    fun descriptorSecretAsSecretBytes(result: Promise) {
        val arr = WritableNativeArray()
        val scretBytes = _descriptorSecretKey.secretBytes()
        for (i in scretBytes) arr.pushInt(i.toInt())
        result.resolve(arr)
    }
    /** Descriptor secret key methods ends */

    /** Descriptor public key methods starts */
    @ReactMethod
    fun createDescriptorPublic(publicKey: String, result: Promise) {
        try {
            val keyInfo = DescriptorPublicKey.fromString(publicKey)
            _descriptorPublicKey = keyInfo
            result.resolve(keyInfo.asString())
        } catch (error: Throwable) {
            return result.reject("DescriptorPublic create error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun descriptorPublicDerive(path: String, result: Promise) {
        try {
            val _path = DerivationPath(path)
            val keyInfo = _descriptorPublicKey.derive(_path)
            result.resolve(keyInfo.asString())
        } catch (error: Throwable) {
            return result.reject("DescriptorPublic derive error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun descriptorPublicExtend(path: String, result: Promise) {
        try {
            val _path = DerivationPath(path)
            val keyInfo = _descriptorPublicKey.extend(_path)
            result.resolve(keyInfo.asString())
        } catch (error: Throwable) {
            return result.reject("DescriptorPublic extend error", error.localizedMessage, error)
        }
    }

    /** Descriptor public key methods ends */


    // ================ END ========== //
}

