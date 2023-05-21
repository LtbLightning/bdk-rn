import { DatabaseConfig } from '../../src';
import { mockBdkRnModule } from '../setup';

describe('DatabaseConfig', () => {
  const databaseConfig = new DatabaseConfig();
  const memoryDBId = 'memoryDBId';
  const sledDBId = 'sledDBId';
  const sqliteId = 'sqliteId';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('inits memory db', async () => {
    mockBdkRnModule.memoryDBInit.mockResolvedValue(memoryDBId);
    let res = await databaseConfig.memory();
    expect(mockBdkRnModule.memoryDBInit).toHaveBeenCalled();
    expect(res).toBeInstanceOf(DatabaseConfig);
    expect(res.id).toBe(memoryDBId);
  });
  it('inits sled db', async () => {
    const path = 'path';
    const treeName = 'treeName';
    mockBdkRnModule.sledDBInit.mockResolvedValue(sledDBId);
    let res = await databaseConfig.sled(path, treeName);
    expect(mockBdkRnModule.sledDBInit).toHaveBeenCalledWith(path, treeName);
    expect(res).toBeInstanceOf(DatabaseConfig);
    expect(res.id).toBe(sledDBId);
  });
  it('inits sqlite db', async () => {
    const path = 'path';
    mockBdkRnModule.sqliteDBInit.mockResolvedValue(sqliteId);
    let res = await databaseConfig.sqlite(path);
    expect(mockBdkRnModule.sqliteDBInit).toHaveBeenCalledWith(path);
    expect(res).toBeInstanceOf(DatabaseConfig);
    expect(res.id).toBe(sqliteId);
  });
});
