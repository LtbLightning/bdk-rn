import { NativeLoader } from './NativeLoader';
import { OutPoint, TxOut, LocalUtxo, KeychainKind, Script } from 'bdk-rn/src/classes/Bindings';

export class LocalOutput extends NativeLoader {
  private localUtxo: LocalUtxo;
 private static _bdk: any;

  constructor(localUtxo: LocalUtxo) {
    super();
    this.localUtxo = localUtxo;
  }

  /**
   * Get the outpoint of the local output
   * @returns {OutPoint}
   */
  getOutpoint(): OutPoint {
    return this.localUtxo.outpoint;
  }

  /**
   * Get the TxOut of the local output
   * @returns {TxOut}
   */
  getTxout(): TxOut {
    return this.localUtxo.txout;
  }

  /**
   * Get the keychain kind of the local output
   * @returns {KeychainKind}
   */
  getKeychain(): KeychainKind {
    return this.localUtxo.keychain;
  }

  /**
   * Check if the local output is spent
   * @returns {boolean}
   */
  isSpent(): boolean {
    return this.localUtxo.isSpent;
  }

  /**
   * Create a LocalOutput instance from native data
   * @param {string} id - The id returned from native code
   * @returns {Promise<LocalOutput>}
   */
  static async fromId(id: string): Promise<LocalOutput> {
    const nativeData = await this._bdk.getLocalOutputData(id);
    const outpoint = new OutPoint(nativeData.txid, nativeData.vout);
    const script = new Script(nativeData.scriptPubkey);
    const txout = new TxOut(nativeData.value, script);
    const localUtxo = new LocalUtxo(outpoint, txout, nativeData.isSpent, nativeData.keychain);
    return new LocalOutput(localUtxo);
  }
}