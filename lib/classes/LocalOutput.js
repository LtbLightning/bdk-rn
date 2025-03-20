export class LocalOutput {
    constructor(outpoint, txout, keychain, isSpent) {
        this.outpoint = outpoint;
        this.txout = txout;
        this.keychain = keychain;
        this.isSpent = isSpent;
    }
    /**
     * Get the outpoint of the local output
     * @returns {OutPoint}
     */
    getOutpoint() {
        return this.outpoint;
    }
    /**
     * Get the TxOut of the local output
     * @returns {TxOut}
     */
    getTxout() {
        return this.txout;
    }
    /**
     * Get the keychain kind of the local output
     * @returns {KeychainKind}
     */
    getKeychain() {
        return this.keychain;
    }
    /**
     * Check if the local output is spent
     * @returns {boolean}
     */
    getIsSpent() {
        return this.isSpent;
    }
}
//# sourceMappingURL=LocalOutput.js.map