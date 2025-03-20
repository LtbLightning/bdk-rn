## [1.0.0-alpha.11]

#### APIs Added

- Added `Amount` type for precise Bitcoin amount handling
- Introduced `TxIn` type for transaction input management
- Enhanced `Transaction` class with new methods:
  - `input()`
  - `output()`
  - `lock_time()`
- Implemented Electrum client for improved blockchain interaction
- Added memory wallet support for temporary wallet management
- Simplified full_scan and sync workflows for more efficient wallet syncing
- Introduced RPC blockchain support

#### Other Changes:

- Simplified full_scan and sync workflows for syncing wallets

## [0.31.0]

#### APIs Changed:

- `BumpFeeTxBuilder.allowShrinking()` now takes a `Script` as its argument.
- The `Address` constructor now takes a `Network` argument.
- The `Payload::PubkeyHash` and `Payload::ScriptHash` now have string arguments instead of byte arrays.

#### APIs Added:

- The `Address` type now has the `isValidForNetwork()` method.

## [0.30.0]

#### APIs added

- Added `BIP-86` descriptor templates

## [0.29.0]

#### APIs added

- Expose `Address` class's `fromScript`, `payload`, `network`, `toQrUri` and `asString` methods
- Added `keychain` to LocalUtxo
- Added `jsonSerialize` method to `PartiallySignedTransaction`, to get the JSON serialized value of all PSBT fields.
- Expose `Transaction` class's `txid`, `weight`, `size`, `vsize`, `isCoinBase`, `isExplicitlyRbf`, `version`, `isLockTimeEnabled`, `lockTime`, `input` and `output` methods.
- Expose `Script.toBytes()` method.
- `Wallet` changes:
  - Added `includeRaw` to listTransactions() param. Returns `Transation` if passed `true` else `null`.
  - Added `signOptions` to sign()
  - Changed getAddress() to return `KeychainKind` for `keychain` and `Address` for `address`
  - Expose `getInternalAddress` and `isMine` methods

## [0.1.0]

#### APIs exposed

- `Address`
  - create(address: string) - Constructor
  - scriptPubKey()
- `Blockchain`
  - create(config: BlockchainElectrumConfig | BlockchainEsploraConfig | BlockchainRpcConfig, blockchainName?: BlockChainNames) - Constructor
  - getHeight() - Get current height of the blockchain.
  - getBlockHash(height?: number) - Get block hash by block height.
  - broadcast(tx: Transaction) - Broadcast transaction.
  - estimateFee(target: number) - Estimate the fee rate required to confirm a transaction in a given target of blocks.
- `BumpFeeTxBuilder`
  - create(txid: string, newFeeRate: number) - Constructor.
  - allowShrinking(address: string) - Explicitly tells the wallet to reduce the amount of the output matching this `address` in order to bump the fee.
  - enableRbfWithSequence(nSequence: number) - Enable signaling RBF with a specific nSequence value.
  - enableRbf() - Enable signaling RBF.
  - finish(wallet: Wallet) - Finish building the transaction.
- `DerivationPath`
  - create(path: string) - Constructor.
