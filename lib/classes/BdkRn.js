// import { err, ok, Result } from '@synonymdev/result';
// import {
//   BroadcastTransactionRequest,
//   ConfirmedTransaction,
//   CreateDescriptorRequest,
//   CreateExtendedKeyRequest,
//   CreateExtendedKeyResponse,
//   createWalletRequest,
//   createWalletResponse,
//   GenerateMnemonicRequest,
//   PendingTransaction,
//   TransactionsResponse,
// } from '../lib/interfaces';
// import { _exists } from '../lib/utils';
// import { NativeLoader } from './NativeLoader';
// class BdkRnInterface extends NativeLoader {
//   constructor() {
//     super();
//   }
//   /**
//    * Generate mnemonic seed phrase of specified entropy and length
//    * @return {Promise<Result<string>>}
//    */
//   async generateMnemonic(args: GenerateMnemonicRequest = { length: 12 }): Promise<Result<string>> {
//     try {
//       const entropyToLength = {
//         '128': 12,
//         '160': 15,
//         '192': 18,
//         '224': 21,
//         '256': 24,
//       };
//       let wordCount;
//       if (args.entropy && args.length) {
//         wordCount = entropyToLength[args.entropy];
//       } else if (!args.entropy && !args.length) {
//         wordCount = 12;
//       } else {
//         wordCount = args.length;
//       }
//       const seed: string = await this._bdk.generateMnemonic(wordCount);
//       return ok(seed);
//     } catch (e: any) {
//       return err(e);
//     }
//   }
//   /**
//    * Generate extended key from network, seed and password
//    * @return {Promise<Result<string>>}
//    */
//   async createExtendedKey(args: CreateExtendedKeyRequest): Promise<Result<string>> {
//     try {
//       const { network, mnemonic, password } = args;
//       const keyInfo: string = await this._bdk.getExtendedKeyInfo(network, mnemonic, password);
//       return ok(keyInfo);
//     } catch (e: any) {
//       return err(e);
//     }
//   }
//   /**
//    * Create xprv from network, seed and password
//    * @return {Promise<Result<string>>}
//    */
//   async createXprv(args: CreateExtendedKeyRequest): Promise<Result<string>> {
//     try {
//       const { network, mnemonic, password } = args;
//       const keyInfo: CreateExtendedKeyResponse = await this._bdk.getExtendedKeyInfo(network, mnemonic, password);
//       return ok(keyInfo.xprv);
//     } catch (e: any) {
//       return err(e);
//     }
//   }
//   /**
//    * Create descriptor based on different parameters
//    * @return {Promise<Result<string>>}
//    */
//   async createDescriptor(args: CreateDescriptorRequest): Promise<Result<string>> {
//     try {
//       const { type, mnemonic, password, network, publicKeys, threshold } = args;
//       let xprv = args.xprv;
//       let path = args.path;
//       if (!_exists(xprv) && !_exists(mnemonic)) throw 'Required param mnemonic or xprv is missing.';
//       if (_exists(xprv) && _exists(mnemonic)) throw 'Only one parameter is required either mnemonic or xprv.';
//       const useMnemonic = !_exists(xprv);
//       if (useMnemonic) {
//         if (!_exists(mnemonic) || !_exists(network))
//           throw 'One or more required parameters are empty(Mnemonic, Network).';
//         const createXprvRes = await this.createXprv({ network, mnemonic, password });
//         if (createXprvRes.isOk()) xprv = createXprvRes.value;
//       }
//       if (!useMnemonic && !_exists(xprv)) throw 'XPRV is required';
//       if (!_exists(path)) path = "/84'/1'/0'/0/*";
//       let descriptor = '';
//       if (type !== 'MULTI') {
//         let descriptorArgs = `${xprv}${path}`;
//         switch (type) {
//           case 'default':
//           case null:
//           case undefined:
//           case '':
//           case 'p2wpkh':
//           case 'wpkh':
//             descriptor = `wpkh(${descriptorArgs})`;
//             break;
//           case 'p2pkh':
//           case 'pkh':
//             descriptor = `pkh(${descriptorArgs})`;
//             break;
//           case 'shp2wpkh':
//           case 'p2shp2wpkh':
//             descriptor = `sh(wpkh(${descriptorArgs}))`;
//             break;
//         }
//       } else {
//         if (!threshold || !publicKeys || (publicKeys && publicKeys?.length === 0))
//           throw 'Threshold or publicKeys values are invalid.';
//         if (threshold === 0 || threshold > publicKeys?.length + 1) throw 'Threshold value is invalid.';
//         descriptor = `sh(multi(${threshold}${xprv},${publicKeys?.join(',')}${path}))`;
//       }
//       return ok(descriptor);
//     } catch (e: any) {
//       return err(e);
//     }
//   }
//   /**
//    * Init wallet
//    * @return {Promise<Result<createWalletResponse>>}
//    */
//   async createWallet(args: createWalletRequest): Promise<Result<createWalletResponse>> {
//     try {
//       const {
//         mnemonic,
//         descriptor,
//         password,
//         network,
//         blockChainConfigUrl,
//         blockChainSocket5,
//         retry,
//         timeOut,
//         blockChainName,
//       } = args;
//       if (!_exists(descriptor) && !_exists(mnemonic)) throw 'Required param mnemonic or descriptor is missing.';
//       if (_exists(descriptor) && _exists(mnemonic))
//         throw 'Only one parameter is required either mnemonic or descriptor.';
//       const useDescriptor = _exists(descriptor);
//       if (useDescriptor && descriptor?.includes(' ')) throw 'Descriptor is not valid.';
//       if (!useDescriptor && (!_exists(mnemonic) || !_exists(network)))
//         throw 'One or more required parameters are empty(Mnemonic, Network).';
//       const wallet: createWalletResponse = await this._bdk.createWallet(
//         mnemonic ?? '',
//         password ?? '',
//         network ?? '',
//         blockChainConfigUrl ?? '',
//         blockChainSocket5 ?? '',
//         retry ?? '',
//         timeOut ?? '',
//         blockChainName ?? '',
//         descriptor ?? ''
//       );
//       return ok(wallet);
//     } catch (e: any) {
//       return err(e);
//     }
//   }
//   /**
//    * Sync wallet
//    * @return {Promise<Result<string>>}
//    */
//   async syncWallet(): Promise<Result<string>> {
//     try {
//       const response: string = await this._bdk.syncWallet();
//       return ok(response);
//     } catch (e: any) {
//       return err(e);
//     }
//   }
//   /**
//    * Get new address
//    * @return {Promise<Result<string>>}
//    */
//   async getNewAddress(): Promise<Result<string>> {
//     try {
//       const address: string = await this._bdk.getNewAddress();
//       return ok(address);
//     } catch (e: any) {
//       return err(e);
//     }
//   }
//   /**
//    * Get wallet balance
//    * @return {Promise<Result<string>>}
//    */
//   async getBalance(): Promise<Result<string>> {
//     try {
//       const balance: string = await this._bdk.getBalance();
//       return ok(balance);
//     } catch (e: any) {
//       return err(e);
//     }
//   }
//   /**
//    * Broadcast Transaction
//    * @return {Promise<Result<string>>}
//    */
//   async broadcastTx(args: BroadcastTransactionRequest): Promise<Result<string>> {
//     try {
//       const { address, amount } = args;
//       if (!_exists(address) || !_exists(amount)) throw 'Required address or amount parameters are missing.';
//       if (isNaN(amount)) throw 'Entered amount is invalid';
//       const tx = await this._bdk.broadcastTx(address, amount);
//       return ok(tx);
//     } catch (e: any) {
//       return err(e);
//     }
//   }
//   /**
//    * Get pending transactions
//    * @return {Promise<Result<Array<PendingTransaction>>>}
//    */
//   async getPendingTransactions(): Promise<Result<Array<PendingTransaction>>> {
//     try {
//       const response: Array<PendingTransaction> = await this._bdk.getPendingTransactions();
//       return ok(response);
//     } catch (e: any) {
//       return err(e);
//     }
//   }
//   /**
//    * Get pending transactions
//    * @return {Promise<Result<Array<ConfirmedTransaction>>>}
//    */
//   async getConfirmedTransactions(): Promise<Result<Array<ConfirmedTransaction>>> {
//     try {
//       const response: Array<ConfirmedTransaction> = await this._bdk.getConfirmedTransactions();
//       return ok(response);
//     } catch (e: any) {
//       return err(e);
//     }
//   }
//   /**
//    * Get all transactions
//    * @return {Promise<Result<TransactionsResponse>>}
//    */
//   async getTransactions(): Promise<Result<TransactionsResponse>> {
//     try {
//       const confirmed: Array<ConfirmedTransaction> = await this._bdk.getConfirmedTransactions();
//       const pending: Array<PendingTransaction> = await this._bdk.getPendingTransactions();
//       const response: TransactionsResponse = { confirmed, pending };
//       return ok(response);
//     } catch (e: any) {
//       return err(e);
//     }
//   }
// }
// export const BdkRn = new BdkRnInterface();
export const BdkRn = Object;
//# sourceMappingURL=BdkRn.js.map