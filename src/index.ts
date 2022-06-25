import { NativeModules } from 'react-native';
import { failure, getItem, removeItem, setItem, success, _exists } from './lib/utils';
import { createWalletResponse, Response } from './lib/interfaces';

const MnemonicPhraseKey = 'mnemonic';
const PasswordKey = 'passowrd';

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
   * Check if wallet exists or not
   * @return {Promise<Response>}
   */
  async walletExists(): Promise<Response> {
    try {
      const phrase = await getItem(MnemonicPhraseKey);
      return success(phrase != null);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * unlock wallet
   * @return {Promise<Response>}
   */
  async unlockWallet(): Promise<Response> {
    try {
      const phrase = (await getItem(MnemonicPhraseKey)) ?? '';
      if (!_exists(phrase)) throw 'No saved seed phrase found.';
      const data = await this.restoreWallet(phrase);
      if (!data.error) return success('Wallet unlocked');
      else return failure('Wallet Unlock failed');
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Create new wallet
   * @return {Promise<Response>}
   */
  async createWallet(
    mnemonic: string = '',
    password: string = '',
    network: string = '',
    blockChainConfigUrl: string = '',
    blockChainSocket5: string = '',
    retry: string = '',
    timeOut: string = '',
    blockChain: string = ''
  ): Promise<Response> {
    try {
      const wallet: createWalletResponse = await this._bdk.createWallet(
        mnemonic,
        password,
        network,
        blockChainConfigUrl,
        blockChainSocket5,
        retry,
        timeOut,
        blockChain
      );
      await setItem(MnemonicPhraseKey, wallet.mnemonic);
      await setItem(PasswordKey, password);
      return success(wallet);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Restore wallet
   * @return {Promise<Response>}
   */
  async restoreWallet(
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
      const wallet = await this._bdk.restoreWallet(
        mnemonic,
        password,
        network,
        blockChainConfigUrl,
        blockChainSocket5,
        retry,
        timeOut,
        blockChain
      );
      await setItem(MnemonicPhraseKey, mnemonic);
      await setItem(PasswordKey, password);
      return success(wallet);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Reset wallet
   * @return {Promise<Response>}
   */
  async resetWallet(): Promise<Response> {
    try {
      await removeItem(MnemonicPhraseKey);
      await removeItem(PasswordKey);
      return success(true);
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
  async genPendingTransactions(): Promise<Response> {
    try {
      const response = await this._bdk.genPendingTransactions();
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
