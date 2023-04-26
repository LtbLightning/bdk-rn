import { Balance, LocalUtxo, Script, TxBuilderResult } from '../src/classes/Bindings';
import { OutPoint } from '../src/classes/Bindings';
import { TransactionDetails } from '../src/classes/Bindings';
import { BlockTime } from '../src/classes/Bindings';
import { TxOut } from '../src/classes/Bindings';
import { AddressInfo } from '../src/classes/Bindings';
import {
  Address,
  Blockchain,
  BumpFeeTxBuilder,
  DerivationPath,
  DescriptorPublicKey,
  DescriptorSecretKey,
  PartiallySignedTransaction,
  TxBuilder,
  Wallet,
} from '../src/index';
import { AddressIndex, Network } from '../src/lib/enums';
import { when } from 'jest-when';
jest.mock('./../src/index.ts');

/** Mocked all needed classes */
const mockBlockchain = new Blockchain();
const mockWallet = new Wallet();
const mockDescriptorSecret = new DescriptorSecretKey();
const mockDescriptorPublic = new DescriptorPublicKey();
const mockDerivationPath = new DerivationPath();
const mockAddress = new Address();
const mockScript = new Script('mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB');
const mockTxBuilder = new TxBuilder();
const mockBumpFeeTxBuilder = new BumpFeeTxBuilder();

/** Blockchain test suite */
const height = 2396450;
const hash = '0000000000004c01f2723acaa5e87467ebd2768cc5eadcf1ea0d0c4f1731efce';
const mockedNumber = 150;
const psbtString =
  'cHNidP8BAJoBAAAAAivIGwj79VJdDEMC6DTEBFWNRXh8i63O5Bj2ul/ckLSiAAAAAAD+////q/fYDAwa/ovXiOHXMMJWBzSSppAfXu8xVBWr97kc60kAAAAAAP7///8CCwUAAAAAAAAWABTiG3occFHBPEfIFYEno1q+KemyBNwFAAAAAAAAFgAUJeosBE8pPYv+vWAJxdrAq2HPlb50ByUAAAEA3gEAAAAAAQG1SXpVEroudlm2vsvLISuSLWqp3SMiU8bE/zFmMfSlrAEAAAAA/v///wLcBQAAAAAAABYAFCXqLARPKT2L/r1gCcXawKthz5W+kRAAAAAAAAAWABRIuasG/iTpawzZOHBRQUPdiAgtjwJHMEQCICkgZhWePD/RuE7V87/VcxX6PIv9LPg8+K6O42bX49usAiBe+ohVk1/abwUqmeqYuSM8x/e6sDrnZB1rD6GFdfm9iQEhApqPApANDfpFbG9N/WKaIz7W/c4Mf/7J8Zw2Usaj0G/InfEkAAEBH9wFAAAAAAAAFgAUJeosBE8pPYv+vWAJxdrAq2HPlb4iBgKn69zak6elBqiAOr/Z//pXXXHCW9JlHB6Nh9ccRCENABgJwK/eVAAAgAEAAIAAAACAAAAAAAcAAAAAAQD9cgEBAAAAAAECovbyC3Cz7gh5c5NeEl+NmyrVHkJ1d2rhU7Uh+DmS7NkBAAAAAP7///+SPhXvmO5lpEkSYDX3pXJX4UQxOwl3kr/j1zniiE3ZngEAAAAA/v///wLcBQAAAAAAABYAFCXqLARPKT2L/r1gCcXawKthz5W+sBoAAAAAAAAWABRAhHNCgth+tfSl0MjNpNs3O47FEgJHMEQCIHl0XcCSCH7JKLwvO32VdRO0J9W0V/IL3RaQ0Vp4ac3WAiBW5cHlrtP+mxBDJ+wMj8DCjptEnO9zxDw9heSw6CL7GwEhAqfr3NqTp6UGqIA6v9n/+lddccJb0mUcHo2H1xxEIQ0AAkcwRAIgUzTkO+PIbFWFVbZRl6ygi7yt/hCYEmVijPrJFr1E458CIAbTRLNvI8lsnDhcoze8mHZTkrAhfQQxexiy4AVxPYvJASEDNiD45tgRtvrlY6QCHTSPq/yyeARojSMzPVWTgO7tHite+SQAAQEf3AUAAAAAAAAWABQl6iwETyk9i/69YAnF2sCrYc+VviIGAqfr3NqTp6UGqIA6v9n/+lddccJb0mUcHo2H1xxEIQ0AGAnAr95UAACAAQAAgAAAAIAAAAAABwAAAAAiAgI2ReskgqkBRuwxJXtQ26XViRJaolnh8310DqkZHcZkzRgJwK/eVAAAgAEAAIAAAACAAAAAAAkAAAAAIgICp+vc2pOnpQaogDq/2f/6V11xwlvSZRwejYfXHEQhDQAYCcCv3lQAAIABAACAAAAAgAAAAAAHAAAAAA==';

