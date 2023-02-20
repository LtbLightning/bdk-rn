import { BlockChainNames } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Blockchain methods
 * Blockchain backends module provides the implementation of a few commonly-used backends like Electrum, and Esplora.
 */
export class Blockchain extends NativeLoader {
    constructor() {
        super(...arguments);
        this.height = 0;
        this.hash = '';
        this.id = '';
        this.isInit = false;
    }
    /**
     * Init blockchain at native side
     * @param config
     * @param blockchainName
     * @returns {Promise<Blockchain>}
     */
    async create(config, blockchainName = BlockChainNames.Electrum) {
        if (BlockChainNames.Electrum === blockchainName) {
            const { url, retry, stopGap, timeout } = config;
            this.id = await this._bdk.initElectrumBlockchain(url, retry, stopGap, timeout);
        }
        else {
            const { url, proxy, concurrency, timeout, stopGap } = config;
            this.id = await this._bdk.initEsploraBlockchain(url, proxy, concurrency, timeout, stopGap);
        }
        this.isInit = true;
        return this;
    }
    /**
     * Get current height of the blockchain.
     * @returns {Promise<number>}
     */
    async getHeight() {
        this.height = await this._bdk.getBlockchainHeight(this.id);
        return this.height;
    }
    /**
     * Get block hash by block height
     * @returns {Promise<number>}
     */
    async getBlockHash(height = this.height) {
        this.hash = await this._bdk.getBlockchainHash(this.id, height);
        return this.hash;
    }
    /**
     * Broadcast transaction
     * @returns {Promise<boolean>}
     */
    async broadcast(psbt) {
        return await this._bdk.broadcast(this.id, psbt.signedBase64);
    }
}
//# sourceMappingURL=Blockchain.js.map