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
   * Test method
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
}

const RnBdk = new BdkInterface();
export default RnBdk;
