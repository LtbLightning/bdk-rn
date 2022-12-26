import { Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
declare class DescriptorSecretKeyInterface extends NativeLoader {
    private xprv;
    create(network: Network, mnemonic: string, password?: string): Promise<DescriptorSecretKeyInterface>;
    /**
     * @returns {string}
     */
    asString(): string | undefined;
}
export declare const DescriptorSecretKey: DescriptorSecretKeyInterface;
export {};
