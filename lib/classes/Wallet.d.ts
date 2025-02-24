import { Network } from '../lib/enums';
import { AddressInfo, Balance, FeeRate, FullScanRequest, KeychainKind, SignOptions, SyncRequest, Update } from './Bindings';
import { Descriptor } from './Descriptor';
import { NativeLoader } from './NativeLoader';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
import { Script } from './Script';
import { Transaction } from './Transaction';
import { LocalOutput } from './LocalOutput';
import { CanonicalTx } from './CanonicalTx';
/**
 * Wallet methods
 */
export declare class Wallet extends NativeLoader {
    isInit: boolean;
    id: string;
    /**
     * Wallet constructor
     * @param descriptor The wallet descriptor
     * @param changeDescriptor The change descriptor
     * @param network The network type
     * @returns {Promise<string>} The wallet ID
     */
    create(descriptor: Descriptor, changeDescriptor: Descriptor | null | undefined, network: Network, persistenceBackendPath: string): Promise<Wallet>;
    /**
     * Reveal the next address for a specific keychain
     * @param keychain The keychain to reveal the next address for
     * @returns {Promise<AddressInfo>} Information about the revealed address
     */
    revealNextAddress(keychain: KeychainKind): Promise<AddressInfo>;
    /**
     * Check if the wallet is yours or not
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
     * Retrieve the list of unspent outputs for the specified wallet.
     * @param walletId The ID of the wallet to retrieve unspent outputs from.
     * @returns {Promise<LocalOutput[]>} A promise that resolves to an array of unspent outputs.
     */
    listUnspent(walletId: string): Promise<LocalOutput[]>;
    /**
     * Sign PSBT with wallet
     * @returns
     */
    sign(psbt: PartiallySignedTransaction, signOptions?: SignOptions): Promise<PartiallySignedTransaction>;
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
     * @returns {Promise<CanonicalTx | null>} The transaction details, or null if not found
     */
    getTx(txid: string): Promise<CanonicalTx | null>;
    /**
     * Get the list of all outputs (spent and unspent) associated with the wallet
     * @returns {Promise<LocalOutput[]>} List of all outputs
     */
    listOutput(): Promise<LocalOutput[]>;
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
    /**
     * Create a new wallet without persistence
     * @param descriptor The wallet descriptor
     * @param changeDescriptor The change descriptor
     * @param network The network type
     * @returns {Promise<string>} The wallet ID
     */
    newNoPersist(descriptor: string, changeDescriptor: string | null, network: string): Promise<string>;
    /**
     * Get all transactions for the wallet
     * @returns {Promise<CanonicalTx[]>} The list of transactions
     */
    transactions(): Promise<CanonicalTx[]>;
}
