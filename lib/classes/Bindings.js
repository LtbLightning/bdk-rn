/**
 * A derived address and the index it was found at For convenience this automatically derefs to Address
 */
export class AddressInfo {
    constructor(index, address) {
        this.index = index;
        this.address = address;
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
/**
 * Unspent outputs of this wallet
 */
export class LocalUtxo {
    constructor(outpoint, txout, isSpent) {
        this.outpoint = outpoint;
        this.txout = txout;
        this.isSpent = isSpent;
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
    constructor(txid, received, sent, fee, confirmationTime) {
        this.txid = txid;
        this.received = received;
        this.sent = sent;
        this.fee = fee;
        this.confirmationTime = confirmationTime;
    }
}
/**
 * Address script class
 */
export class Script {
    constructor(id) {
        this.id = id;
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
//# sourceMappingURL=Bindings.js.map