const mockPsbt = new PartiallySignedTransaction(psbtString);
const mockTransactionDetails = new TransactionDetails(
  'c9bb2ad8612a4774c903b1d9be86ecddb374e8fd43262802542d4c903bd9002e',
  7625,
  8564,
  141,
  new BlockTime(2410324, 1670479190)
);
const mockTxBuilderResult = new TxBuilderResult(mockPsbt, mockTransactionDetails);

describe('Blockchain', () => {
  it('verify getHeight', async () => {
    jest.spyOn(mockBlockchain, 'getHeight').mockResolvedValue(height);
    let res = await mockBlockchain.getHeight();
    await expect(res).toBe(height);
  });

  it('verify getBlockHash', async () => {
    when(mockBlockchain.getBlockHash).calledWith(height).mockResolvedValue(hash);
    let res = await mockBlockchain.getBlockHash(height);
    await expect(res).toBe(hash);
  });
});

/** FeeRate test suite */
describe('FeeRate', () => {
  it('Should return a double when called', async () => {});
});

/** Wallet test suite */
describe('Wallet', () => {
  let addressIndex = 82;
  let address = 'tb1qzn0qsh9wdp0m7sx877p9u8kptnvmykm9ld5lyd';
  jest.spyOn(mockWallet, 'getAddress').mockResolvedValue(new AddressInfo(addressIndex, address));

  it('Should return valid AddressInfo Object', async () => {
    let res = await mockWallet.getAddress(AddressIndex.New);
    expect(res).toBeInstanceOf(AddressInfo);
  });

  it('Should return a new AddressInfo', async () => {
    let res = await mockWallet.getAddress(AddressIndex.New);
    expect(res.index).toBe(addressIndex);
    expect(res.address).toBe(address);
  });

  it('Should return a last unused AddressInfo', async () => {
    let res = await mockWallet.getAddress(AddressIndex.LastUnused);
    expect(res.index).toBe(addressIndex);
    expect(res.address).toBe(address);
  });

  it('Should return valid Balance object', async () => {
    jest
      .spyOn(mockWallet, 'getBalance')
      .mockResolvedValue(new Balance(mockedNumber, mockedNumber, mockedNumber, mockedNumber, mockedNumber));
    let res = await mockWallet.getBalance();
    expect(res).toBeInstanceOf(Balance);
  });

  it('Should return Network', async () => {
    jest.spyOn(mockWallet, 'network').mockResolvedValue(Network.Testnet);
    let res = await mockWallet.network();
    expect(res).toBe(Network.Testnet);
  });

  it('Should return list of LocalUtxo object', async () => {
    let localUtxoObject = [
      new LocalUtxo(
        new OutPoint('2a206128c9aaaf8734b379def08c676954c9c76cb08e43c8852a59a503387c8f', 0),
        new TxOut(4925, 'tb1qeh39x559mn3nx0lrdal4ld77d7rl2ej8y54h4l'),
        false
      ),
    ];
    when(mockWallet.listUnspent).mockResolvedValue(localUtxoObject);
    let res = await mockWallet.listUnspent();
    expect(res).toBe(localUtxoObject);
  });

  it('Should return list of TransactionDetails', async () => {
    let localTxObject = [mockTransactionDetails];
    when(mockWallet.listTransactions).mockResolvedValue(localTxObject);
    let res = await mockWallet.listTransactions();
    expect(res).toBe(localTxObject);
  });

  it('Should wallet sync and return true', async () => {
    when(mockWallet.sync).calledWith(mockBlockchain).mockResolvedValue(true);
    let res = await mockWallet.sync(mockBlockchain);
    expect(res).toBe(true);
  });
});

