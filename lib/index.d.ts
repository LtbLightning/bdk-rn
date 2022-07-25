import { BroadcastTransactionRequest, GenerateMnemonicRequest, createWalletRequest, Response, CreateDescriptorRequest, GenerateExtendedKeyRequest } from './lib/interfaces';
declare class BdkInterface {
    _bdk: any;
    constructor();
    /**
     * Generate mnemonic seed phrase of specified entropy and length
     * @return {Promise<Response>}
     */
    generateMnemonic(args: GenerateMnemonicRequest): Promise<Response>;
    /**
     * Generate extended key from netowrk, seed and password
     * @return {Promise<Response>}
     */
    generateExtendedKey(args: GenerateExtendedKeyRequest): Promise<Response>;
    /**
     * Generate extended key from netowrk, seed and password
     * @return {Promise<Response>}
     */
    generateXprv(args: GenerateExtendedKeyRequest): Promise<Response>;
    /**
     * Create descriptor based on different parameters
     * @return {Promise<Response>}
     */
    createDescriptor(args: CreateDescriptorRequest): Promise<Response>;
    /**
     * Init wallet
     * @return {Promise<Response>}
     */
    createWallet(args: createWalletRequest): Promise<Response>;
    /**
     * Get new address
     * @return {Promise<Response>}
     */
    getNewAddress(): Promise<Response>;
    /**
     * Get wallet balance
     * @return {Promise<Response>}
     */
    getBalance(): Promise<Response>;
    /**
     * Broadcast Transaction
     * @return {Promise<Response>}
     */
    broadcastTx(args: BroadcastTransactionRequest): Promise<Response>;
    /**
     * Get pending transactions
     * @return {Promise<Response>}
     */
    getPendingTransactions(): Promise<Response>;
    /**
     * Get pending transactions
     * @return {Promise<Response>}
     */
    getConfirmedTransactions(): Promise<Response>;
}
declare const BdkRn: BdkInterface;
export default BdkRn;
