import { NativeLoader } from './NativeLoader';
export declare class FeeRate extends NativeLoader {
    private id;
    private static _bdk;
    private constructor();
    /**
     * Create a FeeRate instance from satoshis per vbyte
     * @param satPerVb
     * @returns {Promise<FeeRate>}
     */
    static fromSatPerVb(satPerVb: number): Promise<FeeRate>;
    /**
     * Create a FeeRate instance from satoshis per kWU (kilo weight unit)
     * @param satPerKwu
     * @returns {Promise<FeeRate>}
     */
    static fromSatPerKwu(satPerKwu: number): Promise<FeeRate>;
    /**
     * Get the fee rate in satoshis per vbyte, rounded up
     * @returns {Promise<number>}
     */
    toSatPerVbCeil(): Promise<number>;
    /**
     * Get the fee rate in satoshis per vbyte, rounded down
     * @returns {Promise<number>}
     */
    toSatPerVbFloor(): Promise<number>;
    /**
     * Get the fee rate in satoshis per kWU (kilo weight unit)
     * @returns {Promise<number>}
     */
    toSatPerKwu(): Promise<number>;
    /**
     * Get the fee rate in satoshis per vbyte (alias for toSatPerVbCeil)
     * @returns {Promise<number>}
     */
    getSatPerVb(): Promise<number>;
}
