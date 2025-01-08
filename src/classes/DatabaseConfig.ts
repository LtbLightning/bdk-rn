import { NativeLoader } from './NativeLoader';

/**
 * Enum for database types
 */
export enum DatabaseType {
  Memory = 'memory',
  Sled = 'sled',
  SQLite = 'sqlite',
}

/**
 * DatabaseConfig class for managing different database configurations
 */
export class DatabaseConfig extends NativeLoader {
  public id: string = '';
  private type: DatabaseType | null = null;

  /**
   * Initialize memory database
   * @returns {Promise<DatabaseConfig>}
   */
  async memory(): Promise<DatabaseConfig> {
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
  async sled(path: string, treeName: string): Promise<DatabaseConfig> {
    this.id = await this._bdk.sledDBInit(path, treeName);
    this.type = DatabaseType.Sled;
    return this;
  }

  /**
   * Initialize SQLite database
   * @param {string} path - Path to the SQLite database
   * @returns {Promise<DatabaseConfig>}
   */
  async sqlite(path: string): Promise<DatabaseConfig> {
    this.id = await this._bdk.sqliteDBInit(path);
    this.type = DatabaseType.SQLite;
    return this;
  }

  /**
   * Get the current database type
   * @returns {DatabaseType | null}
   */
  getDatabaseType(): DatabaseType | null {
    return this.type;
  }

  /**
   * Check if a database has been initialized
   * @returns {boolean}
   */
  isInitialized(): boolean {
    return this.id !== '' && this.type !== null;
  }

  /**
   * Reset the database configuration
   */
  reset(): void {
    this.id = '';
    this.type = null;
  }
}