export declare enum WordCount {
    WORDS12 = 12,
    WORDS15 = 15,
    WORDS18 = 18,
    WORDS21 = 21,
    WORDS24 = 24
}
export declare enum Network {
    Testnet = "testnet",
    Regtest = "regtest",
    Bitcoin = "bitcoin",
    Signet = "signet"
}
export declare enum EntropyLength {
    Length16 = 16,
    Length24 = 24,
    Length32 = 32
}
export declare enum BlockChainNames {
    Electrum = "Electrum",
    Esplora = "Esplora",
    Rpc = "Rpc"
}
export declare enum AddressIndex {
    New = "new",
    LastUnused = "lastUnused"
}
export declare enum KeychainKind {
    External = "external",
    Internal = "internal"
}
export interface BlockchainElectrumConfig {
    url: string;
    retry: string;
    timeout: string;
    stopGap: string;
}
export interface BlockchainEsploraConfig {
    url: string;
    proxy: string;
    concurrency: string;
    timeout: string;
    stopGap: string;
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
