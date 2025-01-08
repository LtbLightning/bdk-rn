import { NativeLoader } from './NativeLoader';

export class Amount extends NativeLoader {
  private _satoshis: number;
  private static _bdk: any;

  private constructor(satoshis: number) {
    super();
    this._satoshis = satoshis;
  }

  // Add this static method to initialize _bdk
  static initialize(bdk: any) {
    Amount._bdk = bdk;
  }

  /**
   * Create an Amount instance from satoshis
   * @param satoshis
   * @returns {Promise<Amount>}
   */
  static async fromSat(satoshis: number): Promise<Amount> {
    const sats = await Amount._bdk.createAmountFromSat(satoshis);
    return new Amount(sats);
  }

  /**
   * Create an Amount instance from BTC
   * @param btc
   * @returns {Promise<Amount>}
   */
  static async fromBtc(btc: number): Promise<Amount> {
    const sats = await Amount._bdk.createAmountFromBtc(btc);
    return new Amount(sats);
  }

  /**
   * Get the amount in satoshis
   * @returns {Promise<number>}
   */
  async asSats(): Promise<number> {
    return await this._bdk.amountAsSats(this._satoshis);
  }

  /**
   * Get the amount in BTC
   * @returns {Promise<number>}
   */
  async asBtc(): Promise<number> {
    return await this._bdk.amountAsBtc(this._satoshis);
  }

  /**
   * Get the amount in satoshis (synchronous)
   * @returns {number}
   */
  toSats(): number {
    return this._satoshis;
  }

  /**
   * Add two Amount instances
   * @param other
   * @returns {Amount}
   */
  add(other: Amount): Amount {
    return new Amount(this._satoshis + other._satoshis);
  }

  /**
   * Subtract two Amount instances
   * @param other
   * @returns {Amount}
   */
  subtract(other: Amount): Amount {
    return new Amount(this._satoshis - other._satoshis);
  }

  /**
   * Multiply Amount by a factor
   * @param factor
   * @returns {Amount}
   */
  multiply(factor: number): Amount {
    return new Amount(Math.floor(this._satoshis * factor));
  }

  /**
   * Divide Amount by a divisor
   * @param divisor
   * @returns {Amount}
   */
  divide(divisor: number): Amount {
    return new Amount(Math.floor(this._satoshis / divisor));
  }

  /**
   * Compare two Amount instances
   * @param other
   * @returns {number}
   */
  compareTo(other: Amount): number {
    return this._satoshis - other._satoshis;
  }

  /**
   * Check if two Amount instances are equal
   * @param other
   * @returns {boolean}
   */
  equals(other: Amount): boolean {
    return this._satoshis === other._satoshis;
  }
}