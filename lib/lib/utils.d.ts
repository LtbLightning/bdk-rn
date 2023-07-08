import { BlockTime, OutPoint, PubkeyHash, ScriptHash, TransactionDetails, TxIn, TxOut, WitnessProgram } from '../classes/Bindings';
import { KeychainKind, Network, payload } from './enums';
declare type Props = {
    txid: string;
    received: number;
    sent: number;
    fee?: number;
    confirmationTime?: BlockTime;
    transaction?: any;
};
/** Create TransactionDetails object */
export declare const createTxDetailsObject: (item: Props) => TransactionDetails;
/** Get Network Enum */
export declare const getNetwork: (networkName: string) => Network;
/** Get Payload Enum */
export declare const getPayload: (payload: payload) => PubkeyHash | ScriptHash | WitnessProgram;
/** Create TxIn object */
export declare const createTxIn: (txin: any) => TxIn;
/** Create TxOut object */
export declare const createTxOut: (txout: any) => TxOut;
/** Create Outpoint object */
export declare const createOutpoint: (outpoint: any) => OutPoint;
/** Get KeychainKind Enum */
export declare const getKeychainKind: (networkName: string) => KeychainKind;
export {};
