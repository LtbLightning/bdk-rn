import { NativeLoader } from './NativeLoader';

export class Balance extends NativeLoader {
  private _walletId: string;

  constructor(walletId: string) {
    super();
    this._walletId = walletId;
  }

  /**
   * Get the full balance details
   * @returns {Promise<BalanceDetails>}
   */
  async getBalance(): Promise<BalanceDetails> {
    const balance = await this._bdk.getBalance(this._walletId);
    return {
      immature: await this.getImmature(),
      trustedPending: await this.getTrustedPending(),
      untrustedPending: await this.getUntrustedPending(),
      confirmed: await this.getConfirmed(),
      trustedSpendable: await this.getTrustedSpendable(),
      total: balance.total
    };
  }

  /**
   * Get the immature balance
   * @returns {Promise<number>}
   */
  async getImmature(): Promise<number> {
    return await this._bdk.getBalanceImmature(this._walletId);
  }

  /**
   * Get the trusted pending balance
   * @returns {Promise<number>}
   */
  async getTrustedPending(): Promise<number> {
    return await this._bdk.getBalanceTrustedPending(this._walletId);
  }

  /**
   * Get the untrusted pending balance
   * @returns {Promise<number>}
   */
  async getUntrustedPending(): Promise<number> {
    return await this._bdk.getBalanceUntrustedPending(this._walletId);
  }

  /**
   * Get the confirmed balance
   * @returns {Promise<number>}
   */
  async getConfirmed(): Promise<number> {
    return await this._bdk.getBalanceConfirmed(this._walletId);
  }

  /**
   * Get the trusted spendable balance
   * @returns {Promise<number>}
   */
  async getTrustedSpendable(): Promise<number> {
    return await this._bdk.getBalanceTrustedSpendable(this._walletId);
  }

  /**
   * Get the total balance
   * @returns {Promise<number>}
   */
  async getTotal(): Promise<number> {
    return await this._bdk.getBalanceTotal(this._walletId);
  }
}

export interface BalanceDetails {
  immature: number;
  trustedPending: number;
  untrustedPending: number;
  confirmed: number;
  trustedSpendable: number;
  total: number;
}