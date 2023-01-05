import { AddressInfo, Balance } from './Bindings';
import { AddressIndex, Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Wallet methods
 */
declare class WalletInterface extends NativeLoader {
    isInit: boolean;
    init(descriptor: string, network: Network): Promise<WalletInterface>;
    getAddress(addressIndex?: AddressIndex): Promise<AddressInfo>;
    getBalance(): Promise<Balance>;
    network(): Promise<string>;
    sync(): Promise<boolean>;
    listUnspent(): Promise<any>;
    listTransactions(): Promise<any>;
}
export declare const Wallet: WalletInterface;
export {};
