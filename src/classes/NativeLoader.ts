import { NativeModules } from 'react-native';
export class NativeLoader {
  protected _bdk: any = NativeModules.BdkRnModule;

  constructor() {
    this._bdk = NativeModules.BdkRnModule;
  }
}
