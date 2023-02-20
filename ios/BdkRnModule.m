//
//  BdkRnModule.m
//  BdkRnModule
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BdkRnModule, NSObject)

/** Mnemonic Methods */

RCT_EXTERN_METHOD(
    generateSeedFromWordCount: (nonnull NSNumber *)wordCount
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    generateSeedFromString: (nonnull NSString *)mnemonic
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    generateSeedFromEntropy: (nonnull NSNumber *)entropyLength
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
    mnemonic:(nonnull NSString *)mnemonic
    password:(nonnull NSString *)password
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretDerive: (nonnull NSString*)path
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretExtend: (nonnull NSString*)path
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(descriptorSecretAsPublic:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(descriptorSecretAsSecretBytes:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)


/** DescriptorPublicKey Methods */
RCT_EXTERN_METHOD(
    createDescriptorPublic: (nonnull NSString*)publicKey
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorPublicDerive: (nonnull NSString*)path
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorPublicExtend: (nonnull NSString*)path
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** Blockchain methods */

RCT_EXTERN_METHOD(
    initElectrumBlockchain: (nonnull NSString*)url
    retry: (nonnull NSString *)retry
    stopGap: (nonnull NSString *)stopGap
    timeOut: (nonnull NSString *)timeOut
    resolve: (RCTPromiseResolveBlock)resolve
    reject: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    initEsploraBlockchain: (nonnull NSString*)url
    proxy: (nonnull NSString *)proxy
    concurrency: (nonnull NSString *)concurrency
    stopGap: (nonnull NSString *)stopGap
    timeOut: (nonnull NSString *)timeOut
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
    psbtId: (nonnull NSString *)psbtId
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** DB configuration methods */
RCT_EXTERN_METHOD(memoryDBInit:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(
    sledDBInit: (nonnull NSString*)path
    treeName: (nonnull NSString *)treeName
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
    network: (nonnull NSString *)network
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
    blockChainId: (nonnull NSString *)blockChainId
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
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
    sign:(nonnull NSString*)id
    psbtId: (nonnull NSString *)psbtId
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
    addressToScriptPubkeyHex:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** TxBuilder methods */
RCT_EXTERN_METHOD(createTxBuilder:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(
    addRecipient:(nonnull NSString*)id
    scriptId: (nonnull NSString *)scriptId
    amount: (nonnull NSNumber *)amount
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    finish:(nonnull NSString*)id
    walletId: (nonnull NSString *)walletId
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
    address:(nonnull NSString*)address
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

@end