- `Descriptor`
  - create(descriptor: string, network: Network) - Constructor.
  - asString() - Return the public version of the output descriptor.
  - asStringPrivate() - Return the private version of the output descriptor if available, otherwise return the public version.
  - newBip44(secretKey: DescriptorSecretKey, keychain: KeychainKind, network: Network) - BIP44 template. Expands to pkh(key/44'/{0,1}'/0'/{0,1}/\*).
  - newBip44Public(publicKey: DescriptorPublicKey, fingerprint: string, keychain: KeychainKind, network: Network) - BIP44 public template. Expands to
    pkh(key/{0,1}/\*).
  - newBip49(secretKey: DescriptorSecretKey, keychain: KeychainKind, network: Network) - BIP49 template. Expands to sh(wpkh(key/49'/{0,1}'/0'/{0,1}/\*)).
  - newBip49Public(publicKey: DescriptorPublicKey, fingerprint: string, keychain: KeychainKind, network: Network) - BIP49 public template. Expands to
    sh(wpkh(key/{0,1}/\*)).
  - newBip84(secretKey: DescriptorSecretKey, keychain: KeychainKind, network: Network) - BIP84 template. Expands to wpkh(key/84'/{0,1}'/0'/{0,1}/\*).
  - newBip84Public(publicKey: DescriptorPublicKey, fingerprint: string, keychain: KeychainKind, network: Network) - BIP84 public template. Expands to
    wpkh(key/{0,1}/\*).
- `DescriptorPublicKey`
  - create(publicKeyId: string) - Constructor.
  - fromString(publicKey: string) - Create descriptorPublic from public key string.
  - derive(derivationPath: DerivationPath) - Derive descriptorPublic from derivation path.
  - extend(derivationPath: DerivationPath) - Extend descriptorPublic from derivation path.
  - asString() - Get public key as string.
- `DescriptorSecretKey`
  - create(network: Network, mnemonic: Mnemonic, password?: string) - Constructor.
  - derive(derivationPath: DerivationPath) - Derive xprv from derivation path.
  - extend(derivationPath: DerivationPath) - Extend xprv from derivation path.
  - asPublic() - Create publicSecretKey from xprv.
  - secretBytes() - Create secret bytes of xprv.
  - asString() - Get secret key as string.
- `Mnemonic`
  - create(wordCount?: WordCount) - Constructor.
  - fromString(mnemonic: string) - Parse a `Mnemonic` with given string
  - fromEntropy(entropy: Array<number>) - Generates `Mnemonic` with given `entropy`
  - asString() - Get `Mnemonic` as string
- `PartiallySignedTransaction`
  - constructor(base64: string) - Default constructor.
  - combine(other: PartiallySignedTransaction) - Combines this `PartiallySignedTransaction` with other PSBT as described by BIP 174.
  - extractTx() - Return the transaction as bytes.
  - serialize() - Return transaction as string.
  - txid() - Return txid as string.
  - feeAmount() - Return feeAmount.
  - feeRate() - Return feeRate.
- `Transaction`
  - create(bytes: Array<number>) - Constructor.
  - serialize() - Return the transaction bytes, bitcoin consensus encoded.
- `TxBuilder`
  - create() - Constructor.
  - addRecipient(script: Script, amount: number) - Add recipient.
  - addUnspendable(outPoint: OutPoint).
  - addUtxo(outPoint: OutPoint).
  - addUtxos(outPoints: Array<OutPoint>).
  - doNotSpendChange().
  - manuallySelectedOnly() - Only spend utxos added by add_utxo.
  - onlySpendChange().
  - unspendable(outPoints: Array<OutPoint>).
  - feeRate(feeRate: number).
  - feeAbsolute(feeRate: number).
  - drainWallet() - Spend all the available inputs.
  - drainTo(script: Script) - Sets the address script to drain excess coins to.
  - enableRbf().
  - enableRbfWithSequence(nsequence: number) - Enable signaling RBF with a specific nSequence value.
  - addData(data: Array<number>) - Add data as an output, using OP_RETURN.
  - setRecipients(recipients: Array<ScriptAmount>).
  - finish(wallet: Wallet) - Finishes the transaction building
- `Wallet`
  - create(descriptor: Descriptor, changeDescriptor: Descriptor | null | undefined, network: Network, dbConfig: DatabaseConfig) - Constructor.
  - getAddress(addressIndex: AddressIndex) - Return a derived address using the external descriptor.
  - getBalance() - Return balance of current wallet.
  - network() - Get the Bitcoin network the wallet is using.
  - sync(blockchain: Blockchain) - Sync the internal database with the `Blockchain`.
  - listUnspent() - Return the list of unspent outputs of this wallet.
  - listTransactions() - Return an unsorted list of transactions made and received by the wallet.
  - sign(psbt: PartiallySignedTransaction) - Sign PSBT with wallet.
