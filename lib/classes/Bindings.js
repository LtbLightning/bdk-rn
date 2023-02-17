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
    constructor(value, address) {
        this.value = value;
        this.address = address;
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
//# sourceMappingURL=Bindings.js.map