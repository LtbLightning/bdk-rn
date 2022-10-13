import { Result } from '@synonymdev/result';
import { BroadcastTransactionRequest, ConfirmedTransaction, CreateDescriptorRequest, CreateExtendedKeyRequest, createWalletRequest, createWalletResponse, GenerateMnemonicRequest, PendingTransaction, TransactionsResponse } from './lib/interfaces';
declare class BdkInterface {
    _bdk: any;
    constructor();
    /**
     * Generate mnemonic seed phrase of specified entropy and length
     * @return {Promise<Result<string>>}
     */
    generateMnemonic(args?: GenerateMnemonicRequest): Promise<Result<string>>;
    /**
     * Generate extended key from network, seed and password
     * @return {Promise<Result<string>>}
     */
    createExtendedKey(args: CreateExtendedKeyRequest): Promise<Result<string>>;
    /**
     * Create xprv from network, seed and password
     * @return {Promise<Result<string>>}
     */
    createXprv(args: CreateExtendedKeyRequest): Promise<Result<string>>;
    /**
     * Create descriptor based on different parameters
     * @return {Promise<Result<string>>}
     */
    createDescriptor(args: CreateDescriptorRequest): Promise<Result<string>>;
    /**
     * Init wallet
     * @return {Promise<Result<createWalletResponse>>}
     */
    createWallet(args: createWalletRequest): Promise<Result<createWalletResponse>>;
    /**
     * Sync wallet
     * @return {Promise<Result<string>>}
     */
    syncWallet(): Promise<Result<string>>;
    /**
     * Get new address
     * @return {Promise<Result<string>>}
     */
    getNewAddress(): Promise<Result<string>>;
    /**
     * Get wallet balance
     * @return {Promise<Result<string>>}
     */
    getBalance(): Promise<Result<string>>;
    /**
     * Broadcast Transaction
     * @return {Promise<Result<string>>}
     */
    broadcastTx(args: BroadcastTransactionRequest): Promise<Result<string>>;
    /**
     * Get pending transactions
     * @return {Promise<Result<Array<PendingTransaction>>>}
     */
    getPendingTransactions(): Promise<Result<Array<PendingTransaction>>>;
    /**
     * Get pending transactions
     * @return {Promise<Result<Array<ConfirmedTransaction>>>}
     */
    getConfirmedTransactions(): Promise<Result<Array<ConfirmedTransaction>>>;
    /**
     * Get all transactions
     * @return {Promise<Result<TransactionsResponse>>}
     */
    getTransactions(): Promise<Result<TransactionsResponse>>;
}
declare const BdkRn: BdkInterface;
export default BdkRn;
