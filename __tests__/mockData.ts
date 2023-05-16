import { BlockTime, Script, TransactionDetails, TxBuilderResult } from '../src/classes/Bindings';
import {
  Address,
  Blockchain,
  BumpFeeTxBuilder,
  DerivationPath,
  DescriptorPublicKey,
  DescriptorSecretKey,
  PartiallySignedTransaction,
  TxBuilder,
  Wallet,
} from '../src/index';

export const mockBlockchain = new Blockchain();
export const mockWallet = new Wallet();
export const mockDescriptorSecret = new DescriptorSecretKey();
export const mockDescriptorPublic = new DescriptorPublicKey();
export const mockDerivationPath = new DerivationPath();
export const mockAddress = new Address();
export const mockScript = new Script('mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB');
export const mockTxBuilder = new TxBuilder();
export const mockBumpFeeTxBuilder = new BumpFeeTxBuilder();

export const mockTransactionDetails = new TransactionDetails(
  'c9bb2ad8612a4774c903b1d9be86ecddb374e8fd43262802542d4c903bd9002e',
  7625,
  8564,
  141,
  new BlockTime(2410324, 1670479190)
);
export const psbtString =
  'cHNidP8BAJoBAAAAAivIGwj79VJdDEMC6DTEBFWNRXh8i63O5Bj2ul/ckLSiAAAAAAD+////q/fYDAwa/ovXiOHXMMJWBzSSppAfXu8xVBWr97kc60kAAAAAAP7///8CCwUAAAAAAAAWABTiG3occFHBPEfIFYEno1q+KemyBNwFAAAAAAAAFgAUJeosBE8pPYv+vWAJxdrAq2HPlb50ByUAAAEA3gEAAAAAAQG1SXpVEroudlm2vsvLISuSLWqp3SMiU8bE/zFmMfSlrAEAAAAA/v///wLcBQAAAAAAABYAFCXqLARPKT2L/r1gCcXawKthz5W+kRAAAAAAAAAWABRIuasG/iTpawzZOHBRQUPdiAgtjwJHMEQCICkgZhWePD/RuE7V87/VcxX6PIv9LPg8+K6O42bX49usAiBe+ohVk1/abwUqmeqYuSM8x/e6sDrnZB1rD6GFdfm9iQEhApqPApANDfpFbG9N/WKaIz7W/c4Mf/7J8Zw2Usaj0G/InfEkAAEBH9wFAAAAAAAAFgAUJeosBE8pPYv+vWAJxdrAq2HPlb4iBgKn69zak6elBqiAOr/Z//pXXXHCW9JlHB6Nh9ccRCENABgJwK/eVAAAgAEAAIAAAACAAAAAAAcAAAAAAQD9cgEBAAAAAAECovbyC3Cz7gh5c5NeEl+NmyrVHkJ1d2rhU7Uh+DmS7NkBAAAAAP7///+SPhXvmO5lpEkSYDX3pXJX4UQxOwl3kr/j1zniiE3ZngEAAAAA/v///wLcBQAAAAAAABYAFCXqLARPKT2L/r1gCcXawKthz5W+sBoAAAAAAAAWABRAhHNCgth+tfSl0MjNpNs3O47FEgJHMEQCIHl0XcCSCH7JKLwvO32VdRO0J9W0V/IL3RaQ0Vp4ac3WAiBW5cHlrtP+mxBDJ+wMj8DCjptEnO9zxDw9heSw6CL7GwEhAqfr3NqTp6UGqIA6v9n/+lddccJb0mUcHo2H1xxEIQ0AAkcwRAIgUzTkO+PIbFWFVbZRl6ygi7yt/hCYEmVijPrJFr1E458CIAbTRLNvI8lsnDhcoze8mHZTkrAhfQQxexiy4AVxPYvJASEDNiD45tgRtvrlY6QCHTSPq/yyeARojSMzPVWTgO7tHite+SQAAQEf3AUAAAAAAAAWABQl6iwETyk9i/69YAnF2sCrYc+VviIGAqfr3NqTp6UGqIA6v9n/+lddccJb0mUcHo2H1xxEIQ0AGAnAr95UAACAAQAAgAAAAIAAAAAABwAAAAAiAgI2ReskgqkBRuwxJXtQ26XViRJaolnh8310DqkZHcZkzRgJwK/eVAAAgAEAAIAAAACAAAAAAAkAAAAAIgICp+vc2pOnpQaogDq/2f/6V11xwlvSZRwejYfXHEQhDQAYCcCv3lQAAIABAACAAAAAgAAAAAAHAAAAAA==';

export const mockPsbt = new PartiallySignedTransaction(psbtString);
export const mockTxBuilderResult = new TxBuilderResult(mockPsbt, mockTransactionDetails);
