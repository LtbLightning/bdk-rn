import { DescriptorSecretKey } from './DescriptorSecretKey';
import { KeychainKind, Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Descriptor methods
 */
export declare class Descriptor extends NativeLoader {
    id: string;
    /**
     * Constructor
     * @param descriptor
     * @param network
     * @returns {Promise<Descriptor>}
     */
    create(descriptor: string, network: Network): Promise<Descriptor>;
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
     * @returns {Promise<Descriptor>}
     */
    newBip44(secretKey: DescriptorSecretKey, keychain: KeychainKind, network: Network): Promise<Descriptor>;
    /**
     * BIP49 template. Expands to sh(wpkh(key/49'/{0,1}'/0'/{0,1}/*))
     * Since there are hardened derivation steps, this template requires a private derivable key (generally a xprv/tprv).
     * @returns {Promise<Descriptor>}
     */
    newBip49(secretKey: DescriptorSecretKey, keychain: KeychainKind, network: Network): Promise<Descriptor>;
    /**
     * BIP84 template. Expands to wpkh(key/84'/{0,1}'/0'/{0,1}/*)
     * Since there are hardened derivation steps, this template requires a private derivable key (generally a xprv/tprv).
     * @returns {Promise<Descriptor>}
     */
    newBip84(secretKey: DescriptorSecretKey, keychain: KeychainKind, network: Network): Promise<Descriptor>;
}
