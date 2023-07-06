import { BlockTime, PubkeyHash, ScriptHash, TransactionDetails, TxOut, WitnessProgram } from '../classes/Bindings';
import { Network, payload } from './enums';
declare type Props = {
    txid: string;
    received: number;
    sent: number;
    fee?: number;
    confirmationTime?: BlockTime;
};
/** Create TransactionDetails object */
export declare const createTxDetailsObject: (item: Props) => TransactionDetails;
export declare const getNetwork: (networkName: string) => Network;
export declare const getPayload: (payload: payload) => PubkeyHash | ScriptHash | WitnessProgram;
export declare const createTxOut: (txout: {
    value: number;
    script: string;
}) => TxOut;
export {};
