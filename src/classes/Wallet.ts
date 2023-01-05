import { AddressInfo, Balance, LocalUtxo } from './Bindings';
import { AddressIndex, Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';

/**
 * Wallet methods
 */
class WalletInterface extends NativeLoader {
  isInit: boolean = false;

  async init(descriptor: string, network: Network): Promise<WalletInterface> {
    let created = await this._bdk.initWallet(descriptor, network);
    if (created) this.isInit = created;
    return this;
  }

  async getAddress(addressIndex: AddressIndex = AddressIndex.New): Promise<AddressInfo> {
    let addressInfo = await this._bdk.getAddress(addressIndex);
    return new AddressInfo(addressInfo.index, addressInfo.address);
  }

  async getBalance(): Promise<Balance> {
    let balance = await this._bdk.getBalance();
    return new Balance(
      balance.trustedPending,
      balance.untrustedPending,
      balance.confirmed,
      balance.spendable,
      balance.total
    );
  }

  async network(): Promise<string> {
    return await this._bdk.getNetwork();
  }

  async sync(): Promise<boolean> {
    return await this._bdk.sync();
  }

  async listUnspent(): Promise<any> {
    let output = await this._bdk.listUnspent();
    console.log(output);
    return true;
  }

  async listTransactions(): Promise<any> {
    let tsx = await this._bdk.listTransactions();
    console.log(tsx);
    return true;
  }
}

export const Wallet = new WalletInterface();
