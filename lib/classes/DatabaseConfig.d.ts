import { NativeLoader } from './NativeLoader';
/**
 * DatabaseConfig methods
 */
export declare class DatabaseConfig extends NativeLoader {
    id: string;
    /**
     * Init memory DB
     * @returns {Promise<DatabaseConfig>}
     */
    memory(): Promise<DatabaseConfig>;
    /**
     * Init sled DB
     * @returns {Promise<DatabaseConfig>}
     */
    sled(path: string, treeName: string): Promise<DatabaseConfig>;
    /**
     * Init sqlite DB
     * @returns {Promise<DatabaseConfig>}
     */
    sqlite(path: string): Promise<DatabaseConfig>;
}
