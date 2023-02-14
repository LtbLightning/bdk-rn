import { BlockTime, TransactionDetails } from '../classes/Bindings';
import is from 'is_js';
/** Check if value is exists and not empty */
export const _exists = (value) => is.existy(value) && is.not.empty(value);
/** Create TransactionDetails object */
export const createTxDetailsObject = (item) => {
    var _a, _b;
    return new TransactionDetails(item.txid, item.received, item.sent, item === null || item === void 0 ? void 0 : item.fee, new BlockTime((_a = item.confirmationTime) === null || _a === void 0 ? void 0 : _a.height, (_b = item.confirmationTime) === null || _b === void 0 ? void 0 : _b.timestamp));
};
//# sourceMappingURL=utils.js.map