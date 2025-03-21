import {
  BlockTime,
  OutPoint,
  PubkeyHash,
  ScriptHash,
  TransactionDetails,
  TxIn,
  TxOut,
  WitnessProgram,
} from '../classes/Bindings';
import { KeychainKind, Network, Payload } from './enums';

import { Script } from '../classes/Script';
import { Transaction } from '../classes/Transaction';

type Props = {
  txid: string;
  received: number;
  sent: number;
  fee?: number;
  confirmationTime?: BlockTime;
  transaction?: any;
};

/** Create TransactionDetails object */
export const createTxDetailsObject = (item: Props): TransactionDetails => {
  return new TransactionDetails(
    item.txid,
    item.received,
    item.sent,
    item?.fee,
    new BlockTime(item.confirmationTime?.height, item.confirmationTime?.timestamp),
    !item.transaction ? null : new Transaction()._setTransaction(item.transaction)
  );
};

/** Get Network Enum */
export const getNetwork = (networkName: string): Network => {
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

/** Get Payload Enum */
export const getPayload = (payload: Payload): PubkeyHash | ScriptHash | WitnessProgram => {
  let returnObj;
  switch (payload.type) {
    case 'scriptHash':
      returnObj = new ScriptHash(payload.value as string);
      break;
    case 'witnessProgram':
      returnObj = new WitnessProgram(payload.value as Array<number>, payload.version!);
      break;
    default:
      returnObj = new PubkeyHash(payload.value as string);
  }
  return returnObj;
};

/** Create TxIn object */
export const createTxIn = (txin: any): TxIn =>
  new TxIn(createOutpoint(txin.previousOutput), new Script(txin.scriptSig), txin.sequence, txin.witness);

/** Create TxOut object */
export const createTxOut = (txout: any): TxOut => new TxOut(txout.value, new Script(txout.script));

/** Create Outpoint object */
export const createOutpoint = (outpoint: any): OutPoint => new OutPoint(outpoint.txid, outpoint.vout);

/** Get KeychainKind Enum */
export const getKeychainKind = (networkName: string): KeychainKind => {
  let keychainEnum = KeychainKind.External;
  switch (networkName) {
    case 'internal':
      keychainEnum = KeychainKind.Internal;
      break;
  }
  return keychainEnum;
};
