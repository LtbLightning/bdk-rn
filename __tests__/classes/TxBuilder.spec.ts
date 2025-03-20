import { Amount, FeeRate, TxBuilder, Wallet } from '../../src';
import { OutPoint } from '../../src/classes/Bindings';
import { Script } from '../../src/classes/Script';
import { mockBdkRnModule } from '../setup';

describe('TxBuilder', () => {
  let txBuilder: TxBuilder;
  let wallet: Wallet;
  const txBuilderId = 'txBuilderId';
  const walletId = 'wallet-id';

  // Mock implementations
  const mockAmount = {
    toSats: jest.fn().mockResolvedValue(1000),
  };

  const mockFeeRate = {
    getSatPerVb: jest.fn().mockResolvedValue(1),
  };

  beforeAll(() => {
    Object.assign(mockBdkRnModule, {
      createTxBuilder: jest.fn().mockResolvedValue(txBuilderId),
      addRecipient: jest.fn().mockResolvedValue(undefined),
      addUnspendable: jest.fn().mockResolvedValue(undefined),
      addUtxo: jest.fn().mockResolvedValue(undefined),
      addUtxos: jest.fn().mockResolvedValue(undefined),
      doNotSpendChange: jest.fn().mockResolvedValue(undefined),
      manuallySelectedOnly: jest.fn().mockResolvedValue(undefined),
      onlySpendChange: jest.fn().mockResolvedValue(undefined),
      unspendable: jest.fn().mockResolvedValue(undefined),
      feeRate: jest.fn().mockResolvedValue(undefined),
      feeAbsolute: jest.fn().mockResolvedValue(undefined),
      drainWallet: jest.fn().mockResolvedValue(undefined),
      drainTo: jest.fn().mockResolvedValue(undefined),
      enableRbf: jest.fn().mockResolvedValue(undefined),
      enableRbfWithSequence: jest.fn().mockResolvedValue(undefined),
      addData: jest.fn().mockResolvedValue(undefined),
      setRecipients: jest.fn().mockResolvedValue(undefined),
      finish: jest.fn().mockResolvedValue({ base64: 'psbt-base64' }),
    });
  });

  beforeEach(async () => {
    txBuilder = await new TxBuilder().create();
    // Initialize wallet with id property
    wallet = { id: walletId } as Wallet;
  });

  it('creates a new instance of TxBuilder', () => {
    expect(txBuilder).toBeInstanceOf(TxBuilder);
    expect(txBuilder.id).toBe(txBuilderId);
  });
  it('should add a recipient', async () => {
    const scriptId = 'script-id';
    const script = new Script(scriptId);
    await txBuilder.addRecipient(script, mockAmount as unknown as Amount);
    expect(mockBdkRnModule.addRecipient).toHaveBeenCalledWith(txBuilderId, scriptId, 1000);
  });

  it('should add an unspendable UTXO', async () => {
    const outpoint = new OutPoint('outpoint', 0);
    await txBuilder.addUnspendable(outpoint);
    expect(mockBdkRnModule.addUnspendable).toHaveBeenCalledWith(txBuilderId, outpoint);
  });

  it('should add a UTXO', async () => {
    const outpoint = new OutPoint('outpoint', 0);
    await txBuilder.addUtxo(outpoint);
    expect(mockBdkRnModule.addUtxo).toHaveBeenCalledWith(txBuilderId, outpoint);
  });

  it('should set do not spend change', async () => {
    await txBuilder.doNotSpendChange();
    expect(mockBdkRnModule.doNotSpendChange).toHaveBeenCalledWith(txBuilderId);
  });

  it('should set manually selected only', async () => {
    await txBuilder.manuallySelectedOnly();
    expect(mockBdkRnModule.manuallySelectedOnly).toHaveBeenCalledWith(txBuilderId);
  });

  it('should set only spend change', async () => {
    await txBuilder.onlySpendChange();
    expect(mockBdkRnModule.onlySpendChange).toHaveBeenCalledWith(txBuilderId);
  });
  it('should set unspendable UTXOs', async () => {
    const outpoints = [new OutPoint('txid', 0), new OutPoint('txid', 1)];
    await txBuilder.unspendable(outpoints);
    expect(mockBdkRnModule.unspendable).toHaveBeenCalledWith(txBuilderId, outpoints);
  });

  it('should set a custom fee rate', async () => {
    await txBuilder.feeRate(mockFeeRate as unknown as FeeRate);
    expect(mockBdkRnModule.feeRate).toHaveBeenCalledWith(txBuilderId, 1);
  });
  it('should set an absolute fee', async () => {
    await txBuilder.feeAbsolute(mockAmount as unknown as Amount);
    expect(mockBdkRnModule.feeAbsolute).toHaveBeenCalledWith(txBuilderId, 1000);
  });

  it('should drain the wallet', async () => {
    await txBuilder.drainWallet();
    expect(mockBdkRnModule.drainWallet).toHaveBeenCalledWith(txBuilderId);
  });
  it('should drain to an address', async () => {
    const scriptId = 'script-id';
    const script = new Script(scriptId);
    await txBuilder.drainTo(script);
    expect(mockBdkRnModule.drainTo).toHaveBeenCalledWith(txBuilderId, scriptId);
  });

  it('should enable RBF', async () => {
    await txBuilder.enableRbf();
    expect(mockBdkRnModule.enableRbf).toHaveBeenCalledWith(txBuilderId);
  });

  it('should enable RBF with sequence', async () => {
    const sequence = 123;
    await txBuilder.enableRbfWithSequence(sequence);
    expect(mockBdkRnModule.enableRbfWithSequence).toHaveBeenCalledWith(txBuilderId, sequence);
  });

  it('should add data to output', async () => {
    const data = [1, 2, 3];
    await txBuilder.addData(data);
    expect(mockBdkRnModule.addData).toHaveBeenCalledWith(txBuilderId, data);
  });

  it('should finish the transaction building', async () => {
    const psbt = await txBuilder.finish(wallet);
    expect(mockBdkRnModule.finish).toHaveBeenCalledWith(txBuilderId, walletId);
    expect(psbt.base64).toBe('psbt-base64');
  });
});
