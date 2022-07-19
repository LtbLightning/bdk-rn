import { NativeModules } from 'react-native';
import { failure, success, _exists } from './lib/utils';
import { createWalletResponse, Response } from './lib/interfaces';

class BdkInterface {
  public _bdk: any;

  constructor() {
    this._bdk = NativeModules.BdkRnModule;
  }

  /**
   * Gen seed of 12 words
   * @return {Promise<Response>}
   */
  async genSeed(password: string = ''): Promise<Response> {
    try {
      const seed = await this._bdk.genSeed(password);
      return success(seed);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Create descriptor from seed and password
   * @return {Promise<Response>}
   */
  async createDescriptor(mnemonic: string, password: string = ''): Promise<Response> {
    try {
      const descriptor = await this._bdk.createDescriptor(mnemonic, password);
      return success(descriptor);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Init wallet
   * @return {Promise<Response>}
   */
  async initWallet(
    mnemonic: string,
    password: string = '',
    network: string = '',
    blockChainConfigUrl: string = '',
    blockChainSocket5: string = '',
    retry: string = '',
    timeOut: string = '',
    blockChain: string = ''
  ): Promise<Response> {
    try {
      if (!_exists(mnemonic)) throw 'Required mnemonic parameter is emtpy.';
      const wallet = await this._bdk.initWallet(
        mnemonic,
        password,
        network,
        blockChainConfigUrl,
        blockChainSocket5,
        retry,
        timeOut,
        blockChain
      );
      return success(wallet);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Get new address
   * @return {Promise<Response>}
   */
  async getNewAddress(): Promise<Response> {
    try {
      const address = await this._bdk.getNewAddress();
      return success(address);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Get wallet balance
   * @return {Promise<Response>}
   */
  async getBalance(): Promise<Response> {
    try {
      const balance = await this._bdk.getBalance();
      return success(balance);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Broadcast Transaction
   * @return {Promise<Response>}
   */
  async broadcastTx(address: string, amount: number): Promise<Response> {
    try {
      if (!_exists(address) || !_exists(amount)) throw 'Required address or amount parameters are missing.';
      if (isNaN(amount)) throw 'Entered amount is invalid';
      const tx = await this._bdk.broadcastTx(address, amount);
      return success(tx);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Get pending transactions
   * @return {Promise<Response>}
   */
  async getPendingTransactions(): Promise<Response> {
    try {
      const response = await this._bdk.getPendingTransactions();
      return success(response);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Get pending transactions
   * @return {Promise<Response>}
   */
  async getConfirmedTransactions(): Promise<Response> {
    try {
      const response = await this._bdk.getConfirmedTransactions();
      return success(response);
    } catch (e: any) {
      return failure(e);
    }
  }
}

const BdkRn = new BdkInterface();
export default BdkRn;
