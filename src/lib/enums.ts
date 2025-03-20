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

export enum AddressError {
  Base58 = 'Base58',
  Bech32 = 'Bech32',
  WitnessVersion = 'WitnessVersion',
  WitnessProgram = 'WitnessProgram',
  UncompressedPubkey = 'UncompressedPubkey',
  ExcessiveScriptSize = 'ExcessiveScriptSize',
  UnrecognizedScript = 'UnrecognizedScript',
  NetworkValidation = 'NetworkValidation',
  OtherAddressErr = 'OtherAddressErr'
}

export enum ChainPosition {
  Confirmed = 'Confirmed',
  Unconfirmed = 'Unconfirmed'
}

export enum CreateTxError {
  Descriptor = 'Descriptor',
  Persist = 'Persist',
  Policy = 'Policy',
  SpendingPolicyRequired = 'SpendingPolicyRequired',
  Version0 = 'Version0',
  Version1Csv = 'Version1Csv',
  LockTime = 'LockTime',
  RbfSequence = 'RbfSequence',
  RbfSequenceCsv = 'RbfSequenceCsv',
  FeeTooLow = 'FeeTooLow',
  FeeRateTooLow = 'FeeRateTooLow',
  NoUtxosSelected = 'NoUtxosSelected',
  OutputBelowDustLimit = 'OutputBelowDustLimit',
  ChangePolicyDescriptor = 'ChangePolicyDescriptor',
  CoinSelection = 'CoinSelection',
  InsufficientFunds = 'InsufficientFunds',
  NoRecipients = 'NoRecipients',
  Psbt = 'Psbt',
  MissingKeyOrigin = 'MissingKeyOrigin',
  UnknownUtxo = 'UnknownUtxo',
  MissingNonWitnessUtxo = 'MissingNonWitnessUtxo',
  MiniscriptPsbt = 'MiniscriptPsbt'
}

export enum ElectrumError {
  IoError = 'IoError',
  Json = 'Json',
  Hex = 'Hex',
  Protocol = 'Protocol',
  Bitcoin = 'Bitcoin',
  AlreadySubscribed = 'AlreadySubscribed',
  NotSubscribed = 'NotSubscribed',
  InvalidResponse = 'InvalidResponse',
  Message = 'Message',
  InvalidDnsNameError = 'InvalidDnsNameError',
  MissingDomain = 'MissingDomain',
  AllAttemptsErrored = 'AllAttemptsErrored',
  SharedIoError = 'SharedIoError',
  CouldntLockReader = 'CouldntLockReader',
  Mpsc = 'Mpsc',
  CouldNotCreateConnection = 'CouldNotCreateConnection',
  RequestAlreadyConsumed = 'RequestAlreadyConsumed'
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

export interface Payload {
  type: string;
  value: Array<number> | string;
  version?: string;
}
