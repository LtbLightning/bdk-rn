//
//  BdkRnModule.m
//  BdkRnModule
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BdkRnModule, NSObject)

/** Mnemonic Methods */

RCT_EXTERN_METHOD(
    generateSeedFromWordCount: (nonnull NSNumber*)wordCount
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    generateSeedFromString: (nonnull NSString*)mnemonic
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    generateSeedFromEntropy: (nonnull NSArray*)entropy
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

// Derivation path methods
RCT_EXTERN_METHOD(
    createDerivationPath: (nonnull NSString*)path
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** DescriptorSecretKey Methods */
RCT_EXTERN_METHOD(
    createDescriptorSecret: (nonnull NSString*)network
    mnemonic:(nonnull NSString*)mnemonic
    password:(nonnull NSString*)password
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretDerive: (nonnull NSString*)secretKeyId
    derivationPathId:(nonnull NSString*)derivationPathId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretExtend: (nonnull NSString*)secretKeyId
    derivationPathId:(nonnull NSString*)derivationPathId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretAsPublic: (nonnull NSString*)secretKeyId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretAsString: (nonnull NSString*)secretKeyId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretAsSecretBytes: (nonnull NSString*)secretKeyId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)


/** DescriptorPublicKey Methods */
RCT_EXTERN_METHOD(
    createDescriptorPublic: (nonnull NSString*)publicKey
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorPublicDerive: (nonnull NSString*)publicKeyId
    derivationPathId:(nonnull NSString*)derivationPathId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorPublicExtend: (nonnull NSString*)publicKeyId
    derivationPathId:(nonnull NSString*)derivationPathId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorPublicAsString: (nonnull NSString*)publicKeyId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)


/** Blockchain methods */

RCT_EXTERN_METHOD(
    initElectrumBlockchain: (nonnull NSString*)url
    sock5: (nullable NSString*)sock5
    retry: (nonnull NSNumber*)retry
    timeout: (nonnull NSNumber*)timeout
    stopGap: (nonnull NSNumber*)stopGap
    validateDomain: (nonnull BOOL*)validateDomain
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    initEsploraBlockchain: (nonnull NSString*)baseUrl
    proxy: (nullable NSString*)proxy
    concurrency: (nonnull NSNumber*)concurrency
    stopGap: (nonnull NSNumber*)stopGap
    timeout: (nonnull NSNumber*)timeout
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    initRpcBlockchain: (nonnull NSDictionary*)config
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getBlockchainHeight:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getBlockchainHash: (nonnull NSString*)id
    height: (nonnull NSNumber*)height
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    broadcast:(nonnull NSString*)id
    txId: (nonnull NSString*)txId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    estimateFee:(nonnull NSString*)id
    target: (nonnull NSNumber*)target
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** DB configuration methods */
RCT_EXTERN_METHOD(memoryDBInit:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(
    sledDBInit: (nonnull NSString*)path
    treeName: (nonnull NSString*)treeName
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
    sqliteDBInit: (nonnull NSString*)path
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

/** Wallet methods */
RCT_EXTERN_METHOD(
    walletInit: (nonnull NSString*)descriptor
    changeDescriptor: (NSString*)changeDescriptor
    network: (nonnull NSString*)network
    dbConfigID: (nonnull NSString*)dbConfigID
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getAddress:(nonnull NSString*)id
    addressIndex: (nonnull NSString*)addressIndex
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    sync:(nonnull NSString*)id
    blockChainId: (nonnull NSString*)blockChainId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getBalance:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
    getNetwork:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
    listUnspent:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
    listTransactions:(nonnull NSString*)id
    includeRaw: (nonnull BOOL*)includeRaw
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
    sign:(nonnull NSString*)id
    psbtBase64: (nonnull NSString*)psbtBase64
    signOptions: (nullable NSDictionary*)signOptions
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)



/** Address methods */
RCT_EXTERN_METHOD(
    initAddress:(nonnull NSString*)address
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)


RCT_EXTERN_METHOD(
    addressFromScript:(nonnull NSString*)script
    network: (nonnull NSString*)network
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    addressToScriptPubkeyHex:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    addressPayload:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)


RCT_EXTERN_METHOD(
    addressNetwork:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    addressToQrUri:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    addressAsString:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** TxBuilder methods */
RCT_EXTERN_METHOD(createTxBuilder:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(
    addRecipient:(nonnull NSString*)id
    scriptId: (nonnull NSString*)scriptId
    amount: (nonnull NSNumber*)amount
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)


RCT_EXTERN_METHOD(
    addUnspendable:(nonnull NSString*)id
    outPoint: (nonnull NSDictionary*)outPoint
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    addUtxo:(nonnull NSString*)id
    outPoint: (nonnull NSDictionary*)outPoint
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    addUtxos:(nonnull NSString*)id
    outPoints: (nonnull NSArray*)outPoints
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    doNotSpendChange:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    manuallySelectedOnly:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    onlySpendChange:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    unspendable:(nonnull NSString*)id
    outPoints: (nonnull NSArray*)outPoints
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    feeRate:(nonnull NSString*)id
    feeRate:(nonnull NSNumber*)feeRate
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    feeAbsolute:(nonnull NSString*)id
    feeRate:(nonnull NSNumber*)feeRate
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    drainWallet:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    drainTo:(nonnull NSString*)id
    scriptId:(nonnull NSString*)scriptId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    enableRbf:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    enableRbfWithSequence:(nonnull NSString*)id
    nsequence:(nonnull NSNumber*)nsequence
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    addData:(nonnull NSString*)id
    data:(nonnull NSArray*)data
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    setRecipients:(nonnull NSString*)id
    recipients:(nonnull NSArray*)recipients
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    finish:(nonnull NSString*)id
    walletId: (nonnull NSString*)walletId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** Descriptor Templates methods */
RCT_EXTERN_METHOD(
    createDescriptor:(nonnull NSString*)descriptor
    network: (nonnull NSString*)network
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorAsString:(nonnull NSString*)descriptorId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorAsStringPrivate:(nonnull NSString*)descriptorId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    newBip44: (nonnull NSString*)secretKeyId
    keychain:(nonnull NSString*)keychain
    network:(nonnull NSString*)network
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    newBip44Public: (nonnull NSString*)publicKeyId
    fingerprint:(nonnull NSString*)fingerprint
    keychain:(nonnull NSString*)keychain
    network:(nonnull NSString*)network
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    newBip49: (nonnull NSString*)secretKeyId
    keychain:(nonnull NSString*)keychain
    network:(nonnull NSString*)network
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    newBip49Public: (nonnull NSString*)publicKeyId
    fingerprint:(nonnull NSString*)fingerprint
    keychain:(nonnull NSString*)keychain
    network:(nonnull NSString*)network
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    newBip84: (nonnull NSString*)secretKeyId
    keychain:(nonnull NSString*)keychain
    network:(nonnull NSString*)network
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    newBip84Public: (nonnull NSString*)publicKeyId
    fingerprint:(nonnull NSString*)fingerprint
    keychain:(nonnull NSString*)keychain
    network:(nonnull NSString*)network
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** PartiallySignedTransaction methods */
RCT_EXTERN_METHOD(
    combine: (nonnull NSString*)base64
    other: (nonnull NSString*)other
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    extractTx: (nonnull NSString*)base64
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    serialize: (nonnull NSString*)base64
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txid: (nonnull NSString*)base64
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    feeAmount: (nonnull NSString*)base64
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    psbtFeeRate: (nonnull NSString*)base64
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    jsonSerialize: (nonnull NSString*)base64
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

/** BumpFeeTxBuilder methods */
RCT_EXTERN_METHOD(
    bumpFeeTxBuilderInit: (nonnull NSString*)txid
    newFeeRate: (nonnull NSNumber*)newFeeRate
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    bumpFeeTxBuilderAllowShrinking: (nonnull NSString*)id
    address: (nonnull NSString*)address
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    bumpFeeTxBuilderEnableRbf: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    bumpFeeTxBuilderEnableRbfWithSequence: (nonnull NSString*)id
    nSequence: (nonnull NSNumber*)nSequence
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    bumpFeeTxBuilderFinish: (nonnull NSString*)id
    walletId: (nonnull NSString*)walletId
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)


/** Transaction methods */
RCT_EXTERN_METHOD(
    createTransaction: (nonnull NSArray*)bytes
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    serializeTransaction: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    serializeTransaction: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    transactionTxid: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txWeight: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txSize: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)


RCT_EXTERN_METHOD(
    txVsize: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txIsCoinBase: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txIsExplicitlyRbf: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txIsLockTimeEnabled: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txVersion: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txLockTime: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txInput: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txOutput: (nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)


@end
