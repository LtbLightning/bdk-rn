import { AddressInfo, Balance, BlockTime, LocalUtxo, OutPoint, TransactionDetails, TxOut } from './Bindings';
import { AddressIndex, Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
import { Blockchain } from './Blockchain';

/**
 * Wallet methods
 */
export class Wallet extends NativeLoader {
  isInit: boolean = false;
  id: string = '';

  /**
   * Wallet constructor
   * @param descriptor
   * @param network
   * @returns {Promise<Wallet>}
   */
  async init(descriptor: string, network: Network): Promise<Wallet> {
    this.id = await this._bdk.initWallet(descriptor, network);
    this.isInit = true;
    return this;
  }

  /**
   * Return a derived address using the external descriptor.
   * @param addressIndex
   * @returns {Promise<AddressInfo>}
   */
  async getAddress(addressIndex: AddressIndex = AddressIndex.New): Promise<AddressInfo> {
    let addressInfo = await this._bdk.getAddress(this.id, addressIndex);
    return new AddressInfo(addressInfo.index, addressInfo.address);
  }

  /**
   * Return balance of current wallet
   * @returns {Promise<Balance>}
   */
  async getBalance(): Promise<Balance> {
    let balance = await this._bdk.getBalance(this.id);
    return new Balance(
      balance.trustedPending,
      balance.untrustedPending,
      balance.confirmed,
      balance.spendable,
      balance.total
    );
  }

  /**
   * Get the Bitcoin network the wallet is using.
   * @returns {Promise<string>}
   */
  async network(): Promise<string> {
    return await this._bdk.getNetwork(this.id);
  }

  /**
   * Sync the internal database with the [Blockchain]
   * @returns {Promise<boolean>}
   */
  async sync(blockchain: Blockchain): Promise<boolean> {
    return await this._bdk.sync(this.id, blockchain.id);
  }

  /**
   * Return the list of unspent outputs of this wallet
   * @returns {Promise<Array<LocalUtxo>>}
   */
  async listUnspent(): Promise<Array<LocalUtxo>> {
    let output = await this._bdk.listUnspent(this.id);
    let localUtxo: Array<LocalUtxo> = [];
    output.map((item) => {
      let localObj = new LocalUtxo(
        new OutPoint(item.outpoint.txid, item.outpoint.vout),
        new TxOut(item.txout.value, item.txout.address),
        item.isSpent
      );
      localUtxo.push(localObj);
    });
    return localUtxo;
  }

  /**
   * Return an unsorted list of transactions made and received by the wallet
   * @returns {Promise<Array<TransactionDetails>>}
   */
  async listTransactions(): Promise<Array<TransactionDetails>> {
    let list = await this._bdk.listTransactions(this.id);
    let transactions: Array<TransactionDetails> = [];
    list.map((item) => {
      let localObj = new TransactionDetails(
        item.txid,
        item.received,
        item.sent,
        item?.fee,
        new BlockTime(item.confirmationTime?.height, item.confirmationTime?.timestamp)
      );
      transactions.push(localObj);
    });
    return transactions;
  }
}

// export const Wallet = new WalletInterface();
