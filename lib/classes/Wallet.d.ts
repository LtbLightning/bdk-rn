import { Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Wallet methods
 */
declare class WalletInterface extends NativeLoader {
    init(descriptor: string, network: Network): Promise<WalletInterface>;
}
export declare const Wallet: WalletInterface;
export {};
