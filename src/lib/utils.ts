import { BlockTime, TransactionDetails } from '../classes/Bindings';
import is from 'is_js';

/** Check if value is exists and not empty */
export const _exists = (value: any) => is.existy(value) && is.not.empty(value);

/** Create TransactionDetails object */
export const createTxDetailsObject = (item: any): TransactionDetails => {
  return new TransactionDetails(
    item.txid,
    item.received,
    item.sent,
    item?.fee,
    new BlockTime(item.confirmationTime?.height, item.confirmationTime?.timestamp)
  );
};
