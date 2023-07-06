import { BlockTime, PubkeyHash, Script, ScriptHash, TransactionDetails, TxOut, WitnessProgram, } from '../classes/Bindings';
import { Network } from './enums';
/** Create TransactionDetails object */
export const createTxDetailsObject = (item) => {
    var _a, _b;
    return new TransactionDetails(item.txid, item.received, item.sent, item === null || item === void 0 ? void 0 : item.fee, new BlockTime((_a = item.confirmationTime) === null || _a === void 0 ? void 0 : _a.height, (_b = item.confirmationTime) === null || _b === void 0 ? void 0 : _b.timestamp));
};
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
export const createTxOut = (txout) => new TxOut(txout.value, new Script(txout.script));
//# sourceMappingURL=utils.js.map