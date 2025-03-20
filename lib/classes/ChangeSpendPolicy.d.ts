import { NativeLoader } from './NativeLoader';
export type ChainPosition = {
    type: 'confirmed' | 'unconfirmed';
    height?: number;
    timestamp: number;
};
/**
 * ChangeSpendPolicy methods
 */
export declare class ChangeSpendPolicy extends NativeLoader {
    isInit: boolean;
    id: string;
    /**
     * ChangeSpendPolicy constructor
     * @param position
     * @returns {Promise<ChangeSpendPolicy>}
     */
    create(position: ChainPosition): Promise<ChangeSpendPolicy>;
    /**
     * Get the type of the ChainPosition
     * @returns {Promise<'confirmed' | 'unconfirmed'>}
     */
    getType(): Promise<'confirmed' | 'unconfirmed'>;
    /**
     * Get the data of the ChainPosition
     * @returns {Promise<ChainPosition>}
     */
    getData(): Promise<ChainPosition>;
}
