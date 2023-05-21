import { BlockTime, Script, TransactionDetails } from '../src/classes/Bindings';
import { DescriptorSecretKey, Wallet } from '../src/index';

export const seedPhrase = 'mom mom mom mom mom mom mom mom mom mom mom mom';
export const descriptorString = 'descriptorString';
export const changeDescriptorString = 'changeDescriptorString';

export const mockWallet = new Wallet();
export const mockScript = new Script('mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB');

export const mockDescriptorSecret = new DescriptorSecretKey();

export const mockTransactionDetails = new TransactionDetails(
  'c9bb2ad8612a4774c903b1d9be86ecddb374e8fd43262802542d4c903bd9002e',
  7625,
  8564,
  141,
  new BlockTime(2410324, 1670479190)
);