/** DescriptorSecret test suite */
describe('DescriptorSecret', () => {
  it('verify derive()', async () => {
    when(mockDescriptorSecret.derive).calledWith(mockDerivationPath).mockResolvedValue(mockDescriptorSecret);
    let res = await mockDescriptorSecret.derive(mockDerivationPath);
    expect(res).toBeInstanceOf(DescriptorSecretKey);
  });

  it('verify extend()', async () => {
    when(mockDescriptorSecret.extend).calledWith(mockDerivationPath).mockResolvedValue(mockDescriptorSecret);
    let res = await mockDescriptorSecret.extend(mockDerivationPath);
    expect(res).toBeInstanceOf(DescriptorSecretKey);
  });

  it('verify asPublic()', async () => {
    when(mockDescriptorSecret.asPublic).mockResolvedValue(mockDescriptorPublic);
    let res = await mockDescriptorSecret.asPublic();
    expect(res).toBeInstanceOf(DescriptorPublicKey);
  });

  it('verify asString()', async () => {
    when(mockDescriptorSecret.asString).mockResolvedValue(
      'tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw/*'
    );
    let res = await mockDescriptorSecret.asString();
    expect(res).toBe(
      'tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw/*'
    );
  });
});

/** DescriptorPublic test suite */
describe('DescriptorPublic', () => {
  it('verify derive()', async () => {
    when(mockDescriptorPublic.derive).calledWith(mockDerivationPath).mockResolvedValue(mockDescriptorPublic);
    let res = await mockDescriptorPublic.derive(mockDerivationPath);
    expect(res).toBeInstanceOf(DescriptorPublicKey);
  });

  it('verify extend()', async () => {
    when(mockDescriptorPublic.extend).calledWith(mockDerivationPath).mockResolvedValue(mockDescriptorPublic);
    let res = await mockDescriptorPublic.extend(mockDerivationPath);
    expect(res).toBeInstanceOf(DescriptorPublicKey);
  });

  it('verify asString()', async () => {
    when(mockDescriptorPublic.asString).mockResolvedValue(
      'tpubD6NzVbkrYhZ4X6hhuGPZoxCNUmTK2Wbh1X6sWFVNW5xVK1e7j4cxa7gdqPfWZ9AKeiaYYjhVi75t2gbubG3oPNpwpAoMtW9ki4Aj7itJMhm/*'
    );
    let res = await mockDescriptorPublic.asString();
    expect(res).toBe(
      'tpubD6NzVbkrYhZ4X6hhuGPZoxCNUmTK2Wbh1X6sWFVNW5xVK1e7j4cxa7gdqPfWZ9AKeiaYYjhVi75t2gbubG3oPNpwpAoMtW9ki4Aj7itJMhm/*'
    );
  });
});

/** Address test suite */
describe('Address', () => {
  it('verify scriptPubKey()', async () => {
    when(mockAddress.scriptPubKey).mockResolvedValue(mockScript);
    let res = await mockAddress.scriptPubKey();
    expect(res).toBeInstanceOf(Script);
  });
});

/** Script test suite */
describe('Script', () => {
  it('verify create', async () => {
    let res = mockScript;
    expect(res).toBeInstanceOf(Script);
  });
});

/** TxBuilder test suite*/
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

/** BumpFeeTxBuilder test suite*/
describe('Bump Fee Tx Builder', () => {
  test('Should return a exception when txid is invalid', async () => {
    try {
      jest.spyOn(mockBumpFeeTxBuilder, 'finish').mockRejectedValue(new Error('TransactionNotFound'));
      await mockBumpFeeTxBuilder.finish(mockWallet);
    } catch (e) {
      expect(e.message).toBe('TransactionNotFound');
    }
  });
});
