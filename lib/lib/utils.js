import { Transaction } from '../classes/Transaction';
import { BlockTime, OutPoint, PubkeyHash, Script, ScriptHash, TransactionDetails, TxIn, TxOut, WitnessProgram, } from '../classes/Bindings';
import { KeychainKind, Network } from './enums';
/** Create TransactionDetails object */
export const createTxDetailsObject = (item) => {
    var _a, _b;
    return new TransactionDetails(item.txid, item.received, item.sent, item === null || item === void 0 ? void 0 : item.fee, new BlockTime((_a = item.confirmationTime) === null || _a === void 0 ? void 0 : _a.height, (_b = item.confirmationTime) === null || _b === void 0 ? void 0 : _b.timestamp), item.transaction == false ? null : new Transaction()._setTransaction(item.transaction));
};
/** Get Network Enum */
export const getNetwork = (networkName) => {
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
export const getPayload = (payload) => {
    let returnObj;
    switch (payload.type) {
        case 'scriptHash':
            returnObj = new ScriptHash(payload.value);
            break;
        case 'witnessProgram':
            returnObj = new WitnessProgram(payload.value, payload.version);
            break;
        default:
            returnObj = new PubkeyHash(payload.value);
    }
    return returnObj;
};
/** Create TxIn object */
export const createTxIn = (txin) => new TxIn(createOutpoint(txin.previousOutput), new Script(txin.scriptSig), txin.sequence, txin.witness);
/** Create TxOut object */
export const createTxOut = (txout) => new TxOut(txout.value, new Script(txout.script));
/** Create Outpoint object */
export const createOutpoint = (outpoint) => new OutPoint(outpoint.txid, outpoint.vout);
/** Get KeychainKind Enum */
export const getKeychainKind = (networkName) => {
    let keychainEnum = KeychainKind.External;
    switch (networkName) {
        case 'internal':
            keychainEnum = KeychainKind.Internal;
            break;
    }
    return keychainEnum;
};
//# sourceMappingURL=utils.js.map