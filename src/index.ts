import { NativeModules } from 'react-native';
import { failure, success, _exists } from './lib/utils';
import {
  BroadcastTransactionRequest,
  GenSeedRequest,
  GenerateMnemonicRequest,
  createWalletRequest,
  createWalletResponse,
  Response,
  CreateDescriptorRequest,
  GenerateExtendedKeyRequest,
  GenerateExtendedKeyResponse,
} from './lib/interfaces';

class BdkInterface {
  public _bdk: any;

  constructor() {
    this._bdk = NativeModules.BdkRnModule;
  }

  /**
   * Generate mnemonic seed phrase of specified entropy and length
   * @return {Promise<Response>}
   */
  async generateMnemonic(args: GenerateMnemonicRequest): Promise<Response> {
    try {
      const entropyToLength = {
        '128': 12,
        '160': 15,
        '192': 18,
        '224': 21,
        '256': 24,
      };
      let entropy = undefined;
      let wordCount = undefined;
      if (args.entropy && args.length) {
        wordCount = entropyToLength[args.entropy];
      } else if (!args.entropy && !args.length) {
        wordCount = 12;
      } else {
        wordCount = args.length;
      }

      const seed: string = await this._bdk.generateMnemonic(wordCount);
      return success(seed);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Generate extended key from netowrk, seed and password
   * @return {Promise<Response>}
   */
  async generateExtendedKey(args: GenerateExtendedKeyRequest): Promise<Response> {
    try {
      const { network, mnemonic, password } = args;
      const keyInfo: string = await this._bdk.getExtendedKeyInfo(network, mnemonic, password);
      return success(keyInfo);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Generate extended key from netowrk, seed and password
   * @return {Promise<Response>}
   */
  async generateXprv(args: GenerateExtendedKeyRequest): Promise<Response> {
    try {
      const { network, mnemonic, password } = args;
      const keyInfo: GenerateExtendedKeyResponse = await this._bdk.getExtendedKeyInfo(network, mnemonic, password);
      return success(keyInfo.xprv);
    } catch (e: any) {
      console.log(e)
      return failure(e);
    }
  }

  /**
   * Create descriptor based on different parameters
   * @return {Promise<Response>}
   */
  async createDescriptor(args: CreateDescriptorRequest): Promise<Response> {
    try {
      const { type, useMnemonic, mnemonic, password, network, publicKeys, thresold } = args;
      let xprv = args.xprv;
      let path = args.path;
      if (useMnemonic) {
        if (!_exists(mnemonic)) throw 'Mnemonic seed is required';
        xprv = await (await this.generateXprv({ network, mnemonic, password })).data;
      }
      if (!useMnemonic && !_exists(xprv)) throw 'XPRV is required';
      if (!_exists(path)) path = "/84'/1'/0'/0/*";

      let descriptor = '';
      if (type != 'multi') {
        let method = '';
        switch (type) {
          case 'default':
          case null:
          case '':
          case 'p2wpkh':
          case 'wpkh':
            method = 'wpkh';
            break;

          case 'p2pkh':
          case 'pkh':
            method = 'pkh';
            break;

          case 'shp2wpkh':
          case 'p2shp2wpkh':
            method = 'sh(wpkh';
            break;
        }
        descriptor = `${method}(${xprv}${path})`;
      } else {
        if (!_exists(thresold) || !_exists(publicKeys) || (_exists(publicKeys) && publicKeys?.length == 0))
          throw 'Thresold or publicKeys values are invalid.';
        if (thresold == 0 || thresold > publicKeys?.length + 1) throw 'Thresold value in invalid.';

        descriptor = `sh(multi(${thresold}${xprv},${publicKeys?.join(',')}${path}`;
      }
      return success(descriptor);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Init wallet
   * @return {Promise<Response>}
   */
  async createWallet(args: createWalletRequest): Promise<Response> {
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
      if (useDescriptor && descriptor?.split(' ').length > 1) throw 'Descriptor is not valid.';

      const wallet: createWalletResponse = await this._bdk.createWallet(
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
