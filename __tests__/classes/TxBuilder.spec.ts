import { when } from 'jest-when';

import { PartiallySignedTransaction, TxBuilder } from '../../src';
import { OutPoint, TransactionDetails } from '../../src/classes/Bindings';
import { mockAddress, mockScript, mockTxBuilder, mockTxBuilderResult, mockWallet } from '../mockData';

describe('TxBuilder', () => {
  it('Should return a exception when funds are insufficient', async () => {
    try {
      jest.spyOn(mockTxBuilder, 'finish').mockRejectedValue(new Error('{ needed: 751, available: 0 }'));
      await mockTxBuilder.finish(mockWallet);
    } catch (e) {
      expect(e.message).toBe('{ needed: 751, available: 0 }');
    }
  });

  it('Should return a exception when no recipients are added', async () => {
    try {
      jest.spyOn(mockTxBuilder, 'finish').mockRejectedValue(new Error('No Recipients'));
      await mockTxBuilder.finish(mockWallet);
    } catch (e) {
      expect(e.message).toBe('No Recipients');
    }
  });

  test('Verify addData() Exception', async () => {
    try {
      jest.spyOn(mockTxBuilder, 'addData').mockRejectedValue(new Error('List must not be empty'));
      await mockTxBuilder.addData([]);
    } catch (e) {
      expect(e.message).toBe('List must not be empty');
    }
  });

  test('Verify unSpendable()', async () => {
    when(mockTxBuilder.addUnspendable)
      .calledWith(new OutPoint('efc5d0e6ad6611f22b05d3c1fc8888c3552e8929a4231f2944447e4426f52056', 1))
      .mockResolvedValue(mockTxBuilder);
    let res = await mockTxBuilder.addUnspendable(
      new OutPoint('efc5d0e6ad6611f22b05d3c1fc8888c3552e8929a4231f2944447e4426f52056', 1)
    );
    expect(res).toBeInstanceOf(TxBuilder);
  });

  test('Should not return a exception when, a drainTo script address is added (with feeRate)', async () => {
    when(mockTxBuilder.drainTo).calledWith(mockScript).mockResolvedValue(mockTxBuilder);
    when(mockTxBuilder.feeRate).calledWith(25).mockResolvedValue(mockTxBuilder);
    when(mockTxBuilder.finish).calledWith(mockWallet).mockResolvedValue(mockTxBuilderResult);

    const txBuilder = await mockTxBuilder.drainTo(mockScript);
    await txBuilder.feeRate(25);
    const res = await txBuilder.finish(mockWallet);
    expect(res.psbt).toBeInstanceOf(PartiallySignedTransaction);
    expect(res.txDetails).toBeInstanceOf(TransactionDetails);
  });

  test('Should not return a exception when, a drainTo script address is added, instead of addRecipients', async () => {
    when(mockTxBuilder.drainTo).calledWith(mockScript).mockResolvedValue(mockTxBuilder);
    when(mockTxBuilder.finish).calledWith(mockWallet).mockResolvedValue(mockTxBuilderResult);

    const txBuilder = await mockTxBuilder.drainTo(mockScript);
    const res = await txBuilder.finish(mockWallet);
    expect(res.psbt).toBeInstanceOf(PartiallySignedTransaction);
    expect(res.txDetails).toBeInstanceOf(TransactionDetails);
  });

  test('Create a proper psbt transaction ', async () => {
    when(mockAddress.scriptPubKey).mockResolvedValue(mockScript);
    when(mockTxBuilder.addRecipient).calledWith(mockScript, 1200).mockResolvedValue(mockTxBuilder);
    when(mockTxBuilder.finish).calledWith(mockWallet).mockResolvedValue(mockTxBuilderResult);
    let script = await mockAddress.scriptPubKey();
    let txBuilder = await mockTxBuilder.addRecipient(script, 1200);
    let res = await txBuilder.finish(mockWallet);
    expect(res).toBe(mockTxBuilderResult);
  });
});
