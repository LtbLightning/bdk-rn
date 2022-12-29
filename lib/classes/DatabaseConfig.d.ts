import { NativeLoader } from './NativeLoader';
/**
 * DatabaseConfig methods
 */
declare class DatabaseConfigInterface extends NativeLoader {
    isInit: boolean;
    /**
     * Init memory DB
     * @returns {Promise<boolean>}
     */
    memory(): Promise<boolean>;
    /**
     * Init sled DB
     * @returns {Promise<boolean>}
     */
    sled(path: string, treeName: string): Promise<boolean>;
    /**
     * Init sqlite DB
     * @returns {Promise<boolean>}
     */
    sqlite(path: string): Promise<boolean>;
}
export declare const DatabaseConfig: DatabaseConfigInterface;
export {};
