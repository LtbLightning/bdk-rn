import { NativeLoader } from './NativeLoader';

export class FeeRate extends NativeLoader {
  private id: string = '';
  private static _bdk: any

  private constructor(id: string) {
    super();
    this.id = id;
  }

  /**
   * Create a FeeRate instance from satoshis per vbyte
   * @param satPerVb
   * @returns {Promise<FeeRate>}
   */
  static async fromSatPerVb(satPerVb: number): Promise<FeeRate> {
    const id = await this._bdk.createFeeRateFromSatPerVb(satPerVb);
    return new FeeRate(id);
  }

  /**
   * Create a FeeRate instance from satoshis per kWU (kilo weight unit)
   * @param satPerKwu
   * @returns {Promise<FeeRate>}
   */
  static async fromSatPerKwu(satPerKwu: number): Promise<FeeRate> {
    const id = await this._bdk.createFeeRateFromSatPerKwu(satPerKwu);
    return new FeeRate(id);
  }

  /**
   * Get the fee rate in satoshis per vbyte, rounded up
   * @returns {Promise<number>}
   */
  async toSatPerVbCeil(): Promise<number> {
    return await this._bdk.feeRateToSatPerVbCeil(this.id);
  }

  /**
   * Get the fee rate in satoshis per vbyte, rounded down
   * @returns {Promise<number>}
   */
  async toSatPerVbFloor(): Promise<number> {
    return await this._bdk.feeRateToSatPerVbFloor(this.id);
  }

  /**
   * Get the fee rate in satoshis per kWU (kilo weight unit)
   * @returns {Promise<number>}
   */
  async toSatPerKwu(): Promise<number> {
    return await this._bdk.feeRateToSatPerKwu(this.id);
  }

  /**
   * Get the fee rate in satoshis per vbyte (alias for toSatPerVbCeil)
   * @returns {Promise<number>}
   */
  async getSatPerVb(): Promise<number> {
    return this.toSatPerVbCeil();
  }
}