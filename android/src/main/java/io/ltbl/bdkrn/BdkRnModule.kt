package io.ltbl.bdkrn

import com.facebook.react.bridge.*
import com.facebook.react.bridge.Arguments.makeNativeArray
import com.facebook.react.bridge.UiThreadUtil.runOnUiThread
import org.bitcoindevkit.*
import org.bitcoindevkit.Descriptor.Companion.newBip44
import org.bitcoindevkit.Descriptor.Companion.newBip44Public
import org.bitcoindevkit.Descriptor.Companion.newBip49
import org.bitcoindevkit.Descriptor.Companion.newBip49Public
import org.bitcoindevkit.Descriptor.Companion.newBip84
import org.bitcoindevkit.Descriptor.Companion.newBip84Public
import org.bitcoindevkit.Descriptor.Companion.newBip86
import org.bitcoindevkit.Descriptor.Companion.newBip86Public
import org.bitcoindevkit.Amount
import org.bitcoindevkit.OutPoint
import org.bitcoindevkit.KeychainKind
import io.ltbl.bdkrn.getTxBytes

class BdkRnModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BdkRnModule"
    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }

    private var _descriptorSecretKeys = mutableMapOf<String, DescriptorSecretKey>()
    private var _descriptorPublicKeys = mutableMapOf<String, DescriptorPublicKey>()

    private var _wallets = mutableMapOf<String, Wallet>()
    private var _addresses = mutableMapOf<String, Address>()
    private var _scripts = mutableMapOf<String, org.bitcoindevkit.Script>()
    private var _txBuilders = mutableMapOf<String, TxBuilder>()
    private var _descriptors = mutableMapOf<String, Descriptor>()

    private var _derivationPaths = mutableMapOf<String, DerivationPath>()
    private var _bumpFeeTxBuilders = mutableMapOf<String, BumpFeeTxBuilder>()
    private var _transactions = mutableMapOf<String, Transaction>()

    private var _outPoints = mutableMapOf<String, org.bitcoindevkit.OutPoint>()
    private var _txOuts = mutableMapOf<String, org.bitcoindevkit.TxOut>()
    private var _feeRates = mutableMapOf<String, FeeRate>()
    private val _localOutputs = mutableMapOf<String, LocalOutput>()

    /** Mnemonic methods starts */
    @ReactMethod
    fun generateSeedFromWordCount(wordCount: Int, result: Promise) {
        Thread {
            val response = Mnemonic(setWordCount(wordCount))
            result.resolve(response.asString())
        }.start()
    }

    @ReactMethod
    fun generateSeedFromString(mnemonic: String, result: Promise) {
        Thread {
            try {
                val response = Mnemonic.fromString(mnemonic)
                result.resolve(response.asString())
            } catch (error: Throwable) {
                result.reject("Generate seed error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun generateSeedFromEntropy(entropy: ReadableArray, result: Promise) {
        Thread {
            try {
                val response = Mnemonic.fromEntropy(getEntropy(entropy))
                result.resolve(response.asString())
            } catch (error: Throwable) {
                result.reject("Generate seed error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Mnemonic methods ends */

    /** Derviation path methods starts */
    @ReactMethod
    fun createDerivationPath(path: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _derivationPaths[id] = DerivationPath(path)
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create Derivation path error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun derivationPathToString(id: String, result: Promise) {
        Thread {
            try {
            val derivationPath = _derivationPaths[id] ?: throw Exception("DerivationPath not found")
            // Note: Similar to iOS, we're returning the id as there's no direct toString method
            // In a real implementation, you might want to store the original string or implement a toString method
            result.resolve(id)
        } catch (error: Throwable) {
                result.reject("DerivationPath error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Derviation path methods ends */

   /** Descriptor secret key methods starts */
    @ReactMethod
    fun createDescriptorSecretKey(network: String, mnemonic: String, password: String?, result: Promise) {
        Thread {
            try {
                val mnemonicObj = Mnemonic.fromString(mnemonic)
                val descriptorSecretKey = DescriptorSecretKey(
                    setNetwork(network),
                    mnemonicObj,
                    password
                )
                val id = randomId()
                _descriptorSecretKeys[id] = descriptorSecretKey
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretKeyFromString(secretKey: String, result: Promise) {
        Thread {
            try {
                val descriptorSecretKey = DescriptorSecretKey.fromString(secretKey)
                val id = randomId()
                _descriptorSecretKeys[id] = descriptorSecretKey
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretKeyAsPublic(id: String, result: Promise) {
        Thread {
            try {
                val descriptorSecretKey = _descriptorSecretKeys[id] ?: throw Exception("DescriptorSecretKey not found")
                val descriptorPublicKey = descriptorSecretKey.asPublic()
                val publicKeyId = randomId()
                _descriptorPublicKeys[publicKeyId] = descriptorPublicKey
                result.resolve(publicKeyId)
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretKeyAsString(id: String, result: Promise) {
        Thread {
            try {
                val descriptorSecretKey = _descriptorSecretKeys[id] ?: throw Exception("DescriptorSecretKey not found")
                result.resolve(descriptorSecretKey.asString())
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretKeyDerive(id: String, path: String, result: Promise) {
        Thread {
            try {
                val descriptorSecretKey = _descriptorSecretKeys[id] ?: throw Exception("DescriptorSecretKey not found")
                val derivationPath = DerivationPath(path)
                val derivedKey = descriptorSecretKey.derive(derivationPath)
                val newId = randomId()
                _descriptorSecretKeys[newId] = derivedKey
                result.resolve(newId)
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey derive error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretKeyExtend(id: String, path: String, result: Promise) {
        Thread {
            try {
                val descriptorSecretKey = _descriptorSecretKeys[id] ?: throw Exception("DescriptorSecretKey not found")
                val derivationPath = DerivationPath(path)
                val extendedKey = descriptorSecretKey.extend(derivationPath)
                val newId = randomId()
                _descriptorSecretKeys[newId] = extendedKey
                result.resolve(newId)
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey extend error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorSecretKeySecretBytes(id: String, result: Promise) {
        Thread {
            try {
                val descriptorSecretKey = _descriptorSecretKeys[id] ?: throw Exception("DescriptorSecretKey not found")
                val secretBytes = descriptorSecretKey.secretBytes()
                result.resolve(Arguments.makeNativeArray(secretBytes))
            } catch (error: Throwable) {
                result.reject("DescriptorSecretKey error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Descriptor secret key methods ends */

    /** Descriptor public key methods starts */
    @ReactMethod
    fun createDescriptorPublic(publicKey: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _descriptorPublicKeys[id] = DescriptorPublicKey.fromString(publicKey)
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("DescriptorPublic create error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorPublicDerive(publicKeyId: String, derivationPathId: String, result: Promise) {
        Thread {
            try {
                val keyInfo =
                    _descriptorPublicKeys[publicKeyId]!!.derive(_derivationPaths[derivationPathId]!!)
                result.resolve(keyInfo.asString())
            } catch (error: Throwable) {
                result.reject("DescriptorPublic derive error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorPublicExtend(publicKeyId: String, derivationPathId: String, result: Promise) {
        Thread {
            try {
                val keyInfo =
                    _descriptorPublicKeys[publicKeyId]!!.extend(_derivationPaths[derivationPathId]!!)
                result.resolve(keyInfo.asString())
            } catch (error: Throwable) {
                result.reject("DescriptorPublic extend error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorPublicAsString(publicKeyId: String, result: Promise) {
        Thread {
            result.resolve(_descriptorPublicKeys[publicKeyId]!!.asString())
        }.start()
    }

    /** Descriptor public key methods ends */

    /** Wallet methods starts*/
    private fun getWalletById(id: String): Wallet {
        return _wallets[id]!!
    }

   @ReactMethod
    fun revealNextAddress(id: String, addressIndex: Dynamic, result: Promise) {
        Thread {
            try {
                val keychain = when (addressIndex.type) {
                    ReadableType.Boolean -> {
                        if (addressIndex.asBoolean()) org.bitcoindevkit.KeychainKind.INTERNAL 
                        else org.bitcoindevkit.KeychainKind.EXTERNAL
                    }
                    else -> org.bitcoindevkit.KeychainKind.EXTERNAL
                }
                
                val addressInfo = getWalletById(id).revealNextAddress(keychain)
                val randomId = randomId()
                _addresses[randomId] = addressInfo.address
                
                val responseObject = mutableMapOf<String, Any?>()
                responseObject["index"] = addressInfo.index.toInt()
                responseObject["address"] = randomId
                responseObject["keychain"] = addressInfo.keychain.toString()
                
                result.resolve(Arguments.makeNativeMap(responseObject))
            } catch (error: Throwable) {
                result.reject("Reveal next address error", error.localizedMessage, error)
            }
        }.start()
    }
    
    @ReactMethod
    fun isMine(id: String, scriptId: String, result: Promise) {
        Thread {
            try {
                val isMine = getWalletById(id).isMine(_scripts[scriptId]!!)
                result.resolve(isMine)
            } catch (error: Throwable) {
                result.reject("Check wallet isMine error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getNetwork(id: String, result: Promise) {
        Thread {
            try {
                val network = getWalletById(id).network()
                result.resolve(getNetworkString(network))
            } catch (error: Throwable) {
                result.reject("Get network error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun listUnspent(id: String, result: Promise) {
        Thread {
            try {
                val unspentList = getWalletById(id).listUnspent()
                val unspents = unspentList.map { item ->
                    mutableMapOf<String, Any?>().apply {
                        put("outpoint", getOutPoint(item.outpoint))
                        put("txout", createTxOut(item.txout, _scripts))
                        put("isSpent", item.isSpent)
                        put("keychain", item.keychain.toString())
                    }
                }
                result.resolve(Arguments.makeNativeArray(unspents))
            } catch (error: Throwable) {
                result.reject("List unspent outputs error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Wallet methods ends*/

    /** Balance methods starts */
    @ReactMethod
    fun getBalance(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                val responseObject = mutableMapOf<String, Any?>()
                responseObject["immature"] = balance.immature
                responseObject["trustedPending"] = balance.trustedPending
                responseObject["untrustedPending"] = balance.untrustedPending
                responseObject["confirmed"] = balance.confirmed
                responseObject["trustedSpendable"] = balance.trustedSpendable
                responseObject["total"] = balance.total
                
                promise.resolve(Arguments.makeNativeMap(responseObject))
            } catch (error: Throwable) {
                promise.reject("Get wallet balance error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBalanceImmature(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                promise.resolve(balance.immature)
            } catch (error: Throwable) {
                promise.reject("Get wallet immature balance error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBalanceTrustedPending(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                promise.resolve(balance.trustedPending)
            } catch (error: Throwable) {
                promise.reject("Get wallet trusted pending balance error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBalanceUntrustedPending(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                promise.resolve(balance.untrustedPending)
            } catch (error: Throwable) {
                promise.reject("Get wallet untrusted pending balance error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBalanceConfirmed(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                promise.resolve(balance.confirmed)
            } catch (error: Throwable) {
                promise.reject("Get wallet confirmed balance error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBalanceTrustedSpendable(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                promise.resolve(balance.trustedSpendable)
            } catch (error: Throwable) {
                promise.reject("Get wallet trusted spendable balance error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getBalanceTotal(id: String, promise: Promise) {
        Thread {
            try {
                val balance = getWalletById(id).getBalance()
                promise.resolve(balance.total)
            } catch (error: Throwable) {
                promise.reject("Get wallet total balance error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Balance methods ends */


    /** Address methods starts */
    @ReactMethod
    fun initAddress(address: String, network: String, promise: Promise) {
        Thread {
            try {
                val id = randomId()
                _addresses[id] = Address(address, setNetwork(network))
                promise.resolve(id)
            } catch (error: Throwable) {
                promise.reject("Address error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun addressToScriptPubkeyHex(id: String, promise: Promise) {
        Thread {
            try {
                val address = _addresses[id] ?: throw Exception("Address not found")
                val scriptId = randomId()
                _scripts[scriptId] = address.scriptPubkey()
                promise.resolve(scriptId)
            } catch (error: Throwable) {
                promise.reject("Script pubkey error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun addressNetwork(id: String, promise: Promise) {
        Thread {
            try {
                val address = _addresses[id] ?: throw Exception("Address not found")
                val network = address.network()
                promise.resolve(getNetworkString(network))
            } catch (error: Throwable) {
                promise.reject("Network error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun addressToQrUri(id: String, promise: Promise) {
        Thread {
            try {
                val address = _addresses[id] ?: throw Exception("Address not found")
                promise.resolve(address.toQrUri())
            } catch (error: Throwable) {
                promise.reject("QR URI error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun addressAsString(id: String, promise: Promise) {
        Thread {
            try {
                val address = _addresses[id] ?: throw Exception("Address not found")
                promise.resolve(address.asString())
            } catch (error: Throwable) {
                promise.reject("Address string error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun addressIsValidForNetwork(id: String, network: String, promise: Promise) {
        Thread {
            try {
                val address = _addresses[id] ?: throw Exception("Address not found")
                val isValid = address.isValidForNetwork(setNetwork(network))
                promise.resolve(isValid)
            } catch (error: Throwable) {
                promise.reject("Network validation error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Address methods ends */

    /** Amount methods starts */
    @ReactMethod
    fun createAmountFromSat(sat: Double, promise: Promise) {
        Thread {
            try {
                val amount = Amount.fromSat(sat.toLong().toULong())
                promise.resolve(amount.toSat())
            } catch (error: Throwable) {
                promise.reject("Amount creation error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun createAmountFromBtc(btc: Double, promise: Promise) {
        Thread {
            try {
                val amount = Amount.fromBtc(btc)
                promise.resolve(amount.toSat())
            } catch (error: Throwable) {
                promise.reject("Amount creation error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun amountAsSats(sats: Double, promise: Promise) {
        Thread {
            try {
                val amount = Amount.fromSat(sats.toLong().toULong())
                promise.resolve(amount.toSat())
            } catch (error: Throwable) {
                promise.reject("Amount conversion error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun amountAsBtc(sats: Double, promise: Promise) {
        Thread {
            try {
                val amount = Amount.fromSat(sats.toLong().toULong())
                promise.resolve(amount.toBtc())
            } catch (error: Throwable) {
                promise.reject("Amount conversion error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Amount methods ends */

    /** TxBuilder methods starts */
    @ReactMethod
    fun createTxBuilder(result: Promise) {
        Thread {
            val id = randomId()
            _txBuilders[id] = TxBuilder()
            result.resolve(id)
        }.start()
    }

    // `addRecipient`
    @ReactMethod
    fun addRecipient(id: String, scriptId: String, amount: Double, promise: Promise) {
        Thread {
            try {
                val satAmount = amount.toLong().toULong()
                val amountObj = Amount.fromSat(satAmount)
                val builder = _txBuilders[id] ?: throw Exception("TxBuilder not found")
                val script = _scripts[scriptId] ?: throw Exception("Script not found")
                
                _txBuilders[id] = builder.addRecipient(script, amountObj)
                promise.resolve(true)
            } catch (error: Throwable) {
                promise.reject("Add recipient error", error.localizedMessage, error)
            }
        }.start()
    }


    // `addUnspendable`
    @ReactMethod
    fun addUnspendable(id: String, outPoint: ReadableMap, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.addUnspendable(createOutPoint(outPoint))
            result.resolve(true)
        }.start()
    }

    // `addUtxo`
    @ReactMethod
    fun addUtxo(id: String, outPoint: ReadableMap, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.addUtxo(createOutPoint(outPoint))
            result.resolve(true)
        }.start()
    }

    // `addUtxos`
    @ReactMethod
    fun addUtxos(id: String, outPoints: ReadableArray, promise: Promise) {
        Thread {
            try {
                val builder = _txBuilders[id] ?: throw Exception("TxBuilder not found")
                
                for (i in 0 until outPoints.size()) {
                    val outPoint = outPoints.getMap(i)
                    val mappedOutPoint = createOutPoint(outPoint)
                    _txBuilders[id] = builder.addUtxo(mappedOutPoint)
                }
                
                promise.resolve(true)
            } catch (error: Throwable) {
                promise.reject("Add UTXOs error", error.localizedMessage, error)
            }
        }.start()
    }

    // `doNotSpendChange`
    @ReactMethod
    fun doNotSpendChange(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.doNotSpendChange()
            result.resolve(true)
        }.start()
    }

    // `manuallySelectedOnly`
    @ReactMethod
    fun manuallySelectedOnly(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.manuallySelectedOnly()
            result.resolve(true)
        }.start()
    }

    // `onlySpendChange`
    @ReactMethod
    fun onlySpendChange(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.onlySpendChange()
            result.resolve(true)
        }.start()
    }

    // `unspendable`
    @ReactMethod
    fun unspendable(id: String, outPoints: ReadableArray, result: Promise) {
        Thread {
            val mappedOutPoints: MutableList<OutPoint> = mutableListOf()
            for (i in 0 until outPoints.size())
                mappedOutPoints.add(createOutPoint(outPoints.getMap(i)))
            _txBuilders[id] = _txBuilders[id]!!.unspendable(mappedOutPoints)
            result.resolve(true)
        }.start()
    }

    /** LocalOutput methods starts */
    @ReactMethod
    fun getLocalOutputOutpoint(id: String, promise: Promise) {
        Thread {
            try {
                val localOutput = _localOutputs[id] ?: run {
                    promise.reject("Invalid LocalOutput", "LocalOutput not found", null)
                    return@Thread
                }
                val outpointId = randomId()
                _outPoints[outpointId] = localOutput.outpoint
                promise.resolve(outpointId)
            } catch (error: Throwable) {
                promise.reject("Invalid LocalOutput", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getLocalOutputTxout(id: String, promise: Promise) {
        Thread {
            try {
                val localOutput = _localOutputs[id] ?: run {
                    promise.reject("Invalid LocalOutput", "LocalOutput not found", null)
                    return@Thread
                }
                val txoutId = randomId()
                _txOuts[txoutId] = localOutput.txout
                promise.resolve(txoutId)
            } catch (error: Throwable) {
                promise.reject("Invalid LocalOutput", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun getLocalOutputKeychain(id: String, promise: Promise) {
        Thread {
            try {
                val localOutput = _localOutputs[id] ?: run {
                    promise.reject("Invalid LocalOutput", "LocalOutput not found", null)
                    return@Thread
                }
                promise.resolve(localOutput.keychain.toString())
            } catch (error: Throwable) {
                promise.reject("Invalid LocalOutput", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun isLocalOutputSpent(id: String, promise: Promise) {
        Thread {
            try {
                val localOutput = _localOutputs[id] ?: run {
                    promise.reject("Invalid LocalOutput", "LocalOutput not found", null)
                    return@Thread
                }
                promise.resolve(localOutput.isSpent)
            } catch (error: Throwable) {
                promise.reject("Invalid LocalOutput", error.localizedMessage, error)
            }
        }.start()
    }
    /** LocalOutput methods ends */

    /** FeeRate methods starts */
    @ReactMethod
    fun createFeeRateFromSatPerVb(satPerVb: Double, promise: Promise) {
        Thread {
            try {
                val feeRate = FeeRate.fromSatPerVb(satPerVb.toLong().toULong())
                val id = randomId()
                _feeRates[id] = feeRate
                promise.resolve(id)
            } catch (error: Throwable) {
                promise.reject("FeeRate error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun createFeeRateFromSatPerKwu(satPerKwu: Double, promise: Promise) {
        Thread {
            try {
                val feeRate = FeeRate.fromSatPerKwu(satPerKwu.toLong().toULong())
                val id = randomId()
                _feeRates[id] = feeRate
                promise.resolve(id)
            } catch (error: Throwable) {
                promise.reject("FeeRate error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun feeRateToSatPerVbCeil(id: String, promise: Promise) {
        Thread {
            try {
                val feeRate = _feeRates[id] ?: run {
                    promise.reject("FeeRate error", "FeeRate not found", null)
                    return@Thread
                }
                promise.resolve(feeRate.toSatPerVbCeil())
            } catch (error: Throwable) {
                promise.reject("FeeRate error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun feeRateToSatPerVbFloor(id: String, promise: Promise) {
        Thread {
            try {
                val feeRate = _feeRates[id] ?: run {
                    promise.reject("FeeRate error", "FeeRate not found", null)
                    return@Thread
                }
                promise.resolve(feeRate.toSatPerVbFloor())
            } catch (error: Throwable) {
                promise.reject("FeeRate error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun feeRateToSatPerKwu(id: String, promise: Promise) {
        Thread {
            try {
                val feeRate = _feeRates[id] ?: run {
                    promise.reject("FeeRate error", "FeeRate not found", null)
                    return@Thread
                }
                promise.resolve(feeRate.toSatPerKwu())
            } catch (error: Throwable) {
                promise.reject("FeeRate error", error.localizedMessage, error)
            }
        }.start()
    }
    /** FeeRate methods ends */

    // `feeAbsolute`
    @ReactMethod
    fun feeAbsolute(id: String, feeRate: Int, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.feeAbsolute(feeRate.toULong())
            result.resolve(true)
        }.start()
    }

    // `drainWallet`
    @ReactMethod
    fun drainWallet(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.drainWallet()
            result.resolve(true)
        }.start()
    }

    // `drainTo`
    @ReactMethod
    fun drainTo(id: String, scriptId: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.drainTo(_scripts[scriptId]!!)
            result.resolve(true)
        }.start()
    }

    // `enableRbf`
    @ReactMethod
    fun enableRbf(id: String, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.enableRbf()
            result.resolve(true)
        }.start()
    }

    // `enableRbfWithSequence`
    @ReactMethod
    fun enableRbfWithSequence(id: String, nsequence: Int, result: Promise) {
        Thread {
            _txBuilders[id] = _txBuilders[id]!!.enableRbfWithSequence(nsequence.toUInt())
            result.resolve(true)
        }.start()
    }

    
    // `setRecipients`
    @ReactMethod
    fun setRecipients(id: String, recipients: ReadableArray, promise: Promise) {
        Thread {
            try {
                val scriptAmounts = mutableListOf<ScriptAmount>()
                
                for (i in 0 until recipients.size()) {
                    val item = recipients.getMap(i)
                    val amountValue = item.getDouble("amount").toLong().toULong()
                    val amount = Amount.fromSat(amountValue)
                    
                    val script = item.getMap("script") ?: throw Exception("Script object not found")
                    val scriptId = script.getString("id") ?: throw Exception("Script ID not found")
                    val scriptObj = _scripts[scriptId] ?: throw Exception("Script not found for ID: $scriptId")
                    
                    val scriptAmount = ScriptAmount(scriptObj, amount)
                    scriptAmounts.add(scriptAmount)
                }
                
                val builder = _txBuilders[id] ?: throw Exception("TxBuilder not found")
                _txBuilders[id] = builder.setRecipients(scriptAmounts)
                promise.resolve(true)
                
            } catch (error: Throwable) {
                promise.reject("Set recipients error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun finish(id: String, walletId: String, promise: Promise) {
        Thread {
            try {
                val builder = _bumpFeeTxBuilders[id] ?: throw Exception("BumpFeeTxBuilder not found")
                val wallet = getWalletById(walletId)
                val result = builder.finish(wallet)
                promise.resolve(result.serialize())
            } catch (error: Throwable) {
                promise.reject("BumpFee TxBuilder finish error", error.localizedMessage, error)
            }
        }.start()
    }
    /** TxBuilder methods ends */

    /** Descriptor Templates method starts */
    @ReactMethod
    fun createDescriptor(descriptor: String, network: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = Descriptor(descriptor, setNetwork(network))
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create Descriptor error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun descriptorAsString(descriptorId: String, result: Promise) {
        Thread {
            result.resolve(_descriptors[descriptorId]!!.asString())
        }.start()
    }

    @ReactMethod
    fun descriptorAsStringPrivate(descriptorId: String, result: Promise) {
        Thread {
            result.resolve(_descriptors[descriptorId]!!.asStringPrivate())
        }.start()
    }

    @ReactMethod
    fun newBip44(secretKeyId: String, keychain: String, network: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip44(
                    _descriptorSecretKeys[secretKeyId]!!,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip44 error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip44Public(
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        result: Promise
    ) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip44Public(
                    _descriptorPublicKeys[publicKeyId]!!,
                    fingerprint,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip44Public error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip49(secretKeyId: String, keychain: String, network: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip49(
                    _descriptorSecretKeys[secretKeyId]!!,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip49 error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip49Public(
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        result: Promise
    ) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip49Public(
                    _descriptorPublicKeys[publicKeyId]!!,
                    fingerprint,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip49Public error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip84(secretKeyId: String, keychain: String, network: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip84(
                    _descriptorSecretKeys[secretKeyId]!!,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip84 error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip84Public(
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        result: Promise
    ) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip84Public(
                    _descriptorPublicKeys[publicKeyId]!!,
                    fingerprint,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip84Public error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip86(secretKeyId: String, keychain: String, network: String, result: Promise) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip86(
                    _descriptorSecretKeys[secretKeyId]!!,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip86 error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun newBip86Public(
        publicKeyId: String,
        fingerprint: String,
        keychain: String,
        network: String,
        result: Promise
    ) {
        Thread {
            try {
                val id = randomId()
                _descriptors[id] = newBip86Public(
                    _descriptorPublicKeys[publicKeyId]!!,
                    fingerprint,
                    setKeychainKind(keychain),
                    setNetwork(network)
                )
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Create bip86Public error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Descriptor Templates method ends */

    /** Psbt method starts */
    @ReactMethod
    fun extractTx(base64: String, promise: Promise) {
        Thread {
            try {
                val id = randomId()
                _transactions[id] = Psbt(base64).extractTx()
                promise.resolve(id)
            } catch (error: Throwable) {
                promise.reject("PSBT extract error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun serialize(base64: String, promise: Promise) {
        Thread {
            try {
                val hex = Psbt(base64).serialize()
                promise.resolve(hex)
            } catch (error: Throwable) {
                promise.reject("Bump TX finish error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun txid(base64: String, promise: Promise) {
        Thread {
            try {
                val txid = Psbt(base64).extractTx().txid()
                promise.resolve(txid)
            } catch (error: Throwable) {
                promise.reject("PSBT txid error", error.localizedMessage, error)
            }
        }.start()
    }
    /** Psbt method ends */

    /** BumpFeeTxBuilder methods starts */
    @ReactMethod
    fun bumpFeeTxBuilderInit(txid: String, newFeeRate: Double, promise: Promise) {
        Thread {
            try {
                val id = randomId()
                val feeRate = FeeRate.fromSatPerVb(newFeeRate.toLong().toULong())
                _bumpFeeTxBuilders[id] = BumpFeeTxBuilder(txid, feeRate)
                promise.resolve(id)
            } catch (error: Throwable) {
                promise.reject("BumpFeeTxBuilder init error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun bumpFeeTxBuilderEnableRbf(id: String, promise: Promise) {
        Thread {
            try {
                val builder = _bumpFeeTxBuilders[id] ?: throw Exception("BumpFeeTxBuilder not found")
                _bumpFeeTxBuilders[id] = builder.enableRbf()
                promise.resolve(true)
            } catch (error: Throwable) {
                promise.reject("BumpFeeTxBuilder enable RBF error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun bumpFeeTxBuilderEnableRbfWithSequence(id: String, nSequence: Double, promise: Promise) {
        Thread {
            try {
                val builder = _bumpFeeTxBuilders[id] ?: throw Exception("BumpFeeTxBuilder not found")
                _bumpFeeTxBuilders[id] = builder.enableRbfWithSequence(nSequence.toUInt())
                promise.resolve(true)
            } catch (error: Throwable) {
                promise.reject("BumpFeeTxBuilder enable RBF with sequence error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun bumpFeeTxBuilderFinish(id: String, walletId: String, promise: Promise) {
        Thread {
            try {
                val builder = _bumpFeeTxBuilders[id] ?: throw Exception("BumpFeeTxBuilder not found")
                val wallet = getWalletById(walletId)
                val result = builder.finish(wallet)
                promise.resolve(result.serialize())
            } catch (error: Throwable) {
                promise.reject("BumpFee TxBuilder finish error", error.localizedMessage, error)
            }
        }.start()
    }
    /** BumpFeeTxBuilder methods ends */

    /** Transaction methods starts*/
    @ReactMethod
    fun createTransaction(bytes: ReadableArray, result: Promise) {
        Thread {
            try {
                val id = randomId()
                val txBytes = getTxBytes(bytes)
                _transactions[id] = Transaction(txBytes)
                result.resolve(id)
            } catch (error: Throwable) {
                result.reject("Transaction creation error", error.localizedMessage, error)
            }
        }.start()
    }

    @ReactMethod
    fun serializeTransaction(id: String, result: Promise) {
        Thread {
            val uBytes = _transactions[id]!!.serialize()
            result.resolve(makeNativeArray(uBytes))
        }.start()
    }

    @ReactMethod
    fun transactionTxid(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.txid())
        }.start()
    }

    @ReactMethod
    fun txWeight(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.weight().toDouble())
        }.start()
    }

    @ReactMethod
    fun txSize(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.totalSize().toDouble())
        }.start()
    }

    @ReactMethod
    fun txVsize(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.vsize().toDouble())
        }.start()
    }

    @ReactMethod
    fun txIsCoinBase(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.isCoinbase())
        }.start()
    }

    @ReactMethod
    fun txIsExplicitlyRbf(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.isExplicitlyRbf())
        }.start()
    }

    @ReactMethod
    fun txIsLockTimeEnabled(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.isLockTimeEnabled())
        }.start()
    }

    @ReactMethod
    fun txVersion(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.version())
        }.start()
    }

    @ReactMethod
    fun txLockTime(id: String, result: Promise) {
        Thread {
            result.resolve(_transactions[id]!!.lockTime().toInt())
        }.start()
    }

    @ReactMethod
    fun txInput(id: String, result: Promise) {
        Thread {
            val items = _transactions[id]!!.input()
            val list: MutableList<Map<String, Any?>> = mutableListOf()
            for (item in items) {
                list.add(createTxIn(item, _scripts))
            }
            result.resolve(Arguments.makeNativeArray(list))
        }.start()
    }

    @ReactMethod
    fun txOutput(id: String, result: Promise) {
        Thread {
            val items = _transactions[id]!!.output()
            val list: MutableList<Map<String, Any?>> = mutableListOf()
            for (item in items) {
                list.add(createTxOut(item, _scripts))
            }
            result.resolve(Arguments.makeNativeArray(list))
        }.start()
    }
    /** Transaction methods ends*/


    /** Script methods starts*/
    @ReactMethod
    fun toBytes(id: String, result: Promise) {
        Thread {
            result.resolve(makeNativeArray(_scripts[id]!!.toBytes()))
        }.start()
    }
    /** Script methods ends*/
}

