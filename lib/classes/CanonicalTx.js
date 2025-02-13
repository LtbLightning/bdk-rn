import { NativeModules } from 'react-native';
import { Transaction } from './Transaction'; // assuming Transaction and ChainPosition are defined in these modules
import { ChainPosition } from './ChainPosition';
const { CanonicalTxModule } = NativeModules;
/**
 * CanonicalTx class to manage transaction and chain position
 */
export class CanonicalTx {
    constructor(transaction, chainPosition) {
        this.transaction = transaction;
        this.chainPosition = chainPosition;
    }
    /**
     * Creates a CanonicalTx instance by calling the native method.
     * @param transactionId - The ID of the transaction.
     * @param chainPositionId - The ID of the chain position.
     * @returns Promise<string> - Resolves to the CanonicalTx ID.
     */
    static async createCanonicalTx(transactionId, chainPositionId) {
        try {
            const canonicalTxId = await CanonicalTxModule.createCanonicalTx(transactionId, chainPositionId);
            return canonicalTxId;
        }
        catch (error) {
            throw new Error(`Failed to create CanonicalTx: ${error.message}`);
        }
    }
    /**
     * Retrieves a CanonicalTx instance by ID.
     * @param id - The CanonicalTx ID.
     * @returns Promise<CanonicalTx> - Resolves to a CanonicalTx object.
     */
    static async getCanonicalTxById(id) {
        try {
            const result = await CanonicalTxModule.getCanonicalTxById(id);
            const { transaction, chainPosition } = result;
            // Create Transaction and ChainPosition instances from the returned result
            const transactionObj = new Transaction();
            transactionObj.id = transaction.id;
            const chainPositionObj = new ChainPosition();
            chainPositionObj.id = chainPosition.id;
            return new CanonicalTx(transactionObj, chainPositionObj);
        }
        catch (error) {
            throw new Error(`Failed to retrieve CanonicalTx by ID: ${error.message}`);
        }
    }
}
//# sourceMappingURL=CanonicalTx.js.map