import { PartiallySignedTransaction, Transaction } from '../../src';
import { mockBdkRnModule } from '../setup';

describe('PartiallySignedTransaction', () => {
  const base64PSBTA = 'base64PSBTA';
  const base64PSBTB = 'base64PSBTB';
  const base64PSBTAB = 'base64PSBTAB';
  let partiallySignedTransactionA = new PartiallySignedTransaction(base64PSBTA);
  let partiallySignedTransactionB = new PartiallySignedTransaction(base64PSBTB);

  it('base64 string is stored on class', async () => {
    expect(partiallySignedTransactionA.base64).toBe(base64PSBTA);
  });

  it('combines 2 PSBT', async () => {
    mockBdkRnModule.combine.mockResolvedValueOnce(base64PSBTAB);
    const newPSBT = await partiallySignedTransactionA.combine(partiallySignedTransactionB);
    expect(mockBdkRnModule.combine).toHaveBeenCalledWith(base64PSBTA, base64PSBTB);
    expect(newPSBT).toBeInstanceOf(PartiallySignedTransaction);
    expect(newPSBT.base64).toBe(base64PSBTAB);
  });
  it('extracts tx', async () => {
    const tx = 'rawTX';
    mockBdkRnModule.extractTx.mockResolvedValueOnce(tx);
    const transaction = await partiallySignedTransactionA.extractTx();
    expect(mockBdkRnModule.extractTx).toHaveBeenCalledWith(partiallySignedTransactionA.base64);
    expect(transaction).toBeInstanceOf(Transaction);
    expect(transaction.id).toBe(tx);
  });
  it('serializes psbt', async () => {
    const serializedPSBT = 'serializedPSBT';
    mockBdkRnModule.serialize.mockResolvedValueOnce(serializedPSBT);
    const serialized = await partiallySignedTransactionA.serialize();
    expect(mockBdkRnModule.serialize).toHaveBeenCalledWith(partiallySignedTransactionA.base64);
    expect(serialized).toBe(serializedPSBT);
  });
  it('returns tx id', async () => {
    const txId = 'txId';
    mockBdkRnModule.txid.mockResolvedValueOnce(txId);
    const res = await partiallySignedTransactionA.txid();
    expect(mockBdkRnModule.txid).toHaveBeenCalledWith(partiallySignedTransactionA.base64);
    expect(res).toBe(txId);
  });
});
