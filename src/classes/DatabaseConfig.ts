import { NativeLoader } from './NativeLoader';

/**
 * DatabaseConfig methods
 */
export class DatabaseConfig extends NativeLoader {
  public id: string = '';

  /**
   * Init memory DB
   * @returns {Promise<DatabaseConfig>}
   */
  async memory(): Promise<DatabaseConfig> {
    this.id = await this._bdk.memoryDBInit();
    return this;
  }

  /**
   * Init sled DB
   * @returns {Promise<DatabaseConfig>}
   */
  async sled(path: string, treeName: string): Promise<DatabaseConfig> {
    this.id = await this._bdk.sledDBInit(path, treeName);
    return this;
  }

  /**
   * Init sqlite DB
   * @returns {Promise<DatabaseConfig>}
   */
  async sqlite(path: string): Promise<DatabaseConfig> {
    this.id = await this._bdk.sqliteDBInit(path);
    return this;
  }
}
