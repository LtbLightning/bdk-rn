import { Address } from './Address';
import { KeychainKind } from '../lib/enums';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
import { Script } from './Script';
import { Transaction } from './Transaction';

/**
 * A derived address and the index it was found at For convenience this automatically derefs to Address
 */
export class AddressInfo {
  /**
   * Child index of this address
   */
  index: number;

  /**
   * Address
   */
  address: Address;

  /**
   * KeychainKind
   */
  keychain: KeychainKind;

  constructor(index: number, address: Address, keychain: KeychainKind) {
    this.index = index;
    this.address = address;
    this.keychain = keychain;
  }
}

/**
 * A reference to a transaction output.
 */
export class OutPoint {
  /**
   * The referenced transaction's txid.
   */
  txid: string;

  /**
   * The index of the referenced output in its transaction's vout.
   */
  vout: number;

  constructor(txid: string, vout: number) {
    this.txid = txid;
    this.vout = vout;
  }
}

/**
 * A transaction output, which defines new coins to be created from old ones.
 */
export class TxOut {
  /**
   * The value of the output, in satoshis.
   */
  value: number;

  /**
   * The address script of the output.
   */
  script: Script;

  constructor(value: number, script: Script) {
    this.value = value;
    this.script = script;
  }
}

/**
 * Unspent outputs of this wallet
 */
export class LocalUtxo {
  /**
   * Reference to a transaction output
   */
  outpoint: OutPoint;

  /**
   * Transaction output
   */
  txout: TxOut;

  /**
   * Whether this UTXO is spent or not
   */
  isSpent: boolean;

  keychain: KeychainKind;

  constructor(outpoint: OutPoint, txout: TxOut, isSpent: boolean, keychain: KeychainKind) {
    this.outpoint = outpoint;
    this.txout = txout;
    this.isSpent = isSpent;
    this.keychain = keychain;
  }
}

export class Balance {
  /**
   * Unconfirmed UTXOs generated by a wallet tx
   */
  trustedPending: number;

  /**
   * Unconfirmed UTXOs received from an external wallet
   */
  untrustedPending: number;

  /**
   * Confirmed and immediately spendable balance
   */
  confirmed: number;

  /**
   * Get sum of trusted_pending and confirmed coins
   */
  spendable: number;

  /**
   * Get the whole balance visible to the wallet
   */
  total: number;

  constructor(trustedPending: number, untrustedPending: number, confirmed: number, spendable: number, total: number) {
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
  /**
   * Confirmation block height
   */
  height: number | undefined;

  /**
   * Confirmation block timestamp
   */
  timestamp: number | undefined;

  constructor(height: number | undefined, timestamp: number | undefined) {
    this.height = height;
    this.timestamp = timestamp;
  }
}

/**
 * A wallet transaction
 */
export class TransactionDetails {
  /**
   * Transaction id.
   */
  txid: string;

  /**
   * Received value (sats)
   * Sum of owned outputs of this transaction.
   */
  received: number;

  /**
   * Sent value (sats)
   * Sum of owned inputs of this transaction.
   */
  sent: number;

  /**
   * Fee value (sats) if confirmed.
   * The availability of the fee depends on the backend. It's never None with an Electrum
   * Server backend, but it could be None with a Bitcoin RPC node without txindex that receive funds while offline.
   */
  fee?: number | undefined;

  /**
   * If the transaction is confirmed, contains height and timestamp of the block containing the
   * transaction, unconfirmed transaction contains `None`.
   */
  confirmationTime?: BlockTime;

  /**
   * Transaction object or Null
   */
  transaction?: Transaction | null;

  constructor(
    txid: string,
    received: number,
    sent: number,
    fee: number | undefined,
    confirmationTime: BlockTime,
    transaction: Transaction | null
  ) {
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
  script: Script;
  amount: number;
  constructor(script: Script, amount: number) {
    this.script = script;
    this.amount = amount;
  }
}

/**
 * Fee Rate class
 */
export class FeeRate {
  _feeRate: number;

  constructor(_feeRate: number) {
    this._feeRate = _feeRate;
  }

