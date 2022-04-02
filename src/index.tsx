import { NativeModules } from 'react-native';

export interface Response {
  error: boolean;
  data: any;
}

export const failure = (data: string = '') => ({ error: true, data });
export const success = (data: string | object | any = '') => ({
  error: false,
  data,
});

class BdkInterface {
  public _bdk: any;

  constructor() {
    this._bdk = NativeModules.RnBdkModule;
  }

  /**
   * Get new address
   * @return {Promise<Response>}
   */
  async createWallet(): Promise<Response> {
    try {
      const wallet = await this._bdk.createWallet();
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
      const test = await this._bdk.getNewAddress();
      return success(test);
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
      const bal = await this._bdk.getBalance();
      return success(bal);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Broadcast TX
   * @return {Promise<Response>}
   */
  async broadcastTx(address: string, amount: number): Promise<Response> {
    try {
      const tx = await this._bdk.broadcastTx(address, amount);
      console.log("TX Object", tx);
      return success(tx);
    } catch (e: any) {
      console.log("Error: ", e);
      return failure(e);
    }
  }
}

const RnBdk = new BdkInterface();
export default RnBdk;
