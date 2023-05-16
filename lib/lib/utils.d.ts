import { BlockTime, TransactionDetails } from '../classes/Bindings';
type Props = {
    txid: string;
    received: number;
    sent: number;
    fee?: number;
    confirmationTime?: BlockTime;
};
/** Create TransactionDetails object */
export declare const createTxDetailsObject: (item: Props) => TransactionDetails;
export {};
