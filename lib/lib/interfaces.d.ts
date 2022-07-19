export interface Response {
    error: boolean;
    data: any;
}
export interface GenSeedRequest {
    password?: string;
}
export interface CreateDescriptorRequest {
    mnemonic: string;
    password?: string;
}
export interface InitWalletRequest {
    mnemonic?: string;
    descriptor?: string;
    useDescriptor?: boolean;
    password?: string;
    network?: string;
    blockChainConfigUrl?: string;
    blockChainSocket5?: string;
    retry?: string;
    timeOut?: string;
    blockChainName?: string;
}
export interface InitWalletResponse {
    address: string;
    mnemonic: string;
    balance: string;
}
export interface BroadcastTransactionRequest {
    address: string;
    amount: number;
}
