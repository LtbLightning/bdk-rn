import { OutPoint, TxOut, KeychainKind } from './Bindings';

export class LocalOutput {
  outpoint: OutPoint;
  txout: TxOut;
  keychain: KeychainKind;
  isSpent: boolean;

  constructor(outpoint: OutPoint, txout: TxOut, keychain: KeychainKind, isSpent: boolean) {
    this.outpoint = outpoint;
    this.txout = txout;
    this.keychain = keychain;
    this.isSpent = isSpent;
  }

  /**
   * Get the outpoint of the local output
   * @returns {OutPoint}
   */
  getOutpoint(): OutPoint {
    return this.outpoint;
  }

  /**
   * Get the TxOut of the local output
   * @returns {TxOut}
   */
  getTxout(): TxOut {
    return this.txout;
  }

  /**
   * Get the keychain kind of the local output
   * @returns {KeychainKind}
   */
  getKeychain(): KeychainKind {
    return this.keychain;
  }

  /**
   * Check if the local output is spent
   * @returns {boolean}
   */
  getIsSpent(): boolean {
    return this.isSpent;
  }
}
