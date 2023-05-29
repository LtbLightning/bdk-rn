import { NativeLoader } from './NativeLoader';
/**
 * DatabaseConfig methods
 */
export class DatabaseConfig extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
    }
    /**
     * Init memory DB
     * @returns {Promise<DatabaseConfig>}
     */
    async memory() {
        this.id = await this._bdk.memoryDBInit();
        return this;
    }
    /**
     * Init sled DB
     * @returns {Promise<DatabaseConfig>}
     */
    async sled(path, treeName) {
        this.id = await this._bdk.sledDBInit(path, treeName);
        return this;
    }
    /**
     * Init sqlite DB
     * @returns {Promise<DatabaseConfig>}
     */
    async sqlite(path) {
        this.id = await this._bdk.sqliteDBInit(path);
        return this;
    }
}
//# sourceMappingURL=DatabaseConfig.js.map