import { BlockchainElectrumConfig, BlockchainEsploraConfig, BlockChainNames, BlockchainRpcConfig } from '../lib/enums';
import { FeeRate } from './Bindings';
import { NativeLoader } from './NativeLoader';
import { Transaction } from './Transaction';

/**
 * Blockchain methods
 * Blockchain backends module provides the implementation of a few commonly-used backends like Electrum, and Esplora.
 */
export class Blockchain extends NativeLoader {
  private height: number = 0;
  private hash: string = '';
  id: string = '';
  isInit: boolean = false;

  /**
   * Init blockchain at native side
   * @param config
   * @param blockchainName
   * @returns {Promise<Blockchain>}
   */
  async create(
    config: BlockchainElectrumConfig | BlockchainEsploraConfig | BlockchainRpcConfig,
    blockchainName: BlockChainNames = BlockChainNames.Electrum
  ): Promise<Blockchain> {
    if (BlockChainNames.Electrum === blockchainName) {
      const { url, retry, stopGap, timeout } = config as BlockchainElectrumConfig;
      this.id = await this._bdk.initElectrumBlockchain(url, retry, stopGap, timeout);
    } else if (BlockChainNames.Esplora === blockchainName) {
      const { url, proxy, concurrency, stopGap, timeout } = config as BlockchainEsploraConfig;
      this.id = await this._bdk.initEsploraBlockchain(url, proxy, concurrency, stopGap, timeout);
    } else if (BlockChainNames.Rpc === blockchainName) {
      this.id = await this._bdk.initRpcBlockchain(config as BlockchainRpcConfig);
    } else {
      throw `Invalid blockchain name passed. Allowed values are ${Object.values(BlockChainNames)}`;
    }
    this.isInit = true;
    return this;
  }

  /**
   * Get current height of the blockchain.
   * @returns {Promise<number>}
   */
  async getHeight(): Promise<number> {
    this.height = await this._bdk.getBlockchainHeight(this.id);
    return this.height;
  }

  /**
   * Get block hash by block height
   * @returns {Promise<number>}
   */
  async getBlockHash(height: number = this.height): Promise<string> {
    this.hash = await this._bdk.getBlockchainHash(this.id, height);
    return this.hash;
  }

  /**
   * Broadcast transaction
   * @returns {Promise<boolean>}
   */
  async broadcast(tx: Transaction): Promise<boolean> {
    return await this._bdk.broadcast(this.id, tx.id);
  }

  /**
   * Estimate the fee rate required to confirm a transaction in a given target of blocks
   * @returns {Promise<number>}
   */
  async estimateFee(target: number): Promise<FeeRate> {
    let feeRate = await this._bdk.estimateFee(this.id, target);
    return new FeeRate(feeRate);
  }
}
