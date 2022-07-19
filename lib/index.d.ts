import { Response } from './lib/interfaces';
declare class BdkInterface {
    _bdk: any;
    constructor();
    /**
     * Gen seed of 12 words
     * @return {Promise<Response>}
     */
    genSeed(password?: string): Promise<Response>;
    /**
     * Create descriptor from seed and password
     * @return {Promise<Response>}
     */
    createDescriptor(mnemonic: string, password?: string): Promise<Response>;
    /**
     * Init wallet
     * @return {Promise<Response>}
     */
    initWallet(mnemonic: string, password?: string, network?: string, blockChainConfigUrl?: string, blockChainSocket5?: string, retry?: string, timeOut?: string, blockChain?: string): Promise<Response>;
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
    broadcastTx(address: string, amount: number): Promise<Response>;
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
