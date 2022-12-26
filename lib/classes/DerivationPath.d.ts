import { NativeLoader } from './NativeLoader';
declare class DerivationPathInterface extends NativeLoader {
    private path;
    create(path: string): Promise<DerivationPathInterface>;
    /**
     * @returns {string}
     */
    asString(): string | undefined;
}
export declare const DerivationPath: DerivationPathInterface;
export {};
