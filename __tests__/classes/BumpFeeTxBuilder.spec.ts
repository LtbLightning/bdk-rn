import { mockBumpFeeTxBuilder, mockWallet } from '../mockData';

describe('BumpFeeTxBuilder', () => {
  test('Should return a exception when txid is invalid', async () => {
    try {
      jest.spyOn(mockBumpFeeTxBuilder, 'finish').mockRejectedValue(new Error('TransactionNotFound'));
      await mockBumpFeeTxBuilder.finish(mockWallet);
    } catch (e) {
      expect(e.message).toBe('TransactionNotFound');
    }
  });
});
