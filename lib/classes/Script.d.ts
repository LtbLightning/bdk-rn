import { NativeLoader } from './NativeLoader';
/**
 * Address script class
 */
export declare class Script extends NativeLoader {
    id: string;
    constructor(id: string);
    toBytes(): Promise<Array<number>>;
}
