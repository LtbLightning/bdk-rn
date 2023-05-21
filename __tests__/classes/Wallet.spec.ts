import { when } from 'jest-when';

import { Blockchain } from '../../src';
import { AddressInfo, Balance, LocalUtxo, OutPoint, TxOut } from '../../src/classes/Bindings';
import { AddressIndex, Network } from '../../src/lib/enums';
import { mockTransactionDetails, mockWallet } from '../mockData';

describe('Wallet', () => {
  const mockedNumber = 150;
  const mockBlockchain = new Blockchain();

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
