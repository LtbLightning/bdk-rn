import { createTxIn, createTxOut } from '../../src/lib/utils';
import { mockTxIn, mockTxOut } from '../mockData';

import { Transaction } from '../../src';
import { mockBdkRnModule } from '../setup';

describe('Transaction', () => {
  const rawTx = [1, 2, 3];
  const id = '5BD8F815-408D-4D5D-B917-C3DE0986EC7F';
  const txId = '271ee42f7c527a9215a058be427453f89aad7a8835711659c6ee8ba8953f7651';
  let transaction: Transaction;

  mockBdkRnModule.createTransaction.mockResolvedValue(id);

  beforeEach(async () => {
    transaction = await new Transaction().create(rawTx);
  });

  it('id is stored in class', async () => {
    expect(transaction.id).toBe(id);
  });

  it('sets transcation', async () => {
    await transaction._setTransaction(id);
    expect(transaction.id).toBe(id);
  });

  it('serializes transcation', async () => {
    mockBdkRnModule.serializeTransaction.mockResolvedValueOnce(rawTx);
    const serialized = await transaction.serialize();
    expect(mockBdkRnModule.serializeTransaction).toHaveBeenCalledWith(transaction.id);
    expect(serialized).toBe(rawTx);
  });

  it('verify txid()', async () => {
    mockBdkRnModule.transactionTxid.mockResolvedValueOnce(txId);
    const res = await transaction.txid();
    expect(res).toBe(txId);
    expect(mockBdkRnModule.transactionTxid).toHaveBeenCalledWith(transaction.id);
  });

  it('verify weight()', async () => {
    mockBdkRnModule.txWeight.mockResolvedValueOnce(616);
    const res = await transaction.weight();
    expect(res).toBe(616);
    expect(mockBdkRnModule.txWeight).toHaveBeenCalledWith(transaction.id);
  });

  it('verify size()', async () => {
    mockBdkRnModule.txSize.mockResolvedValueOnce(154);
    const res = await transaction.size();
    expect(res).toBe(154);
    expect(mockBdkRnModule.txSize).toHaveBeenCalledWith(transaction.id);
  });

  it('verify vsize()', async () => {
    mockBdkRnModule.txVsize.mockResolvedValueOnce(154);
    const res = await transaction.vsize();
    expect(res).toBe(154);
    expect(mockBdkRnModule.txVsize).toHaveBeenCalledWith(transaction.id);
  });

  it('verify isCoinBase()', async () => {
    mockBdkRnModule.txIsCoinBase.mockResolvedValueOnce(false);
    const res = await transaction.isCoinBase();
    expect(res).toBe(false);
    expect(mockBdkRnModule.txIsCoinBase).toHaveBeenCalledWith(transaction.id);
  });

  it('verify isExplicitlyRbf()', async () => {
    mockBdkRnModule.txIsExplicitlyRbf.mockResolvedValueOnce(false);
    const res = await transaction.isExplicitlyRbf();
    expect(res).toBe(false);
    expect(mockBdkRnModule.txIsExplicitlyRbf).toHaveBeenCalledWith(transaction.id);
  });

  it('verify txIsLockTimeEnabled()', async () => {
    mockBdkRnModule.txIsLockTimeEnabled.mockResolvedValueOnce(true);
    const res = await transaction.isLockTimeEnabled();
    expect(res).toBe(true);
    expect(mockBdkRnModule.txIsLockTimeEnabled).toHaveBeenCalledWith(transaction.id);
  });

  it('verify version()', async () => {
    mockBdkRnModule.txVersion.mockResolvedValueOnce(1);
    const res = await transaction.version();
    expect(res).toBe(1);
    expect(mockBdkRnModule.txVersion).toHaveBeenCalledWith(transaction.id);
  });

  it('verify lockTime()', async () => {
    mockBdkRnModule.txLockTime.mockResolvedValueOnce(1);
    const res = await transaction.lockTime();
    expect(res).toBe(1);
    expect(mockBdkRnModule.txLockTime).toHaveBeenCalledWith(transaction.id);
  });

  it('verify input()', async () => {
    mockBdkRnModule.txInput.mockResolvedValueOnce([mockTxIn]);
    const res = await transaction.input();
    expect(res).toStrictEqual([createTxIn(mockTxIn)]);
    expect(mockBdkRnModule.txInput).toHaveBeenCalledWith(transaction.id);
  });

  it('verify output()', async () => {
    mockBdkRnModule.txOutput.mockResolvedValueOnce([mockTxOut]);
    const res = await transaction.output();
    expect(res).toStrictEqual([createTxOut(mockTxOut)]);
    expect(mockBdkRnModule.txOutput).toHaveBeenCalledWith(transaction.id);
  });
});
