import { BlockchainElectrumConfig, BlockchainEsploraConfig, BlockChainNames } from '../lib/enums';
import { NativeLoader } from './NativeLoader';

/**
 * Blockchain methods
 * Blockchain backends module provides the implementation of a few commonly-used backends like Electrum, and Esplora.
 */
class BlockchainInterface extends NativeLoader {
  private height: number = 0;
  private hash: string = '';
  public isInit: boolean = false;

  /**
   * Init blockchain at native side
   * @param config
   * @param blockchainName
   * @returns {Promise<BlockchainInterface>}
   */
  async create(
    config: BlockchainElectrumConfig | BlockchainEsploraConfig,
    blockchainName: BlockChainNames = BlockChainNames.Electrum
  ): Promise<BlockchainInterface> {
    if (BlockChainNames.Electrum === blockchainName) {
      const { url, retry, stopGap, timeout } = config as BlockchainElectrumConfig;
      this.height = await this._bdk.initElectrumBlockchain(url, retry, stopGap, timeout);
    } else {
      const { url, proxy, concurrency, timeout, stopGap } = config as BlockchainEsploraConfig;
      this.height = await this._bdk.initEsploraBlockchain(url, proxy, concurrency, timeout, stopGap);
    }
    if (this.height > 0) this.isInit = true;
    return this;
  }

  /**
   * Get current height of the blockchain.
   * @returns {Promise<number>}
   */
  async getHeight(): Promise<number> {
    this.height = await this._bdk.getBlockchainHeight();
    return this.height;
  }

  /**
   * Get block hash by block height
   * @returns {Promise<number>}
   */
  async getBlockHash(height: number = this.height): Promise<string> {
    this.hash = await this._bdk.getBlockchainHash(height);
    return this.hash;
  }
}

export const Blockchain = new BlockchainInterface();
