import {
  BlockTime,
  PubkeyHash,
  Script,
  ScriptHash,
  TransactionDetails,
  TxOut,
  WitnessProgram,
} from '../classes/Bindings';
import { Network, payload } from './enums';

type Props = {
  txid: string;
  received: number;
  sent: number;
  fee?: number;
  confirmationTime?: BlockTime;
};

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

export const getNetwork = (networkName: string) => {
  let networkEnum = Network.Testnet;
  switch (networkName) {
    case 'testnet':
      networkEnum = Network.Testnet;
      break;
    case 'regtest':
      networkEnum = Network.Regtest;
      break;
    case 'bitcoin':
      networkEnum = Network.Bitcoin;
      break;
    case 'signet':
      networkEnum = Network.Signet;
      break;
  }
  return networkEnum;
};

export const getPayload = (payload: payload): PubkeyHash | ScriptHash | WitnessProgram => {
  let returnObj;
  switch (payload.type) {
    case 'scriptHash':
      returnObj = new ScriptHash(payload.value);
      break;
    case 'witnessProgram':
      returnObj = new WitnessProgram(payload.value, payload.version!);
      break;
    default:
      returnObj = new PubkeyHash(payload.value);
  }
  return returnObj;
};

export const createTxOut = (txout: { value: number; script: string }) =>
  new TxOut(txout.value, new Script(txout.script));
