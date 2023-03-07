import { DescriptorSecretKey } from 'bdk-rn/src';
import { KeychainKind, Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Descriptor methods
 */
declare class DescriptorInterface extends NativeLoader {
    private id;
    /**
     * Constructor
     * @param descriptor
     * @param network
     * @returns {Promise<DescriptorInterface>}
     */
    create(descriptor: string, network: Network): Promise<DescriptorInterface>;
    /**
     * Return the public version of the output descriptor.
     * @returns {Promise<string>}
     */
    asString(): Promise<string>;
    /**
     * Return the private version of the output descriptor if available, otherwise return the public version.
     * @returns {Promise<string>}
     */
    asStringPrivate(): Promise<string>;
    /**
     * BIP44 template. Expands to pkh(key/44'/{0,1}'/0'/{0,1}/*)
     * Since there are hardened derivation steps, this template requires a private derivable key (generally a xprv/tprv).
     * @returns {Promise<DescriptorInterface>}
     */
    newBip44(secretKey: typeof DescriptorSecretKey, keychain: KeychainKind, network: Network): Promise<DescriptorInterface>;
    /**
     * BIP49 template. Expands to sh(wpkh(key/49'/{0,1}'/0'/{0,1}/*))
     * Since there are hardened derivation steps, this template requires a private derivable key (generally a xprv/tprv).
     * @returns {Promise<DescriptorInterface>}
     */
    newBip49(secretKey: typeof DescriptorSecretKey, keychain: KeychainKind, network: Network): Promise<DescriptorInterface>;
    /**
     * BIP84 template. Expands to wpkh(key/84'/{0,1}'/0'/{0,1}/*)
     * Since there are hardened derivation steps, this template requires a private derivable key (generally a xprv/tprv).
     * @returns {Promise<DescriptorInterface>}
     */
    newBip84(secretKey: typeof DescriptorSecretKey, keychain: KeychainKind, network: Network): Promise<DescriptorInterface>;
}
export declare const Descriptor: DescriptorInterface;
export {};
