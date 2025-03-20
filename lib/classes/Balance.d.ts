import { NativeLoader } from './NativeLoader';
export declare class Balance extends NativeLoader {
    private _walletId;
    constructor(walletId: string);
    /**
     * Get the full balance details
     * @returns {Promise<BalanceDetails>}
     */
    getBalance(): Promise<BalanceDetails>;
    /**
     * Get the immature balance
     * @returns {Promise<number>}
     */
    getImmature(): Promise<number>;
    /**
     * Get the trusted pending balance
     * @returns {Promise<number>}
     */
    getTrustedPending(): Promise<number>;
    /**
     * Get the untrusted pending balance
     * @returns {Promise<number>}
     */
    getUntrustedPending(): Promise<number>;
    /**
     * Get the confirmed balance
     * @returns {Promise<number>}
     */
    getConfirmed(): Promise<number>;
    /**
     * Get the trusted spendable balance
     * @returns {Promise<number>}
     */
    getTrustedSpendable(): Promise<number>;
    /**
     * Get the total balance
     * @returns {Promise<number>}
     */
    getTotal(): Promise<number>;
}
export interface BalanceDetails {
    immature: number;
    trustedPending: number;
    untrustedPending: number;
    confirmed: number;
    trustedSpendable: number;
    total: number;
}