  asSatPerVb(): number {
    return this._feeRate;
  }
}

/**
 * The value returned from calling the .finish() method on the [TxBuilder] or [BumpFeeTxBuilder].
 */
export class TxBuilderResult {
  psbt: PartiallySignedTransaction;
  txDetails: TransactionDetails;

  constructor(psbt: PartiallySignedTransaction, txDetails: TransactionDetails) {
    this.psbt = psbt;
    this.txDetails = txDetails;
  }
}

export class PubkeyHash {
  pubkeyHash: string;
  constructor(hash: string) {
    this.pubkeyHash = hash;
  }
}

export class ScriptHash {
  scriptHash: string;
  constructor(hash: string) {
    this.scriptHash = hash;
  }
}

export class WitnessProgram {
  program: Array<number>;
  version: string;
  constructor(program: Array<number>, version: string) {
    this.program = program;
    this.version = version;
  }
}

export class TxIn {
  previousOutput: OutPoint;
  scriptSig: Script;
  sequence: number;
  witness: Array<number>;

  constructor(previousOutput: OutPoint, scriptSig: Script, sequence: number, witness: Array<number>) {
    this.previousOutput = previousOutput;
    this.scriptSig = scriptSig;
    this.sequence = sequence;
    this.witness = witness;
  }
}

/**
 * Options for a software signer
 * Adjust the behavior of our software signers and the way a transaction is finalized
 */
export class SignOptions {
  /// Whether the provided transaction is a multi-sig transaction
  isMultiSig: boolean;

  /// Whether the signer should trust the `witness_utxo`, if the `non_witness_utxo` hasn't been
  /// provided
  ///
  /// Defaults to `false` to mitigate the "SegWit bug" which should trick the wallet into
  /// paying a fee larger than expected.
  ///
  /// Some wallets, especially if relatively old, might not provide the `non_witness_utxo` for
  /// SegWit transactions in the PSBT they generate: in those cases setting this to `true`
  /// should correctly produce a signature, at the expense of an increased trust in the creator
  /// of the PSBT.
  ///
  /// For more details see: <https://blog.trezor.io/details-of-firmware-updates-for-trezor-one-version-1-9-1-and-trezor-model-t-version-2-3-1-1eba8f60f2dd>
  trustWitnessUtxo: boolean;

  /// Whether the wallet should assume a specific height has been reached when trying to finalize
  /// a transaction
  ///
  /// The wallet will only "use" a timelock to satisfy the spending policy of an input if the
  /// timelock height has already been reached. This option allows overriding the "current height" to let the
  /// wallet use timelocks in the future to spend a coin.
  assumeHeight: number;

  /// Whether the signer should use the `sighash_type` set in the PSBT when signing, no matter
  /// what its value is
  ///
  /// Defaults to `false` which will only allow signing using `SIGHASH_ALL`.
  allowAllSighashes: boolean;

  /// Whether to remove partial signatures from the PSBT inputs while finalizing PSBT.
  ///
  /// Defaults to `true` which will remove partial signatures during finalization.
  removePartialSigs: boolean;

  /// Whether to try finalizing the PSBT after the inputs are signed.
  ///
  /// Defaults to `true` which will try finalizing PSBT after inputs are signed.
  tryFinalize: boolean;

  /// Whether we should try to sign a taproot transaction with the taproot internal key
  /// or not. This option is ignored if we're signing a non-taproot PSBT.
  ///
  /// Defaults to `true`, i.e., we always try to sign with the taproot internal key.
  signWithTapInternalKey: boolean;

  /// Whether we should grind ECDSA signature to ensure signing with low r
  /// or not.
  /// Defaults to `true`, i.e., we always grind ECDSA signature to sign with low r.
  allowGrinding: boolean;

  constructor(
    isMultiSig: boolean,
    trustWitnessUtxo: boolean,
    assumeHeight: number,
    allowAllSighashes: boolean,
    removePartialSigs: boolean,
    tryFinalize: boolean,
    signWithTapInternalKey: boolean,
    allowGrinding: boolean
  ) {
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
