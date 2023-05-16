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

const mockBlockchain = new Blockchain();
const height = 2396450;
const hash = '0000000000004c01f2723acaa5e87467ebd2768cc5eadcf1ea0d0c4f1731efce';

const electrumConfig: BlockchainElectrumConfig = {
  url: 'url',
  retry: '',
  timeout: '1000',
  stopGap: '25',
};

const esploraConfig: BlockchainEsploraConfig = {
  url: 'url',
  proxy: 'proxy',
  concurrency: 'concurrency',
  timeout: '1000',
  stopGap: '25',
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
  let blockChain;

  beforeEach(async () => {
    blockChain = await new Blockchain().create(electrumConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initialises with electrum config', async () => {
    const { url, retry, stopGap, timeout } = electrumConfig;

    blockChain = await new Blockchain().create(electrumConfig, BlockChainNames.Electrum);
    expect(blockChain.id).toBe('electrum');
    expect(mockBdkRnModule.initElectrumBlockchain).toHaveBeenCalledWith(url, retry, stopGap, timeout);
  });

  it('initialises with esplora config', async () => {
    const { url, proxy, concurrency, timeout, stopGap } = esploraConfig;

    blockChain = await new Blockchain().create(esploraConfig, BlockChainNames.Esplora);
    expect(blockChain.id).toBe('esplora');
    expect(mockBdkRnModule.initEsploraBlockchain).toHaveBeenCalledWith(url, proxy, concurrency, timeout, stopGap);
  });

  it('initialises with rpc config', async () => {
    blockChain = await new Blockchain().create(rpcConfig, BlockChainNames.Rpc);
    expect(blockChain.id).toBe('rpc');
    expect(mockBdkRnModule.initRpcBlockchain).toHaveBeenCalledWith(rpcConfig);
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
    await mockBlockchain.getHeight();
    let res = await mockBlockchain.getBlockHash();
    expect(mockBdkRnModule.getBlockchainHash).toHaveBeenCalledWith(newHeight);

    expect(res).toBe(hash);
  });
  it('gets block hash based on height', async () => {
    mockBdkRnModule.getBlockchainHash.mockResolvedValue(hash);
    let res = await mockBlockchain.getBlockHash(height);
    expect(mockBdkRnModule.getBlockchainHash).toHaveBeenCalledWith(height);
    expect(res).toBe(hash);
  });

  it('broadcasts tx', async () => {
    mockBdkRnModule.broadcast.mockResolvedValue(true);
    const mockTx = await new Transaction().create([1, 2, 34]);
    let res = await mockBlockchain.broadcast(mockTx);
    expect(res).toBe(true);
  });
  it('estimates fees based on target number', async () => {
    mockBdkRnModule.estimateFee.mockResolvedValue(10);
    let res = await mockBlockchain.estimateFee(6);
    expect(res).toEqual(new FeeRate(10));
  });
});
