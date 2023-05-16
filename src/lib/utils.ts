import { BlockTime, TransactionDetails } from '../classes/Bindings';

type ConfirmationTime = {
  height?: number,
  timestamp?: number
}
type Props = {
  txid: string,
  received: number,
  sent: number,
  fee?: number
  confirmationTime?: ConfirmationTime
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
