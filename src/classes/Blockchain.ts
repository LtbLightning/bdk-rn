import { PartiallySignedTransaction } from './PartiallySignedTransaction';
import { BlockchainElectrumConfig, BlockchainEsploraConfig, BlockChainNames } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
import { FeeRate } from './Bindings';
import { Transaction } from 'bdk-rn/src/classes/Transaction';

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
    config: BlockchainElectrumConfig | BlockchainEsploraConfig,
    blockchainName: BlockChainNames = BlockChainNames.Electrum
  ): Promise<Blockchain> {
    if (BlockChainNames.Electrum === blockchainName) {
      const { url, retry, stopGap, timeout } = config as BlockchainElectrumConfig;
      this.id = await this._bdk.initElectrumBlockchain(url, retry, stopGap, timeout);
    } else {
      const { url, proxy, concurrency, timeout, stopGap } = config as BlockchainEsploraConfig;
      this.id = await this._bdk.initEsploraBlockchain(url, proxy, concurrency, timeout, stopGap);
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
