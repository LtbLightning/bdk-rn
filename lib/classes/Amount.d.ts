import { NativeLoader } from './NativeLoader';
export declare class Amount extends NativeLoader {
    private _satoshis;
    private static _bdk;
    private constructor();
    static initialize(bdk: any): void;
    /**
     * Create an Amount instance from satoshis
     * @param satoshis
     * @returns {Promise<Amount>}
     */
    static fromSat(satoshis: number): Promise<Amount>;
    /**
     * Create an Amount instance from BTC
     * @param btc
     * @returns {Promise<Amount>}
     */
    static fromBtc(btc: number): Promise<Amount>;
    /**
     * Get the amount in satoshis
     * @returns {Promise<number>}
     */
    asSats(): Promise<number>;
    /**
     * Get the amount in BTC
     * @returns {Promise<number>}
     */
    asBtc(): Promise<number>;
    /**
     * Get the amount in satoshis (synchronous)
     * @returns {number}
     */
    toSats(): number;
    /**
     * Add two Amount instances
     * @param other
     * @returns {Amount}
     */
    add(other: Amount): Amount;
    /**
     * Subtract two Amount instances
     * @param other
     * @returns {Amount}
     */
    subtract(other: Amount): Amount;
    /**
     * Multiply Amount by a factor
     * @param factor
     * @returns {Amount}
     */
    multiply(factor: number): Amount;
    /**
     * Divide Amount by a divisor
     * @param divisor
     * @returns {Amount}
     */
    divide(divisor: number): Amount;
    /**
     * Compare two Amount instances
     * @param other
     * @returns {number}
     */
    compareTo(other: Amount): number;
    /**
     * Check if two Amount instances are equal
     * @param other
     * @returns {boolean}
     */
    equals(other: Amount): boolean;
}
