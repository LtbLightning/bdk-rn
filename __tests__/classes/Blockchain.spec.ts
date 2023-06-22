import { Blockchain, Transaction } from '../../src';
import { FeeRate } from '../../src/classes/Bindings';
import {
  BlockchainElectrumConfig,
  BlockchainEsploraConfig,
  BlockChainNames,
  BlockchainRpcConfig,
  Network,
} from '../../src/lib/enums';
import { mockBdkRnModule } from '../setup';

const height = 2396450;
const hash = '0000000000004c01f2723acaa5e87467ebd2768cc5eadcf1ea0d0c4f1731efce';

const electrumConfig: BlockchainElectrumConfig = {
  url: 'url',
  sock5: null,
  retry: 5,
  timeout: 1000,
  stopGap: 25,
  validateDomain: false,
};

const esploraConfig: BlockchainEsploraConfig = {
  baseUrl: 'url',
  proxy: 'proxy',
  concurrency: 5,
  timeout: 1000,
  stopGap: 25,
};
const rpcConfig: BlockchainRpcConfig = {
  url: 'url',
  authCookie: 'authCookie',
  authUserPass: {
    username: 'username',
    password: 'password',
  },
  network: Network.Regtest,
  walletName: 'walletName',
  syncParams: {
    startScriptCount: 0,
    startTime: 0,
    forceStartTime: true,
    pollRateSec: 0,
  },
};

mockBdkRnModule.initElectrumBlockchain.mockReturnValue('electrum');
mockBdkRnModule.initEsploraBlockchain.mockReturnValue('esplora');
mockBdkRnModule.initRpcBlockchain.mockReturnValue('rpc');

describe('Blockchain', () => {
  let blockChain: Blockchain;

  beforeEach(async () => {
    blockChain = await new Blockchain().create(electrumConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initialises with electrum config', async () => {
    const { url, sock5, retry, timeout, stopGap, validateDomain } = electrumConfig;

    blockChain = await new Blockchain().create(electrumConfig, BlockChainNames.Electrum);
    expect(blockChain.id).toBe('electrum');
    expect(mockBdkRnModule.initElectrumBlockchain).toHaveBeenCalledWith(
      url,
      sock5,
      retry,
      timeout,
      stopGap,
      validateDomain
    );
  });

  it('initialises with esplora config', async () => {
    const { baseUrl, proxy, concurrency, timeout, stopGap } = esploraConfig;

    blockChain = await new Blockchain().create(esploraConfig, BlockChainNames.Esplora);
    expect(blockChain.id).toBe('esplora');
    expect(mockBdkRnModule.initEsploraBlockchain).toHaveBeenCalledWith(baseUrl, proxy, concurrency, stopGap, timeout);
  });

  it('initialises with rpc config', async () => {
    blockChain = await new Blockchain().create(rpcConfig, BlockChainNames.Rpc);
    expect(blockChain.id).toBe('rpc');
    expect(mockBdkRnModule.initRpcBlockchain).toHaveBeenCalledWith(rpcConfig);
  });

  it('throws error if invalid name is passed', async () => {
    try {
      // @ts-ignore
      blockChain = await new Blockchain().create(rpcConfig, 'wrong');
    } catch (e) {
      expect(e).toBe('Invalid blockchain name passed. Allowed values are Electrum,Esplora,Rpc');
    }
  });

  it('gets block height', async () => {
    mockBdkRnModule.getBlockchainHeight.mockResolvedValue(height);
    let res = await blockChain.getHeight();
    expect(res).toBe(height);
  });

  it('gets most recent block hash', async () => {
    const newHeight = height + 2;
    mockBdkRnModule.getBlockchainHeight.mockResolvedValue(newHeight);
    mockBdkRnModule.getBlockchainHash.mockResolvedValue(hash);
    await blockChain.getHeight();
    let res = await blockChain.getBlockHash();
    expect(mockBdkRnModule.getBlockchainHash).toHaveBeenCalledWith('electrum', newHeight);

    expect(res).toBe(hash);
  });
  it('gets block hash based on height', async () => {
    mockBdkRnModule.getBlockchainHash.mockResolvedValue(hash);
    let res = await blockChain.getBlockHash(height);
    expect(mockBdkRnModule.getBlockchainHash).toHaveBeenCalledWith('electrum', height);
    expect(res).toBe(hash);
  });

  it('broadcasts tx', async () => {
    mockBdkRnModule.broadcast.mockResolvedValue(true);
    const mockTx = await new Transaction().create([1, 2, 34]);
    let res = await blockChain.broadcast(mockTx);
    expect(res).toBe(true);
  });
  it('estimates fees based on target number', async () => {
    mockBdkRnModule.estimateFee.mockResolvedValue(10);
    let res = await blockChain.estimateFee(6);
    expect(res).toEqual(new FeeRate(10));
  });
});
