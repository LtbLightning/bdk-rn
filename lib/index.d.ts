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
     * Check if wallet exists or not
     * @return {Promise<Response>}
     */
    walletExists(): Promise<Response>;
    /**
     * unlock wallet
     * @return {Promise<Response>}
     */
    unlockWallet(): Promise<Response>;
    /**
     * Create new wallet
     * @return {Promise<Response>}
     */
    createWallet(mnemonic?: string, password?: string): Promise<Response>;
    /**
     * Restore wallet
     * @return {Promise<Response>}
     */
    restoreWallet(mnemonic: string, password?: string): Promise<Response>;
    /**
     * Reset wallet
     * @return {Promise<Response>}
     */
    resetWallet(): Promise<Response>;
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
}
declare const BdkRn: BdkInterface;
export default BdkRn;
