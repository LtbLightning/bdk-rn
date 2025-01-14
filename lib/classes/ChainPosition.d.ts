import { NativeLoader } from './NativeLoader';
export interface ChainPositionData {
    height?: number;
    timestamp: number;
}
export declare class ChainPosition extends NativeLoader {
    id: string;
    create(position: ChainPositionData): Promise<ChainPosition>;
    getType(): Promise<string>;
    getData(): Promise<ChainPositionData>;
}
