/**
 * A derived address and the index it was found at For convenience this automatically derefs to Address
 */
export class Address {
    constructor(id) {
        this.id = id;
    }
}
export var KeychainKind;
(function (KeychainKind) {
    KeychainKind["External"] = "external";
    KeychainKind["Internal"] = "internal";
})(KeychainKind || (KeychainKind = {}));
export class AddressInfo {
    constructor(address, keychain) {
        this.address = address;
        this.keychain = keychain;
    }
}
/**
 * A reference to a transaction output.
 */
export class OutPoint {
    constructor(txid, vout) {
        this.txid = txid;
        this.vout = vout;
    }
}
/**
 * A transaction output, which defines new coins to be created from old ones.
 */
export class TxOut {
    constructor(value, script) {
        this.value = value;
        this.script = script;
    }
}
export class Balance {
    constructor(trustedPending, untrustedPending, confirmed, spendable, total) {
        this.trustedPending = trustedPending;
        this.untrustedPending = untrustedPending;
        this.confirmed = confirmed;
        this.spendable = spendable;
        this.total = total;
    }
}
/**
 * Block height and timestamp of a block
 */
export class BlockTime {
    constructor(height, timestamp) {
        this.height = height;
        this.timestamp = timestamp;
    }
}
/**
 * A wallet transaction
 */
export class TransactionDetails {
    constructor(txid, received, sent, fee, confirmationTime, transaction) {
        this.txid = txid;
        this.received = received;
        this.sent = sent;
        this.fee = fee;
        this.confirmationTime = confirmationTime;
        this.transaction = transaction;
    }
}
/**
 * A output script and an amount of satoshis.
 */
export class ScriptAmount {
    constructor(script, amount) {
        this.script = script;
        this.amount = amount;
    }
}
/**
 * Fee Rate class
 */
export class FeeRate {
    constructor(_feeRate) {
        this._feeRate = _feeRate;
    }
    asSatPerVb() {
        return this._feeRate;
    }
}
/**
 * The value returned from calling the .finish() method on the [TxBuilder] or [BumpFeeTxBuilder].
 */
export class TxBuilderResult {
    constructor(psbt, txDetails) {
        this.psbt = psbt;
        this.txDetails = txDetails;
    }
}
export class PubkeyHash {
    constructor(hash) {
        this.pubkeyHash = hash;
    }
}
export class ScriptHash {
    constructor(hash) {
        this.scriptHash = hash;
    }
}
export class WitnessProgram {
    constructor(program, version) {
        this.program = program;
        this.version = version;
    }
}
export class TxIn {
    constructor(previousOutput, scriptSig, sequence, witness) {
        this.previousOutput = previousOutput;
        this.scriptSig = scriptSig;
        this.sequence = sequence;
        this.witness = witness;
    }
}
export class FullScanRequest {
    constructor(id) {
        this.id = id;
    }
}
export class SyncRequest {
    constructor(id) {
        this.id = id;
    }
}
export class Update {
    constructor(id) {
        this.id = id;
    }
}
/**
 * Options for a software signer
 * Adjust the behavior of our software signers and the way a transaction is finalized
 */
export class SignOptions {
    constructor(isMultiSig, trustWitnessUtxo, assumeHeight, allowAllSighashes, removePartialSigs, tryFinalize, signWithTapInternalKey, allowGrinding) {
        this.isMultiSig = isMultiSig;
        this.trustWitnessUtxo = trustWitnessUtxo;
        this.assumeHeight = assumeHeight;
        this.allowAllSighashes = allowAllSighashes;
        this.removePartialSigs = removePartialSigs;
        this.tryFinalize = tryFinalize;
        this.signWithTapInternalKey = signWithTapInternalKey;
        this.allowGrinding = allowGrinding;
    }
}
//# sourceMappingURL=Bindings.js.map