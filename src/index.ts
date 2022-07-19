import { NativeModules } from 'react-native';
import { failure, success, _exists } from './lib/utils';
import {
  BroadcastTransactionRequest,
  CreateDescriptorRequest,
  GenSeedRequest,
  InitWalletRequest,
  InitWalletResponse,
  Response,
} from './lib/interfaces';

class BdkInterface {
  public _bdk: any;

  constructor() {
    this._bdk = NativeModules.BdkRnModule;
  }

  /**
   * Gen seed of 12 words
   * @return {Promise<Response>}
   */
  async genSeed(args: GenSeedRequest): Promise<Response> {
    try {
      const { password } = args;
      const seed: string = await this._bdk.genSeed(password);
      return success(seed);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Create descriptor from seed and password
   * @return {Promise<Response>}
   */
  async createDescriptor(args: CreateDescriptorRequest): Promise<Response> {
    try {
      const { mnemonic, password } = args;
      const descriptor: string = await this._bdk.createDescriptor(mnemonic, password);
      return success(descriptor);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Init wallet
   * @return {Promise<Response>}
   */
  async initWallet(args: InitWalletRequest): Promise<Response> {
    try {
      const {
        mnemonic,
        descriptor,
        useDescriptor,
        password,
        network,
        blockChainConfigUrl,
        blockChainSocket5,
        retry,
        timeOut,
        blockChainName,
      } = args;
      if (useDescriptor && !_exists(descriptor)) throw 'Required descriptor parameter is emtpy.';
      if (!useDescriptor && !_exists(mnemonic)) throw 'Required mnemonic parameter is emtpy.';
      const wallet: InitWalletResponse = await this._bdk.initWallet(
        mnemonic,
        password,
        network,
        blockChainConfigUrl,
        blockChainSocket5,
        retry,
        timeOut,
        blockChainName,
        useDescriptor ? descriptor : ''
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
      const address: string = await this._bdk.getNewAddress();
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
      const balance: string = await this._bdk.getBalance();
      return success(balance);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Broadcast Transaction
   * @return {Promise<Response>}
   */
  async broadcastTx(args: BroadcastTransactionRequest): Promise<Response> {
    try {
      const { address, amount } = args;
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
