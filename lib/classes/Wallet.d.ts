import { AddressInfo, Balance, LocalUtxo, TransactionDetails } from './Bindings';
import { AddressIndex, Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
import { Blockchain } from './Blockchain';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
import { Descriptor } from './Descriptor';
import { DatabaseConfig } from './DatabaseConfig';
/**
 * Wallet methods
 */
export declare class Wallet extends NativeLoader {
    isInit: boolean;
    id: string;
    /**
     * Wallet constructor
     * @param descriptor
     * @param network
     * @returns {Promise<Wallet>}
     */
    create(descriptor: Descriptor, changeDescriptor: Descriptor | null | undefined, network: Network, dbConfig: DatabaseConfig): Promise<Wallet>;
    /**
     * Return a derived address using the external descriptor.
     * @param addressIndex
     * @returns {Promise<AddressInfo>}
     */
    getAddress(addressIndex: AddressIndex): Promise<AddressInfo>;
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
     * Sync the internal database with the [Blockchain]
     * @returns {Promise<boolean>}
     */
    sync(blockchain: Blockchain): Promise<boolean>;
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
    /**
     * Sign PSBT with wallet
     * @returns
     */
    sign(psbt: PartiallySignedTransaction): Promise<PartiallySignedTransaction>;
}
