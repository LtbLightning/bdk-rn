import { NativeLoader } from './NativeLoader';
/**
 * DatabaseConfig methods
 */
class DatabaseConfigInterface extends NativeLoader {
    constructor() {
        super(...arguments);
        this.isInit = false;
    }
    /**
     * Init memory DB
     * @returns {Promise<boolean>}
     */
    async memory() {
        this.isInit = await this._bdk.memoryDBInit();
        return this.isInit;
    }
    /**
     * Init sled DB
     * @returns {Promise<boolean>}
     */
    async sled(path, treeName) {
        this.isInit = await this._bdk.sledDBInit(path, treeName);
        return this.isInit;
    }
    /**
     * Init sqlite DB
     * @returns {Promise<boolean>}
     */
    async sqlite(path) {
        this.isInit = await this._bdk.sqliteDBInit(path);
        return this.isInit;
    }
}
export const DatabaseConfig = new DatabaseConfigInterface();
//# sourceMappingURL=DatabaseConfig.js.map