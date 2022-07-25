export interface Response {
    error: boolean;
    data: any;
}
export interface GenerateMnemonicRequest {
    entropy?: 128 | 160 | 192 | 224 | 256;
    length?: 12 | 15 | 18 | 21 | 24;
  }
export interface GenSeedRequest {
    password?: string;
}
export interface CreateXprvRequest {
    mnemonic: string;
    password?: string;
}
export declare type WPKH = 'default' | null | '' | 'p2wpkh' | 'wpkh';
export declare type P2PKH = 'p2pkh' | 'pkh';
export declare type SHP2WPKH = 'shp2wpkh' | 'p2shp2wpkh';
export interface CreateDescriptorRequest {
    type: WPKH | P2PKH | SHP2WPKH | 'multi';
    /**
     * Set useMnemonic: true, if want to create desciptor using mnemonic* and password*.
     * Set useMnemonic: false, if want to create descriptor using xprv*
     */
    useMnemonic: boolean;
    /**
     * Required if useMnemonic: false
     */
    xprv?: string;
    /**
     * Required if useMnemonic: true
     */
    mnemonic?: string;
    /**
     * Required if useMnemonic: true
     */
    password?: string;
    /**
     * If want to use custom path instead of default(/84'/1'/0'/0/*)
     */
    path?: string;
    /**
     * required if type is multi
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
    useDescriptor?: boolean;
    password?: string;
    network?: string;
    blockChainConfigUrl?: string;
    blockChainSocket5?: string;
    retry?: string;
    timeOut?: string;
    blockChainName?: string;
}
export interface createWalletResponse {
    address: string;
    mnemonic: string;
    balance: string;
}
export interface BroadcastTransactionRequest {
    address: string;
    amount: number;
}
