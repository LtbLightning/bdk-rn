import { Wallet } from './Wallet';
import { Script } from './Bindings';
import { NativeLoader } from './NativeLoader';
/**
 * TxBuilder methods
 */
export declare class TxBuilder extends NativeLoader {
    id: string;
    /**
     * Create TxBuilder at native side
     * @returns {Promise<TxBuilder>}
     */
    create(): Promise<TxBuilder>;
    /**
     * Add recipient
     * @param script
     * @param amount
     * @returns {Promise<TxBuilder>}
     */
    addRecipient(script: Script, amount: number): Promise<TxBuilder>;
    /**
     * Finishes the transaction building
     * @param wallet
     * @returns
     */
    finish(wallet: Wallet): Promise<any>;
}
