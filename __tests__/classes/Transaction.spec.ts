import { Transaction } from '../../src';
import { createTxIn, createTxOut } from '../../src/lib/utils';
import { mockTxIn, mockTxOut } from '../mockData';
import { mockBdkRnModule } from '../setup';

describe('Transaction', () => {
  const id = 'transactionId';
  const txId = 'txId123';
  const rawTx = [1, 2, 3];
  let transaction: Transaction;

  beforeAll(async () => {
    mockBdkRnModule.createTransaction.mockResolvedValue(id);
    transaction = await Transaction.create(rawTx);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('static methods', () => {
    it('creates transaction from raw bytes', async () => {
      expect(transaction.id).toBe(id);
      expect(mockBdkRnModule.createTransaction).toHaveBeenCalledWith(rawTx);
    });

    it('creates transaction from extracted data', () => {
      const txFromData = Transaction.fromData(id);
      expect(txFromData.id).toBe(id);
    });
  });

  describe('serialization', () => {
    it('serializes transaction', async () => {
      mockBdkRnModule.serializeTransaction.mockResolvedValueOnce(rawTx);
      const serialized = await transaction.serialize();
      expect(mockBdkRnModule.serializeTransaction).toHaveBeenCalledWith(transaction.id);
      expect(serialized).toEqual(rawTx);
    });
  });

  describe('transaction properties', () => {
    it('retrieves txid', async () => {
      mockBdkRnModule.transactionTxid.mockResolvedValueOnce(txId);
      const res = await transaction.txid();
      expect(res).toBe(txId);
      expect(mockBdkRnModule.transactionTxid).toHaveBeenCalledWith(transaction.id);
    });

    it('retrieves weight', async () => {
      const weight = 100;
      mockBdkRnModule.txWeight.mockResolvedValueOnce(weight);
      const res = await transaction.weight();
      expect(res).toBe(weight);
      expect(mockBdkRnModule.txWeight).toHaveBeenCalledWith(transaction.id);
    });

    it('retrieves size', async () => {
      const size = 200;
      mockBdkRnModule.txSize.mockResolvedValueOnce(size);
      const res = await transaction.size();
      expect(res).toBe(size);
      expect(mockBdkRnModule.txSize).toHaveBeenCalledWith(transaction.id);
    });

    it('retrieves vsize', async () => {
      const vsize = 300;
      mockBdkRnModule.txVsize.mockResolvedValueOnce(vsize);
      const res = await transaction.vsize();
      expect(res).toBe(vsize);
      expect(mockBdkRnModule.txVsize).toHaveBeenCalledWith(transaction.id);
    });

    it('retrieves version', async () => {
      const version = 2;
      mockBdkRnModule.txVersion.mockResolvedValueOnce(version);
      const res = await transaction.version();
      expect(res).toBe(version);
      expect(mockBdkRnModule.txVersion).toHaveBeenCalledWith(transaction.id);
    });

    it('retrieves lockTime', async () => {
      const lockTime = 500000;
      mockBdkRnModule.txLockTime.mockResolvedValueOnce(lockTime);
      const res = await transaction.lockTime();
      expect(res).toBe(lockTime);
      expect(mockBdkRnModule.txLockTime).toHaveBeenCalledWith(transaction.id);
    });
  });

  describe('transaction status', () => {
    it('checks if transaction is coinbase', async () => {
      mockBdkRnModule.txIsCoinBase.mockResolvedValueOnce(false);
      const res = await transaction.isCoinBase();
      expect(res).toBe(false);
      expect(mockBdkRnModule.txIsCoinBase).toHaveBeenCalledWith(transaction.id);
    });

    it('checks if transaction is explicitly RBF', async () => {
      mockBdkRnModule.txIsExplicitlyRbf.mockResolvedValueOnce(true);
      const res = await transaction.isExplicitlyRbf();
      expect(res).toBe(true);
      expect(mockBdkRnModule.txIsExplicitlyRbf).toHaveBeenCalledWith(transaction.id);
    });

    it('checks if locktime is enabled', async () => {
      mockBdkRnModule.txIsLockTimeEnabled.mockResolvedValueOnce(true);
      const res = await transaction.isLockTimeEnabled();
      expect(res).toBe(true);
      expect(mockBdkRnModule.txIsLockTimeEnabled).toHaveBeenCalledWith(transaction.id);
    });
  });

  it('retrieves transaction outputs', async () => {
    mockBdkRnModule.txOutput.mockResolvedValueOnce([mockTxOut]);
    const res = await transaction.output();
    expect(res).toStrictEqual([createTxOut(mockTxOut)]);
    expect(mockBdkRnModule.txOutput).toHaveBeenCalledWith(transaction.id);
  });
});
