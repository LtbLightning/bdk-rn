import { NativeLoader } from './NativeLoader';
/**
 * Enum for database types
 */
export declare enum DatabaseType {
    Memory = "memory",
    Sled = "sled",
    SQLite = "sqlite"
}
/**
 * DatabaseConfig class for managing different database configurations
 */
export declare class DatabaseConfig extends NativeLoader {
    id: string;
    private type;
    /**
     * Initialize memory database
     * @returns {Promise<DatabaseConfig>}
     */
    memory(): Promise<DatabaseConfig>;
    /**
     * Initialize Sled database
     * @param {string} path - Path to the Sled database
     * @param {string} treeName - Name of the tree in Sled database
     * @returns {Promise<DatabaseConfig>}
     */
    sled(path: string, treeName: string): Promise<DatabaseConfig>;
    /**
     * Initialize SQLite database
     * @param {string} path - Path to the SQLite database
     * @returns {Promise<DatabaseConfig>}
     */
    sqlite(path: string): Promise<DatabaseConfig>;
    /**
     * Get the current database type
     * @returns {DatabaseType | null}
     */
    getDatabaseType(): DatabaseType | null;
    /**
     * Check if a database has been initialized
     * @returns {boolean}
     */
    isInitialized(): boolean;
    /**
     * Reset the database configuration
     */
    reset(): void;
}
