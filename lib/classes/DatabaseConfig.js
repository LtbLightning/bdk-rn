import { NativeLoader } from './NativeLoader';
/**
 * Enum for database types
 */
export var DatabaseType;
(function (DatabaseType) {
    DatabaseType["Memory"] = "memory";
    DatabaseType["Sled"] = "sled";
    DatabaseType["SQLite"] = "sqlite";
})(DatabaseType || (DatabaseType = {}));
/**
 * DatabaseConfig class for managing different database configurations
 */
export class DatabaseConfig extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
        this.type = null;
    }
    /**
     * Initialize memory database
     * @returns {Promise<DatabaseConfig>}
     */
    async memory() {
        this.id = await this._bdk.memoryDBInit();
        this.type = DatabaseType.Memory;
        return this;
    }
    /**
     * Initialize Sled database
     * @param {string} path - Path to the Sled database
     * @param {string} treeName - Name of the tree in Sled database
     * @returns {Promise<DatabaseConfig>}
     */
    async sled(path, treeName) {
        this.id = await this._bdk.sledDBInit(path, treeName);
        this.type = DatabaseType.Sled;
        return this;
    }
    /**
     * Initialize SQLite database
     * @param {string} path - Path to the SQLite database
     * @returns {Promise<DatabaseConfig>}
     */
    async sqlite(path) {
        this.id = await this._bdk.sqliteDBInit(path);
        this.type = DatabaseType.SQLite;
        return this;
    }
    /**
     * Get the current database type
     * @returns {DatabaseType | null}
     */
    getDatabaseType() {
        return this.type;
    }
    /**
     * Check if a database has been initialized
     * @returns {boolean}
     */
    isInitialized() {
        return this.id !== '' && this.type !== null;
    }
    /**
     * Reset the database configuration
     */
    reset() {
        this.id = '';
        this.type = null;
    }
}
//# sourceMappingURL=DatabaseConfig.js.map