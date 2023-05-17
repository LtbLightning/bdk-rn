import { BumpFeeTxBuilder, DatabaseConfig, Descriptor, PartiallySignedTransaction, Wallet } from '../../src';
import { Network } from '../../src/lib/enums';
import { mockWallet } from '../mockData';
import { mockBdkRnModule } from '../setup';

const id = 'instanceId';
mockBdkRnModule.bumpFeeTxBuilderInit.mockResolvedValue(id);

describe('BumpFeeTxBuilder', () => {
  const walletId = 'walletId';
  mockBdkRnModule.walletInit.mockResolvedValue(walletId);
  const txid = 'txid';
  const newFeeRate = 20;
  let bumpFeeTxBuilder;

  beforeAll(async () => {
    bumpFeeTxBuilder = await new BumpFeeTxBuilder().create(txid, newFeeRate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new bumpFeeTxBuilder instance', async () => {
    bumpFeeTxBuilder = await new BumpFeeTxBuilder().create(txid, newFeeRate);
    expect(mockBdkRnModule.bumpFeeTxBuilderInit).toHaveBeenCalledWith(txid, newFeeRate);
    expect(bumpFeeTxBuilder).toBeInstanceOf(BumpFeeTxBuilder);
  });
  it('should allow shrinking', async () => {
    const address = 'address';
    await bumpFeeTxBuilder.allowShrinking(address);
    expect(mockBdkRnModule.bumpFeeTxBuilderAllowShrinking).toHaveBeenCalledWith(id, address);
  });
  it('should enable rbf', async () => {
    await bumpFeeTxBuilder.enableRbf();
    expect(mockBdkRnModule.bumpFeeTxBuilderEnableRbf).toHaveBeenCalledWith(id);
  });
  it('should enable rbf with sequence', async () => {
    const sequence = 1;
    await bumpFeeTxBuilder.enableRbfWithSequence(sequence);
    expect(mockBdkRnModule.bumpFeeTxBuilderEnableRbfWithSequence).toHaveBeenCalledWith(id, sequence);
  });
  it('should finish transaction', async () => {
    const descriptor = await new Descriptor().create('descriptor', Network.Regtest);
    const wallet = await new Wallet().create(descriptor, descriptor, Network.Regtest, new DatabaseConfig());
    const result = await await bumpFeeTxBuilder.finish(wallet);
    expect(mockBdkRnModule.bumpFeeTxBuilderFinish).toHaveBeenCalledWith(id, wallet.id);
    expect(result).toBeInstanceOf(PartiallySignedTransaction);
  });

  it('should return a exception when txid is invalid', async () => {
    try {
      mockBdkRnModule.bumpFeeTxBuilderFinish.mockRejectedValue(new Error('TransactionNotFound'));
      await await bumpFeeTxBuilder.finish(mockWallet);
    } catch (e) {
      expect(e.message).toBe('TransactionNotFound');
    }
  });
});
