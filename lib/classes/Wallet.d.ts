import { AddressInfo, Balance, LocalUtxo, TransactionDetails } from './Bindings';
import { AddressIndex, Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Wallet methods
 */
declare class WalletInterface extends NativeLoader {
    isInit: boolean;
    /**
     * Wallet constructor
     * @param descriptor
     * @param network
     * @returns {Promise<WalletInterface>}
     */
    init(descriptor: string, network: Network): Promise<WalletInterface>;
    /**
     * Return a derived address using the external descriptor.
     * @param addressIndex
     * @returns {Promise<AddressInfo>}
     */
    getAddress(addressIndex?: AddressIndex): Promise<AddressInfo>;
    /**
     * Return balance of current wallet
     * @returns {Promise<Balance>}
     */
    getBalance(): Promise<Balance>;
    /**
     * Get the Bitcoin network the wallet is using.
     * @returns {Promise<string>}
     */
    network(): Promise<string>;
    /**
     * Sync the internal database with the [Blockchain]
     * @returns {Promise<boolean>}
     */
    sync(): Promise<boolean>;
    /**
     * Return the list of unspent outputs of this wallet
     * @returns {Promise<Array<LocalUtxo>>}
     */
    listUnspent(): Promise<Array<LocalUtxo>>;
    /**
     * Return an unsorted list of transactions made and received by the wallet
     * @returns {Promise<Array<TransactionDetails>>}
     */
    listTransactions(): Promise<Array<TransactionDetails>>;
}
export declare const Wallet: WalletInterface;
export {};
