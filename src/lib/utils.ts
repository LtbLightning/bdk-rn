import { BlockTime, TransactionDetails } from '../classes/Bindings';
import is from 'is_js';

/** Check if value is exists and not empty */
export const _exists = (value: any) => is.existy(value) && is.not.empty(value);

type ConfirmationTime = {
  height?: number,
  timestamp?: number
}
type Props = {
  txid: string,
  received: number,
  sent: number,
  fee?: number
  confirmationTime: ConfirmationTime
}

/** Create TransactionDetails object */
export const createTxDetailsObject = (item: Props): TransactionDetails => {
  return new TransactionDetails(
    item.txid,
    item.received,
    item.sent,
    item?.fee,
    new BlockTime(item.confirmationTime?.height, item.confirmationTime?.timestamp)
  );
};
