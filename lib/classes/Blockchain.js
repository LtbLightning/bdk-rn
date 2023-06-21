import { BlockChainNames } from '../lib/enums';
import { FeeRate } from './Bindings';
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
            const { url, sock5, retry, timeout, stopGap, validateDomain } = config;
            this.id = await this._bdk.initElectrumBlockchain(url, sock5, retry, timeout, stopGap, validateDomain);
        }
        else if (BlockChainNames.Esplora === blockchainName) {
            const { baseUrl, proxy, concurrency, stopGap, timeout } = config;
            this.id = await this._bdk.initEsploraBlockchain(baseUrl, proxy, concurrency, stopGap, timeout);
        }
        else if (BlockChainNames.Rpc === blockchainName) {
            this.id = await this._bdk.initRpcBlockchain(config);
        }
        else {
            throw `Invalid blockchain name passed. Allowed values are ${Object.values(BlockChainNames)}`;
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
    async broadcast(tx) {
        return await this._bdk.broadcast(this.id, tx.id);
    }
    /**
     * Estimate the fee rate required to confirm a transaction in a given target of blocks
     * @returns {Promise<number>}
     */
    async estimateFee(target) {
        let feeRate = await this._bdk.estimateFee(this.id, target);
        return new FeeRate(feeRate);
    }
}
//# sourceMappingURL=Blockchain.js.map