import { NativeLoader } from './NativeLoader';
import { Script } from './Bindings';
/**
 * Address methods
 */
export declare class Address extends NativeLoader {
    id: string;
    /**
     * Create Address instance from address string
     * @param address
     * @returns {Promise<Address>}
     */
    create(address: string): Promise<Address>;
    scriptPubKey(): Promise<Script>;
}
