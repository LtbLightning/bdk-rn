export enum WordCount {
  WORDS12 = 12,
  WORDS15 = 15,
  WORDS18 = 18,
  WORDS21 = 21,
  WORDS24 = 24,
}

export enum Network {
  Testnet = 'testnet',
  Regtest = 'regtest',
  Bitcoin = 'bitcoin',
  Signet = 'signet',
}

export enum EntropyLength {
  Length16 = 16,
  Length24 = 24,
  Length32 = 32,
}

export enum BlockChainNames {
  Electrum = 'Electrum',
  Esplora = 'Esplora',
  Rpc = 'Rpc',
}

export enum AddressIndex {
  New = 'new',
  LastUnused = 'lastUnused',
}

export enum KeychainKind {
  External = 'external',
  Internal = 'internal',
}

export interface BlockchainElectrumConfig {
  url: string;
  sock5: string | null;
  retry: number;
  timeout: number;
  stopGap: number;
  validateDomain: boolean;
}
export interface BlockchainEsploraConfig {
  baseUrl: string;
  proxy: string | null;
  concurrency: number;
  stopGap: number;
  timeout: number;
}

export interface UserPass {
  username: string;
  password: string;
}
export interface RpcSyncParams {
  startScriptCount: number;
  startTime: number;
  forceStartTime: boolean;
  pollRateSec: number;
}

export interface BlockchainRpcConfig {
  url: string;
  authCookie?: string;
  authUserPass?: UserPass;
  network: Network;
  walletName: string;
  syncParams?: RpcSyncParams;
}
