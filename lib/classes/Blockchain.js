import { BlockChainNames } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Blockchain methods
 * Blockchain backends module provides the implementation of a few commonly-used backends like Electrum, and Esplora.
 */
class BlockchainInterface extends NativeLoader {
    constructor() {
        super(...arguments);
        this.height = 0;
        this.hash = '';
        this.isInit = false;
    }
    /**
     * Init blockchain at native side
     * @param config
     * @param blockchainName
     * @returns {Promise<BlockchainInterface>}
     */
    async create(config, blockchainName = BlockChainNames.Electrum) {
        if (BlockChainNames.Electrum == blockchainName) {
            const { url, retry, stopGap, timeout } = config;
            this.height = await this._bdk.initElectrumBlockchain(url, retry, stopGap, timeout);
        }
        else {
            const { url, proxy, concurrency, timeout, stopGap } = config;
            this.height = await this._bdk.initEsploraBlockchain(url, proxy, concurrency, timeout, stopGap);
        }
        if (this.height > 0)
            this.isInit = true;
        return this;
    }
    /**
     * Get current height of the blockchain.
     * @returns {Promise<number>}
     */
    async getHeight() {
        this.height = await this._bdk.getBlockchainHeight();
        return this.height;
    }
    /**
     * Get block hash by block height
     * @returns {Promise<number>}
     */
    async getBlockHash(height = this.height) {
        this.hash = await this._bdk.getBlockchainHash(height);
        return this.hash;
    }
}
export const Blockchain = new BlockchainInterface();
//# sourceMappingURL=Blockchain.js.map