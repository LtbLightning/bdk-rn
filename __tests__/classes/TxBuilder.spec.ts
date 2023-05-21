import { Address, PartiallySignedTransaction, TxBuilder, Wallet } from '../../src';
import {
  OutPoint,
  Script,
  ScriptAmount,
  TxBuilderResult
} from '../../src/classes/Bindings';
import { mockTransactionDetails } from '../mockData';
import { mockBdkRnModule } from '../setup';

describe('TxBuilder', () => {
  const mockWallet = new Wallet();
  const mockAddress = new Address();
  const mockScript = new Script('mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB');

  const txBuilderId = 'txBuilderId';
  const outPoint = new OutPoint('efc5d0e6ad6611f22b05d3c1fc8888c3552e8929a4231f2944447e4426f52056', 1);
  const psbtString =
    'cHNidP8BAJoBAAAAAivIGwj79VJdDEMC6DTEBFWNRXh8i63O5Bj2ul/ckLSiAAAAAAD+////q/fYDAwa/ovXiOHXMMJWBzSSppAfXu8xVBWr97kc60kAAAAAAP7///8CCwUAAAAAAAAWABTiG3occFHBPEfIFYEno1q+KemyBNwFAAAAAAAAFgAUJeosBE8pPYv+vWAJxdrAq2HPlb50ByUAAAEA3gEAAAAAAQG1SXpVEroudlm2vsvLISuSLWqp3SMiU8bE/zFmMfSlrAEAAAAA/v///wLcBQAAAAAAABYAFCXqLARPKT2L/r1gCcXawKthz5W+kRAAAAAAAAAWABRIuasG/iTpawzZOHBRQUPdiAgtjwJHMEQCICkgZhWePD/RuE7V87/VcxX6PIv9LPg8+K6O42bX49usAiBe+ohVk1/abwUqmeqYuSM8x/e6sDrnZB1rD6GFdfm9iQEhApqPApANDfpFbG9N/WKaIz7W/c4Mf/7J8Zw2Usaj0G/InfEkAAEBH9wFAAAAAAAAFgAUJeosBE8pPYv+vWAJxdrAq2HPlb4iBgKn69zak6elBqiAOr/Z//pXXXHCW9JlHB6Nh9ccRCENABgJwK/eVAAAgAEAAIAAAACAAAAAAAcAAAAAAQD9cgEBAAAAAAECovbyC3Cz7gh5c5NeEl+NmyrVHkJ1d2rhU7Uh+DmS7NkBAAAAAP7///+SPhXvmO5lpEkSYDX3pXJX4UQxOwl3kr/j1zniiE3ZngEAAAAA/v///wLcBQAAAAAAABYAFCXqLARPKT2L/r1gCcXawKthz5W+sBoAAAAAAAAWABRAhHNCgth+tfSl0MjNpNs3O47FEgJHMEQCIHl0XcCSCH7JKLwvO32VdRO0J9W0V/IL3RaQ0Vp4ac3WAiBW5cHlrtP+mxBDJ+wMj8DCjptEnO9zxDw9heSw6CL7GwEhAqfr3NqTp6UGqIA6v9n/+lddccJb0mUcHo2H1xxEIQ0AAkcwRAIgUzTkO+PIbFWFVbZRl6ygi7yt/hCYEmVijPrJFr1E458CIAbTRLNvI8lsnDhcoze8mHZTkrAhfQQxexiy4AVxPYvJASEDNiD45tgRtvrlY6QCHTSPq/yyeARojSMzPVWTgO7tHite+SQAAQEf3AUAAAAAAAAWABQl6iwETyk9i/69YAnF2sCrYc+VviIGAqfr3NqTp6UGqIA6v9n/+lddccJb0mUcHo2H1xxEIQ0AGAnAr95UAACAAQAAgAAAAIAAAAAABwAAAAAiAgI2ReskgqkBRuwxJXtQ26XViRJaolnh8310DqkZHcZkzRgJwK/eVAAAgAEAAIAAAACAAAAAAAkAAAAAIgICp+vc2pOnpQaogDq/2f/6V11xwlvSZRwejYfXHEQhDQAYCcCv3lQAAIABAACAAAAAgAAAAAAHAAAAAA==';
  const mockPsbt = new PartiallySignedTransaction(psbtString);
  const mockTxBuilderResult = new TxBuilderResult(mockPsbt, mockTransactionDetails);

  let txBuilder: TxBuilder;

  mockBdkRnModule.createTxBuilder.mockResolvedValueOnce(txBuilderId);

  beforeAll(async () => {
    txBuilder = await new TxBuilder().create();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create new instance of TxBuilder', async () => {
    expect(txBuilder.id).toBe(txBuilderId);
  });

  it('should add a recipient', async () => {
    const amount = 50000;
    await txBuilder.addRecipient(mockScript, amount);
    expect(mockBdkRnModule.addRecipient).toHaveBeenCalledWith(txBuilder.id, mockScript.id, amount);
  });
  it('should add a utxo to the internal list of unspendable utxos', async () => {
    await txBuilder.addUnspendable(outPoint);
    expect(mockBdkRnModule.addUnspendable).toHaveBeenCalledWith(txBuilder.id, outPoint);
  });
  it('should add a utxo', async () => {
    await txBuilder.addUtxo(outPoint);
    expect(mockBdkRnModule.addUtxo).toHaveBeenCalledWith(txBuilder.id, outPoint);
  });
  it('should add utxos', async () => {
    await txBuilder.addUtxos([outPoint, outPoint]);
    expect(mockBdkRnModule.addUtxos).toHaveBeenCalledWith(txBuilder.id, [outPoint, outPoint]);
  });
  it('should call do not spend change outputs', async () => {
    await txBuilder.doNotSpendChange();
    expect(mockBdkRnModule.doNotSpendChange).toHaveBeenCalledWith(txBuilder.id);
  });
  it('should only spend utxos added by add_utxo', async () => {
    await txBuilder.manuallySelectedOnly();
    expect(mockBdkRnModule.manuallySelectedOnly).toHaveBeenCalledWith(txBuilder.id);
  });
  it('should only spend change outputs', async () => {
    await txBuilder.onlySpendChange();
    expect(mockBdkRnModule.onlySpendChange).toHaveBeenCalledWith(txBuilder.id);
  });
  it('should add unspendable utxos list', async () => {
    await txBuilder.unspendable([outPoint, outPoint]);
    expect(mockBdkRnModule.unspendable).toHaveBeenCalledWith(txBuilder.id, [outPoint, outPoint]);
  });
  it('should set a custom fee rate', async () => {
    const feeRate = 21;
    await txBuilder.feeRate(feeRate);
    expect(mockBdkRnModule.feeRate).toHaveBeenCalledWith(txBuilder.id, feeRate);
  });
  it('set an absolute fee', async () => {
    const absoluteFee = 615;

    await txBuilder.feeAbsolute(absoluteFee);
    expect(mockBdkRnModule.feeAbsolute).toHaveBeenCalledWith(txBuilder.id, absoluteFee);
  });
  it('should spend all the available inputs. ', async () => {
    await txBuilder.drainWallet();
    expect(mockBdkRnModule.drainWallet).toHaveBeenCalledWith(txBuilder.id);
  });
  it('should set the address script to drain excess coins to', async () => {
    await txBuilder.drainTo(mockScript);
    expect(mockBdkRnModule.drainTo).toHaveBeenCalledWith(txBuilder.id, mockScript.id);
  });
  it('should enable signaling RBF', async () => {
    await txBuilder.enableRbf();
    expect(mockBdkRnModule.enableRbf).toHaveBeenCalledWith(txBuilder.id);
  });
  it('should enable signaling RBF with a specific nSequence value', async () => {
    const nSequence = 2;
    await txBuilder.enableRbfWithSequence(nSequence);
    expect(mockBdkRnModule.enableRbfWithSequence).toHaveBeenCalledWith(txBuilder.id, nSequence);
  });
  it('should add data as an output, using OP_RETURN', async () => {
    const data = [1, 2, 3];
    await txBuilder.addData(data);
    expect(mockBdkRnModule.addData).toHaveBeenCalledWith(txBuilder.id, data);
  });
  it('should add number of receipents at once', async () => {
    const scriptAmount = new ScriptAmount(mockScript, 500000);
    await txBuilder.setRecipients([scriptAmount, scriptAmount]);
    expect(mockBdkRnModule.setRecipients).toHaveBeenCalledWith(txBuilder.id, [scriptAmount, scriptAmount]);
  });
  it('should finish the transaction building', async () => {
    mockBdkRnModule.finish.mockResolvedValueOnce({
      base64: psbtString,
      transactionDetails: mockTransactionDetails,
    });

    let script = await mockAddress.scriptPubKey();
    await txBuilder.addRecipient(script, 1200);
    expect(mockBdkRnModule.addRecipient).toHaveBeenCalledWith(txBuilder.id, script.id, 1200);

    let res = await txBuilder.finish(mockWallet);
    expect(res).toEqual(mockTxBuilderResult);
    expect(mockBdkRnModule.finish).toHaveBeenCalledWith(txBuilder.id, mockWallet.id);
  });

  it('should return a exception when funds are insufficient', async () => {
    try {
      mockBdkRnModule.finish.mockRejectedValue(new Error('{ needed: 751, available: 0 }'));
      await txBuilder.finish(mockWallet);
    } catch (e) {
      expect(e.message).toBe('{ needed: 751, available: 0 }');
    }
  });

  it('should return a exception when no recipients are added', async () => {
    try {
      mockBdkRnModule.finish.mockRejectedValue(new Error('No Recipients'));
      await txBuilder.finish(mockWallet);
    } catch (e) {
      expect(e.message).toBe('No Recipients');
    }
  });

  it('Verify addData() Exception', async () => {
    try {
      mockBdkRnModule.addData.mockRejectedValue(new Error('List must not be empty'));
      await txBuilder.addData([]);
    } catch (e) {
      expect(e.message).toBe('List must not be empty');
    }
  });
});
