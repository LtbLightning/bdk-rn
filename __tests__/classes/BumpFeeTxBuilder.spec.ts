import { BumpFeeTxBuilder, DatabaseConfig, Descriptor, PartiallySignedTransaction, Wallet, FeeRate } from '../../src';
import { Network } from '../../src/lib/enums';
import { mockWallet } from '../mockData';
import { mockBdkRnModule } from '../setup';

const id = 'instanceId';
const feeRateId = 'feeRateId';
mockBdkRnModule.bumpFeeTxBuilderInit.mockResolvedValue(id);

// Mock FeeRate
jest.mock('../../src/classes/FeeRate', () => {
  return {
    FeeRate: jest.fn().mockImplementation(() => ({
      getSatPerVb: jest.fn().mockResolvedValue(20),
    })),
  };
});

describe('BumpFeeTxBuilder', () => {
  const walletId = 'walletId';
  mockBdkRnModule.walletInit.mockResolvedValue(walletId);
  const txid = 'txid';
  let bumpFeeTxBuilder;
  const mockFeeRate = {
    getSatPerVb: jest.fn().mockResolvedValue(20),
  };

  beforeAll(async () => {
    const feeRate = new FeeRate();
    feeRate.id = feeRateId;
    feeRate.getSatPerVb = mockFeeRate.getSatPerVb;
    bumpFeeTxBuilder = await new BumpFeeTxBuilder().create(txid, feeRate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new bumpFeeTxBuilder instance', async () => {
    const feeRate = new FeeRate();
    feeRate.id = feeRateId;
    feeRate.getSatPerVb = mockFeeRate.getSatPerVb;
    bumpFeeTxBuilder = await new BumpFeeTxBuilder().create(txid, feeRate);
    expect(mockBdkRnModule.bumpFeeTxBuilderInit).toHaveBeenCalledWith(txid, 20);
    expect(bumpFeeTxBuilder).toBeInstanceOf(BumpFeeTxBuilder);
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
    const result = await bumpFeeTxBuilder.finish(wallet);
    expect(mockBdkRnModule.bumpFeeTxBuilderFinish).toHaveBeenCalledWith(id, wallet.id);
    expect(result).toBeInstanceOf(PartiallySignedTransaction);
  });

  it('should return a exception when txid is invalid', async () => {
    try {
      mockBdkRnModule.bumpFeeTxBuilderFinish.mockRejectedValue(new Error('TransactionNotFound'));
      await bumpFeeTxBuilder.finish(mockWallet);
    } catch (e) {
      expect(e.message).toBe('TransactionNotFound');
    }
  });
});
