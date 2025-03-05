import { Network } from '../lib/enums';
import {
  AddressInfo,
  Balance,
  BlockTime,
  FeeRate,
  FullScanRequest,
  KeychainKind,
  SignOptions,
  SyncRequest,
  TransactionDetails,
  Update,
} from './Bindings';
import { createOutpoint, createTxDetailsObject, createTxOut, getKeychainKind, getNetwork } from '../lib/utils';

import { Descriptor } from './Descriptor';
import { NativeLoader } from './NativeLoader';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
import { Script } from './Script';
import { Transaction } from './Transaction';
import { LocalOutput } from './LocalOutput';
import { CanonicalTx } from './CanonicalTx';

/**
 * Wallet methods
 */export class Wallet extends NativeLoader {
  isInit: boolean = false;
  id: string = '';

  /**
   * Wallet constructor
   * @param descriptor The wallet descriptor
   * @param changeDescriptor The change descriptor
   * @param network The network type
   * @returns {Promise<string>} The wallet ID
   */
    async create(
      descriptor: Descriptor,
      changeDescriptor: Descriptor | null = null,
      network: Network,
      persistenceBackendPath: string
    ): Promise<Wallet> {
      this.id = await this._bdk.walletNew(
        descriptor.id,
        changeDescriptor ? changeDescriptor.id : null,
        persistenceBackendPath,
        network
      );
      this.isInit = true;
      return this;
    }
  /**
   * Reveal the next address for a specific keychain
   * @param keychain The keychain to reveal the next address for
   * @returns {Promise<AddressInfo>} Information about the revealed address
   */
  async revealNextAddress(keychain: KeychainKind): Promise<AddressInfo> {
    const result = await this._bdk.walletRevealNextAddress(this.id, keychain);
    return new AddressInfo(result.address, result.keychain);
  }

  /**
   * Check if the wallet is yours or not
   * @param script
   * @returns {Promise<boolean>}
   */
  async isMine(script: Script): Promise<boolean> {
    return await this._bdk.isMine(this.id, script.id);
  }

  /**
   * Return balance of current wallet
   * @returns {Promise<Balance>}
   */
  async getBalance(): Promise<Balance> {
    let balance = await this._bdk.getBalance(this.id);
    return new Balance(
      balance.trustedPending,
      balance.untrustedPending,
      balance.confirmed,
      balance.spendable,
      balance.total
    );
  }

  /**
   * Get the Bitcoin network the wallet is using.
   * @returns {Promise<string>}
   */
  async network(): Promise<Network> {
    let networkName = await this._bdk.getNetwork(this.id);
    return getNetwork(networkName);
  }

  /**
   * Retrieve the list of unspent outputs for the specified wallet.
   * @param walletId The ID of the wallet to retrieve unspent outputs from.
   * @returns {Promise<LocalOutput[]>} A promise that resolves to an array of unspent outputs.
   */
  async listUnspent(walletId: string): Promise<LocalOutput[]> {
    try {
      // Call the wallet's listUnspent method to fetch unspent outputs
      const outputs = await this._bdk.listUnspent(walletId);

      // Map the outputs to LocalOutput instances
      return outputs.map((item) => {
        return new LocalOutput(
          createOutpoint(item.outpoint),
          createTxOut(item.txout),
          item.keychain as KeychainKind,
          item.isSpent
        );
      });
    } catch (error) {
      // Log any errors that occur during the fetching process
      console.error('Error fetching unspent outputs:', error);

      // Rethrow the error to be handled by the caller
      throw error;
    }
  }

  /**
   * Sign PSBT with wallet
   * @returns
   */
  async sign(psbt: PartiallySignedTransaction, signOptions?: SignOptions): Promise<PartiallySignedTransaction> {
    let signed = await this._bdk.sign(this.id, psbt.base64, signOptions);
    return new PartiallySignedTransaction(signed);
  }

  /**
   * Start a sync process with revealed spending keys
   * @returns {Promise<SyncRequest>} A new sync request
   */
  async startSyncWithRevealedSpks(): Promise<SyncRequest> {
    const syncRequestId = await this._bdk.walletStartSyncWithRevealedSpks(this.id);
    return new SyncRequest(syncRequestId);
  }

  /**
   * Apply an update to the wallet
   * @param update The update to apply
   * @returns {Promise<void>}
   */
  async applyUpdate(update: Update): Promise<void> {
    await this._bdk.walletApplyUpdate(this.id, update.id);
  }

  /**
   * Calculate the fee for a transaction
   * @param tx The transaction to calculate the fee for
   * @returns {Promise<number>} The calculated fee
   */
  async calculateFee(tx: Transaction): Promise<number> {
    return await this._bdk.walletCalculateFee(this.id, tx.id);
  }

  /**
   * Calculate the fee rate for a transaction
   * @param tx The transaction to calculate the fee rate for
   * @returns {Promise<FeeRate>} The calculated fee rate
   */
  async calculateFeeRate(tx: Transaction): Promise<FeeRate> {
    const feeRateId = await this._bdk.walletCalculateFeeRate(this.id, tx.id);
    return new FeeRate(parseFloat(feeRateId));
  }

  /**
   * Commit pending wallet operations
   * @returns {Promise<boolean>} True if commit was successful, false otherwise
   */
  async commit(): Promise<boolean> {
    return await this._bdk.walletCommit(this.id);
  }

  /**
   * Get details of a specific transaction
   * @param txid The transaction ID to look up
   * @returns {Promise<CanonicalTx | null>} The transaction details, or null if not found
   */
  async getTx(txid: string): Promise<CanonicalTx | null> {
    try {
      const result = await this._bdk.walletGetTx(this.id, txid);
      if (result) {
        // Assuming result is already a CanonicalTx or can be directly used
        return result; // Directly return the result if it's already a CanonicalTx
      }
      return null;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error; // Rethrow the error after logging
    }
  }

  /**
   * Get the list of all outputs (spent and unspent) associated with the wallet
   * @returns {Promise<LocalOutput[]>} List of all outputs
   */
  async listOutput(): Promise<LocalOutput[]> {
    const outputs = await this._bdk.walletListOutput(this.id);
    return outputs.map((output) => {
      const outpoint = createOutpoint(output.outpoint); // Assuming createOutpoint is a function that converts the outpoint
      const txout = createTxOut(output.txout); // Assuming createTxOut is a function that converts the txout
      const keychain = output.keychain as KeychainKind; // Convert to KeychainKind if necessary
      return new LocalOutput(outpoint, txout, keychain, output.isSpent);
    });
  }

  /**
   * Reveal the next address for a specific keychain
   * @param keychain The keychain to reveal the next address for
   * @returns {Promise<AddressInfo>} Information about the revealed address
   */
  async walletRevealNextAddress(keychain: KeychainKind): Promise<AddressInfo> {
    const result = await this._bdk.walletRevealNextAddress(this.id, keychain);
    return new AddressInfo(result.address, result.keychain);
  }

  /**
   * Calculate the amount sent and received in a transaction
   * @param tx The transaction to analyze
   * @returns {Promise<{ sent: number; received: number }>} The amounts sent and received
   */
  async sentAndReceived(tx: Transaction): Promise<{ sent: number; received: number }> {
    return await this._bdk.walletSentAndReceived(this.id, tx.id);
  }

  /**
   * Start a full scan of the wallet
   * @returns {Promise<FullScanRequest>} A new full scan request
   */
  async startFullScan(): Promise<FullScanRequest> {
    const fullScanRequestId = await this._bdk.walletStartFullScan(this.id);
    return new FullScanRequest(fullScanRequestId);
  }

  /**
   * Create a new wallet without persistence
   * @param descriptor The wallet descriptor
   * @param changeDescriptor The change descriptor
   * @param network The network type
   * @returns {Promise<string>} The wallet ID
   */
  async newNoPersist(descriptor: string, changeDescriptor: string | null, network: string): Promise<string> {
    const walletId = await this._bdk.walletNewNoPersist(descriptor, changeDescriptor, network);
    return walletId;
  }

  /**
   * Get all transactions for the wallet
   * @returns {Promise<CanonicalTx[]>} The list of transactions
   */
  async transactions(): Promise<CanonicalTx[]> {
    try {
      // Fetch the transactions from the wallet using the wallet ID
      const transactions = await this._bdk.walletTransactions(this.id);
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }
}
