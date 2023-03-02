import { Network } from '../lib/enums';
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
}
export declare const Descriptor: DescriptorInterface;
export {};
