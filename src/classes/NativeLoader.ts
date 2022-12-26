import { NativeModules } from 'react-native';
export class NativeLoader {
  public _bdk: any = '';

  constructor() {
    this._bdk = NativeModules.BdkRnModule;
  }
}
