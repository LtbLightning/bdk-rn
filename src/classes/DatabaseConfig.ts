import { NativeLoader } from './NativeLoader';

/**
 * DatabaseConfig methods
 */
class DatabaseConfigInterface extends NativeLoader {
  public isInit: boolean = false;

  /**
   * Init memory DB
   * @returns {Promise<boolean>}
   */
  async memory(): Promise<boolean> {
    this.isInit = await this._bdk.memoryDBInit();
    return this.isInit;
  }

  /**
   * Init sled DB
   * @returns {Promise<boolean>}
   */
  async sled(path: string, treeName: string): Promise<boolean> {
    this.isInit = await this._bdk.sledDBInit(path, treeName);
    return this.isInit;
  }

  /**
   * Init sqlite DB
   * @returns {Promise<boolean>}
   */
  async sqlite(path: string): Promise<boolean> {
    this.isInit = await this._bdk.sqliteDBInit(path);
    return this.isInit;
  }
}

export const DatabaseConfig = new DatabaseConfigInterface();
