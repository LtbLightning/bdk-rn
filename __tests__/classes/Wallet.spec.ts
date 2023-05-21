import { Blockchain, DatabaseConfig, Descriptor, PartiallySignedTransaction, Wallet } from '../../src';
import { AddressInfo, Balance, LocalUtxo, OutPoint, TxOut } from '../../src/classes/Bindings';
import { AddressIndex, Network } from '../../src/lib/enums';
import { changeDescriptorString, descriptorString, mockTransactionDetails } from '../mockData';
import { mockBdkRnModule } from '../setup';

describe('Wallet', () => {
  const walletId = 'walletId';
  const mockBlockchain = new Blockchain();
  const databaseConfig = new DatabaseConfig();
  let descriptor: Descriptor;
  let changeDescriptor: Descriptor;
  let wallet: Wallet;
  let addressIndex = 82;
  let address = 'tb1qzn0qsh9wdp0m7sx877p9u8kptnvmykm9ld5lyd';
  mockBdkRnModule.getAddress.mockResolvedValue({
    index: addressIndex,
    address,
  });
  mockBdkRnModule.walletInit.mockResolvedValue(walletId);

  beforeAll(async () => {
    descriptor = await new Descriptor().create(descriptorString, Network.Regtest);
    changeDescriptor = await new Descriptor().create(changeDescriptorString, Network.Regtest);
    wallet = await new Wallet().create(descriptor, changeDescriptor, Network.Regtest, databaseConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a wallet instance', () => {
    expect(wallet).toBeInstanceOf(Wallet);
    expect(wallet.isInit).toBe(true);
    expect(wallet.id).toBe(walletId);
  });

  it('Should return a new AddressInfo', async () => {
    let res = await wallet.getAddress(AddressIndex.New);
    expect(res).toBeInstanceOf(AddressInfo);
    expect(res.index).toBe(addressIndex);
    expect(res.address).toBe(address);
    expect(mockBdkRnModule.getAddress).toHaveBeenCalledWith(wallet.id, AddressIndex.New);
  });

  it('Should return a last unused AddressInfo', async () => {
    let res = await wallet.getAddress(AddressIndex.LastUnused);
    expect(res.index).toBe(addressIndex);
    expect(res.address).toBe(address);
    expect(mockBdkRnModule.getAddress).toHaveBeenCalledWith(wallet.id, AddressIndex.LastUnused);
  });

  it('Should return valid Balance object', async () => {
    const mockedNumber = 150;
    const expectedBalance = new Balance(mockedNumber, mockedNumber, mockedNumber, mockedNumber, mockedNumber);
    mockBdkRnModule.getBalance.mockResolvedValueOnce({
      trustedPending: mockedNumber,
      untrustedPending: mockedNumber,
      confirmed: mockedNumber,
      spendable: mockedNumber,
      total: mockedNumber,
    });
    expect(await wallet.getBalance()).toEqual(expectedBalance);
  });

  it('Should return Network', async () => {
    mockBdkRnModule.getNetwork.mockResolvedValueOnce('regtest');
    expect(await wallet.network()).toBe(Network.Regtest);

    mockBdkRnModule.getNetwork.mockResolvedValueOnce('signet');
    expect(await wallet.network()).toBe(Network.Signet);

    mockBdkRnModule.getNetwork.mockResolvedValueOnce('testnet');
    expect(await wallet.network()).toBe(Network.Testnet);

    mockBdkRnModule.getNetwork.mockResolvedValueOnce('bitcoin');
    expect(await wallet.network()).toBe(Network.Bitcoin);
  });

  it('should call wallet sync and return true', async () => {
    mockBdkRnModule.sync.mockResolvedValueOnce(true);
    let res = await wallet.sync(mockBlockchain);
    expect(res).toBe(true);
    expect(mockBdkRnModule.sync).toHaveBeenCalledWith(wallet.id, mockBlockchain.id);
  });

  it('Should return list of LocalUtxo object', async () => {
    const txid = '2a206128c9aaaf8734b379def08c676954c9c76cb08e43c8852a59a503387c8f';
    const vout = 0;
    const value = 4925;
    const isSpent = false;
    const rawUTXOObject = {
      outpoint: { txid, vout },
      txout: { value, address },
      isSpent,
    };
    const expected = [new LocalUtxo(new OutPoint(txid, vout), new TxOut(value, address), false)];

    mockBdkRnModule.listUnspent.mockResolvedValueOnce([rawUTXOObject]);
    expect(await wallet.listUnspent()).toEqual(expected);
    expect(mockBdkRnModule.listUnspent).toHaveBeenCalledWith(wallet.id);
  });

  it('Should return list of TransactionDetails', async () => {
    const rawTxDetails = {
      txid: mockTransactionDetails.txid,
      received: mockTransactionDetails.received,
      sent: mockTransactionDetails.sent,
      fee: mockTransactionDetails.fee,
      confirmationTime: mockTransactionDetails.confirmationTime,
    };
    const expected = [mockTransactionDetails];
    mockBdkRnModule.listTransactions.mockResolvedValueOnce([rawTxDetails]);

    expect(await wallet.listTransactions()).toEqual(expected);
  });

  it('should sign a transaction', async () => {
    const base64PSBT = 'base64PSBTA';
    const base64PSBTSigned = 'base64PSBTSigned';
    const partiallySignedTransaction = new PartiallySignedTransaction(base64PSBT);

    mockBdkRnModule.sign.mockResolvedValueOnce(base64PSBTSigned);
    let res = await wallet.sign(partiallySignedTransaction);
    expect(res).toBeInstanceOf(PartiallySignedTransaction);
    expect(res.base64).toBe(base64PSBTSigned);
    expect(mockBdkRnModule.sign).toHaveBeenCalledWith(wallet.id, base64PSBT);
  });
});
