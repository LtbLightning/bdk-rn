import { Transaction } from '../../src';
import { mockBdkRnModule } from '../setup';

describe('Transaction', () => {
  const rawTx = [1, 2, 3];
  const txId2 = 'txId2';
  const txId = 'txId';
  let transaction: Transaction;

  mockBdkRnModule.createTransaction.mockResolvedValue(txId);

  beforeEach(async () => {
    transaction = await new Transaction().create(rawTx);
  });

  it('id is stored in class', async () => {
    expect(transaction.id).toBe(txId);
  });

  it('sets transcation', async () => {
    await transaction._setTransaction(txId2);
    expect(transaction.id).toBe(txId2);
  });
  it('serializes transcation', async () => {
    mockBdkRnModule.serializeTransaction.mockResolvedValueOnce(rawTx);
    const serialized = await transaction.serialize();
    expect(mockBdkRnModule.serializeTransaction).toHaveBeenCalledWith(transaction.id);
    expect(serialized).toBe(rawTx);
  });
});
