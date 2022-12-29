import { BlockchainElectrumConfig, BlockchainEsploraConfig, BlockChainNames } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Blockchain methods
 * Blockchain backends module provides the implementation of a few commonly-used backends like Electrum, and Esplora.
 */
declare class BlockchainInterface extends NativeLoader {
    private height;
    private hash;
    isInit: boolean;
    /**
     * Init blockchain at native side
     * @param config
     * @param blockchainName
     * @returns {Promise<BlockchainInterface>}
     */
    create(config: BlockchainElectrumConfig | BlockchainEsploraConfig, blockchainName?: BlockChainNames): Promise<BlockchainInterface>;
    /**
     * Get current height of the blockchain.
     * @returns {Promise<number>}
     */
    getHeight(): Promise<number>;
    /**
     * Get block hash by block height
     * @returns {Promise<number>}
     */
    getBlockHash(height?: number): Promise<string>;
}
export declare const Blockchain: BlockchainInterface;
export {};
