import { Balance, LocalUtxo, Script } from '../src/classes/Bindings';
import { OutPoint } from '../src/classes/Bindings';
import { TransactionDetails } from '../src/classes/Bindings';
import { BlockTime } from '../src/classes/Bindings';
import { TxOut } from '../src/classes/Bindings';
import { AddressInfo } from '../src/classes/Bindings';
import { Address, Blockchain, DerivationPath, DescriptorPublicKey, DescriptorSecretKey, Wallet } from '../src/index';
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
const mockScript = new Script('test_id');

/** Blockchain test suite */
const height = 2396450;
const hash = '0000000000004c01f2723acaa5e87467ebd2768cc5eadcf1ea0d0c4f1731efce';
const mockedNumber = 150;
const mockedString = 'test';
const mockedBool = true;
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
    let localTxObject = [
      new TransactionDetails(
        'c9bb2ad8612a4774c903b1d9be86ecddb374e8fd43262802542d4c903bd9002e',
        7625,
        8564,
        141,
        new BlockTime(2410324, 1670479190)
      ),
    ];
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
