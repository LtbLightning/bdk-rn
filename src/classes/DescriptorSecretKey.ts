import { Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';

class DescriptorSecretKeyInterface extends NativeLoader {
  private xprv: string | undefined;

  async create(network: Network, mnemonic: string, password: string = ''): Promise<DescriptorSecretKeyInterface> {
    if (!Object.values(Network).includes(network)) throw 'Invalid network passed';
    this.xprv = await this._bdk.createDescriptorSecret(network, mnemonic, password);
    return this;
  }

  /**
   * @returns {string}
   */
  asString(): string | undefined {
    return this.xprv;
  }
}

export const DescriptorSecretKey = new DescriptorSecretKeyInterface();
