import { Address, Blockchain, DatabaseConfig, Descriptor, PartiallySignedTransaction, Wallet } from '../../src';
import { AddressInfo, Balance, LocalUtxo, Script, SignOptions } from '../../src/classes/Bindings';
import { AddressIndex, KeychainKind, Network } from '../../src/lib/enums';
import { createOutpoint, createTxOut } from '../../src/lib/utils';
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
  let address = 'A4CCF9FD-FCA0-4171-94FD-4726F025FAC9';
  let scriptId = '29D8A421-29F8-4113-ADA3-69D0A97C3305';
  let script = new Script(scriptId);
  mockBdkRnModule.getAddress.mockResolvedValue({
    index: addressIndex,
    address,
    keychain: KeychainKind.External,
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
  it('should create a wallet instance without change descriptor', async () => {
    wallet = await new Wallet().create(descriptor, undefined, Network.Regtest, databaseConfig);
    expect(wallet.isInit).toBe(true);
    expect(wallet.id).toBe(walletId);
  });

  it('Should return a new AddressInfo', async () => {
    let res = await wallet.getAddress(AddressIndex.New);
    expect(res).toBeInstanceOf(AddressInfo);
    expect(res.index).toBe(addressIndex);
    expect(res.address).toStrictEqual(new Address()._setAddress(address));
    expect(mockBdkRnModule.getAddress).toHaveBeenCalledWith(wallet.id, AddressIndex.New);
  });

  it('Should return a last unused AddressInfo', async () => {
    let res = await wallet.getAddress(AddressIndex.LastUnused);
    expect(res.index).toBe(addressIndex);
    expect(res.address).toStrictEqual(new Address()._setAddress(address));
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
      txout: { value, script },
      isSpent,
      keychain: KeychainKind.External,
    };
    const expected = [
      new LocalUtxo(
        createOutpoint(rawUTXOObject.outpoint),
        createTxOut(rawUTXOObject.txout),
        isSpent,
        KeychainKind.External
      ),
    ];

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
      transaction: mockTransactionDetails.transaction,
    };
    const expected = [mockTransactionDetails];
    mockBdkRnModule.listTransactions.mockResolvedValueOnce([rawTxDetails]);

    expect(await wallet.listTransactions(false)).toEqual(expected);
  });

  it('should sign a transaction', async () => {
    const base64PSBT = 'base64PSBTA';
    const base64PSBTSigned = 'base64PSBTSigned';
    const partiallySignedTransaction = new PartiallySignedTransaction(base64PSBT);
    const signOptions = new SignOptions(false, false, 100, false, false, false, false, false);

    mockBdkRnModule.sign.mockResolvedValueOnce(base64PSBTSigned);
    let res = await wallet.sign(partiallySignedTransaction, signOptions);
    expect(res).toBeInstanceOf(PartiallySignedTransaction);
    expect(res.base64).toBe(base64PSBTSigned);
    expect(mockBdkRnModule.sign).toHaveBeenCalledWith(wallet.id, base64PSBT, signOptions);
  });
});
