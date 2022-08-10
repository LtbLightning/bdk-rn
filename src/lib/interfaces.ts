export interface Response {
  error: boolean;
  data: any;
}

export type NetworkType = 'bitcoin' | 'testnet' | 'signet' | 'regtest';
export interface GenerateMnemonicRequest {
  entropy?: 128 | 160 | 192 | 224 | 256;
  length?: 12 | 15 | 18 | 21 | 24;
  network?: NetworkType;
}

export interface CreateExtendedKeyRequest {
  network?: NetworkType;
  mnemonic?: string;
  password?: string;
}
export interface CreateExtendedKeyResponse {
  fingerprint: string;
  mnemonic: string;
  xprv: string;
}

export type WPKH = 'default' | null | '' | 'p2wpkh' | 'wpkh' | undefined;
export type P2PKH = 'p2pkh' | 'pkh';
export type SHP2WPKH = 'shp2wpkh' | 'p2shp2wpkh';

export interface CreateDescriptorRequest {
  type?: WPKH | P2PKH | SHP2WPKH | 'MULTI';

  /**
   * Required if xprv flow is chosen
   */
  xprv?: string;

  /**
   * Required if mnemonic flow is chosen
   */
  mnemonic?: string;

  /**
   * Optional and only if mnemonic flow is chosen
   */
  password?: string;

  /**
   * Required if mnemonic flow is chosen
   */
  network?: NetworkType;

  /**
   * If want to use custom path instead of default(/84'/1'/0'/0/*)
   */
  path?: string;

  /**
   * required if type is MULTI
   * can't be 0 or grator than number public keys
   * */
  thresold?: number;

  /**
   * Array of public keys
   */
  publicKeys?: Array<string>;
}

export interface createWalletRequest {
  mnemonic?: string;
  descriptor?: string;
  password?: string;
  network?: NetworkType;
  blockChainConfigUrl?: string;
  blockChainSocket5?: string;
  retry?: string;
  timeOut?: string;
  blockChainName?: string;
}

export interface createWalletResponse {
  address: string;
}
export interface BroadcastTransactionRequest {
  address: string;
  amount: number;
}

export interface ConfirmedTransaction {
  txid: string;
  block_timestamp: number;
  sent: number;
  block_height: number;
  received: number;
  fee: number;
}

export interface PendingTransaction {
  txid: string;
  sent: number;
  received: number;
  fee: number;
}

export interface TransactionsResponse {
  confirmed: Array<ConfirmedTransaction>;
  pending: Array<PendingTransaction>;
}
