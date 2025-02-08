import { Network } from '../lib/enums';
import { AddressInfo, Balance, FeeRate, FullScanRequest, KeychainKind, LocalUtxo, SignOptions, SyncRequest, TransactionDetails, Update } from './Bindings';
import { Blockchain } from './Blockchain';
import { DatabaseConfig } from './DatabaseConfig';
import { Descriptor } from './Descriptor';
import { NativeLoader } from './NativeLoader';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
import { Script } from './Script';
import { Transaction } from './Transaction';
/**
 * Wallet methods
 */
export declare class Wallet extends NativeLoader {
    isInit: boolean;
    id: string;
    /**
     * Wallet constructor
     * @param descriptor
     * @param network
     * @returns {Promise<Wallet>}
     */
    create(descriptor: Descriptor, changeDescriptor: Descriptor | null | undefined, network: Network, dbConfig: DatabaseConfig): Promise<Wallet>;
    /**
     * Reveal the next address for a specific keychain
     * @param keychain The keychain to reveal the next address for
     * @returns {Promise<AddressInfo>} Information about the revealed address
     */
    revealNextAddress(keychain: KeychainKind): Promise<AddressInfo>;
    /**
     * check if the wallet is yours or not
     * @param script
     * @returns {Promise<boolean>}
     */
    isMine(script: Script): Promise<boolean>;
    /**
     * Return balance of current wallet
     * @returns {Promise<Balance>}
     */
    getBalance(): Promise<Balance>;
    /**
     * Get the Bitcoin network the wallet is using.
     * @returns {Promise<string>}
     */
    network(): Promise<Network>;
    /**
     * Sync the internal database with the [Blockchain]
     * @returns {Promise<boolean>}
     */
    sync(blockchain: Blockchain): Promise<boolean>;
    /**
     * Return the list of unspent outputs of this wallet
     * @returns {Promise<Array<LocalUtxo>>}
     */
    listUnspent(): Promise<Array<LocalUtxo>>;
    /**
     * Return an unsorted list of transactions made and received by the wallet
     * @returns {Promise<Array<TransactionDetails>>}
     */
    listTransactions(includeRaw: boolean): Promise<Array<TransactionDetails>>;
    /**
     * Sign PSBT with wallet
     * @returns
     */
    sign(psbt: PartiallySignedTransaction, signOptions?: SignOptions): Promise<PartiallySignedTransaction>;
    /**
   * Sync the wallet using a specific sync request
   * @param syncRequest The sync request to use
   * @param blockchain The blockchain to sync with
   * @param batchSize The number of transactions to process in each batch
   * @param fetchPrevTxouts Whether to fetch previous transaction outputs
   * @returns {Promise<void>}
   */
    walletSync(syncRequest: SyncRequest, blockchain: Blockchain, batchSize: number, fetchPrevTxouts: boolean): Promise<void>;
    /**
     * Start a sync process with revealed spending keys
     * @returns {Promise<SyncRequest>} A new sync request
     */
    startSyncWithRevealedSpks(): Promise<SyncRequest>;
    /**
     * Apply an update to the wallet
     * @param update The update to apply
     * @returns {Promise<void>}
     */
    applyUpdate(update: Update): Promise<void>;
    /**
     * Calculate the fee for a transaction
     * @param tx The transaction to calculate the fee for
     * @returns {Promise<number>} The calculated fee
     */
    calculateFee(tx: Transaction): Promise<number>;
    /**
     * Calculate the fee rate for a transaction
     * @param tx The transaction to calculate the fee rate for
     * @returns {Promise<FeeRate>} The calculated fee rate
     */
    calculateFeeRate(tx: Transaction): Promise<FeeRate>;
    /**
     * Commit pending wallet operations
     * @returns {Promise<boolean>} True if commit was successful, false otherwise
     */
    commit(): Promise<boolean>;
    /**
     * Get details of a specific transaction
     * @param txid The transaction ID to look up
     * @returns {Promise<TransactionDetails | null>} The transaction details, or null if not found
     */
    getTx(txid: string): Promise<TransactionDetails | null>;
    /**
     * Get the list of all outputs (spent and unspent) associated with the wallet
     * @returns {Promise<LocalUtxo[]>} List of all outputs
     */
    listOutput(): Promise<LocalUtxo[]>;
    /**
     * Reveal the next address for a specific keychain
     * @param keychain The keychain to reveal the next address for
     * @returns {Promise<AddressInfo>} Information about the revealed address
     */
    walletRevealNextAddress(keychain: KeychainKind): Promise<AddressInfo>;
    /**
     * Calculate the amount sent and received in a transaction
     * @param tx The transaction to analyze
     * @returns {Promise<{ sent: number; received: number }>} The amounts sent and received
     */
    sentAndReceived(tx: Transaction): Promise<{
        sent: number;
        received: number;
    }>;
    /**
     * Start a full scan of the wallet
     * @returns {Promise<FullScanRequest>} A new full scan request
     */
    startFullScan(): Promise<FullScanRequest>;
}
