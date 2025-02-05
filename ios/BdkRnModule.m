//  BdkRnModule.m
//  BdkRnModule
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BdkRnModule, NSObject)

/** Mnemonic Methods */

RCT_EXTERN_METHOD(
    generateSeedFromWordCount:(nonnull NSNumber*)wordCount
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    generateSeedFromString:(nonnull NSString*)mnemonic
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    generateSeedFromEntropy:(nonnull NSArray*)entropy
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** DerivationPath Methods */
RCT_EXTERN_METHOD(
    createDerivationPath:(nonnull NSString*)path
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    derivationPathToString:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** DescriptorSecretKey Methods */
RCT_EXTERN_METHOD(
    createDescriptorSecretKey:(nonnull NSString*)network
    mnemonic:(nonnull NSString*)mnemonic
    password:(nullable NSString*)password
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretKeyFromString:(nonnull NSString*)secretKey
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretKeyAsPublic:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretKeyAsString:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretKeyDerive:(nonnull NSString*)id
    path:(nonnull NSString*)path
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretKeyExtend:(nonnull NSString*)id
    path:(nonnull NSString*)path
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorSecretKeySecretBytes:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)


/** DescriptorPublicKey Methods */
RCT_EXTERN_METHOD(
    createDescriptorPublic:(nonnull NSString*)publicKey
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
    descriptorPublicDerive:(nonnull NSString*)publicKeyId
    derivationPathId:(nonnull NSString*)derivationPathId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorPublicExtend:(nonnull NSString*)publicKeyId
    derivationPathId:(nonnull NSString*)derivationPathId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    descriptorPublicAsString:(nonnull NSString*)publicKeyId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** DB Configuration Methods */
RCT_EXTERN_METHOD(
    memoryDBInit:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    sledDBInit:(nonnull NSString*)path
    treeName:(nonnull NSString*)treeName
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    sqliteDBInit:(nonnull NSString*)path
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

 /** Wallet Protocol Methods */
RCT_EXTERN_METHOD(
    walletApplyUpdate:(nonnull NSString*)walletId
    updateId:(nonnull NSString*)updateId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletCalculateFee:(nonnull NSString*)walletId
    txId:(nonnull NSString*)txId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletCalculateFeeRate:(nonnull NSString*)walletId
    txId:(nonnull NSString*)txId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletCommit:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetBalance:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetTx:(nonnull NSString*)walletId
    txid:(nonnull NSString*)txid
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletIsMine:(nonnull NSString*)walletId
    scriptId:(nonnull NSString*)scriptId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletListOutput:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletListUnspent:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletNetwork:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletRevealNextAddress:(nonnull NSString*)walletId
    keychain:(nonnull NSString*)keychain
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletSentAndReceived:(nonnull NSString*)walletId
    txId:(nonnull NSString*)txId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletSign:(nonnull NSString*)walletId
    psbtId:(nonnull NSString*)psbtId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletStartFullScan:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletTransactions:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** Wallet sync methods */
RCT_EXTERN_METHOD(
    walletSync:(nonnull NSString*)walletId
    syncRequest:(nonnull NSString*)syncRequest
    blockchain:(nonnull NSString*)blockchain
    batchSize:(nonnull NSNumber*)batchSize
    fetchPrevTxouts:(nonnull BOOL*)fetchPrevTxouts
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletStartSyncWithRevealedSpks:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletApplyUpdate:(nonnull NSString*)walletId
    updateId:(nonnull NSString*)updateId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetBalanceImmature:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetBalanceTrustedPending:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetBalanceUntrustedPending:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetBalanceConfirmed:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetBalanceTrustedSpendable:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetBalanceTotal:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletCalculateFee:(nonnull NSString*)walletId
    transactionId:(nonnull NSString*)transactionId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletCalculateFeeRate:(nonnull NSString*)walletId
    transactionId:(nonnull NSString*)transactionId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletCommit:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetNextInternalAddress:(nonnull NSString*)walletId
    addressIndex:(nonnull NSNumber*)addressIndex
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetNextChangeAddress:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetNextChangeInternalAddress:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetNextReceivingAddress:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetNextReceivingInternalAddress:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetNextChangeAddressIndex:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetNextReceivingAddressIndex:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletGetTx:(nonnull NSString*)walletId
    txid:(nonnull NSString*)txid
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletListOutput:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletRevealNextAddress:(nonnull NSString*)walletId
    keychain:(nonnull NSString*)keychain
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletSentAndReceived:(nonnull NSString*)walletId
    transactionId:(nonnull NSString*)transactionId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    walletStartFullScan:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    createMemoryWallet:(nonnull NSString*)network
    descriptor:(nonnull NSString*)descriptor
    changeDescriptor:(nullable NSString*)changeDescriptor
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** Address methods */
RCT_EXTERN_METHOD(
    addressNetwork:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    addressToQrUri:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    addressAsString:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    addressIsValidForNetwork:(nonnull NSString*)id
    network:(nonnull NSString*)network
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** Amount methods */
RCT_EXTERN_METHOD(
    createAmountFromSat:(nonnull NSNumber*)sat
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    createAmountFromBtc:(nonnull NSNumber*)btc
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    amountAsSats:(nonnull NSNumber*)sats
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    amountAsBtc:(nonnull NSNumber*)sats
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** TxBuilder methods */
RCT_EXTERN_METHOD(createTxBuilder:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

/** Recipient methods */
RCT_EXTERN_METHOD(
    addRecipient:(nonnull NSString*)id
    scriptId:(nonnull NSString*)scriptId
    amount:(nonnull NSNumber*)amount
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** Unspendable methods */
RCT_EXTERN_METHOD(
    addUnspendable:(nonnull NSString*)id
    outPoint:(nonnull NSDictionary*)outPoint
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** Utxo methods */
RCT_EXTERN_METHOD(
    addUtxo:(nonnull NSString*)id
    outPoint: (nonnull NSDictionary*)outPoint
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** addUtxos methods */
RCT_EXTERN_METHOD(
    addUtxos:(nonnull NSString*)id
    outPoints: (nonnull NSArray*)outPoints
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** doNotSpendChange methods */
RCT_EXTERN_METHOD(
    doNotSpendChange:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** manuallySelectedOnly methods */
RCT_EXTERN_METHOD(
    manuallySelectedOnly:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** onlySpendChange methods */
RCT_EXTERN_METHOD(
    onlySpendChange:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** unspendable methods */
RCT_EXTERN_METHOD(
    unspendable:(nonnull NSString*)id
    outPoints: (nonnull NSArray*)outPoints
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** FeeRate Methods */
RCT_EXTERN_METHOD(
    createFeeRateFromSatPerVb:(nonnull NSNumber*)satPerVb
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    createFeeRateFromSatPerKwu:(nonnull NSNumber*)satPerKwu
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    feeRateToSatPerVbCeil:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    feeRateToSatPerVbFloor:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    feeRateToSatPerKwu:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** feeAbsolute methods */
RCT_EXTERN_METHOD(
    feeAbsolute:(nonnull NSString*)id
    feeRate:(nonnull NSNumber*)feeRate
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** drainWallet methods */
RCT_EXTERN_METHOD(
    drainWallet:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** drainTo methods */
RCT_EXTERN_METHOD(
    drainTo:(nonnull NSString*)id
    scriptId:(nonnull NSString*)scriptId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** enableRbf methods */
RCT_EXTERN_METHOD(
    enableRbf:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** enableRbfWithSequence methods */
RCT_EXTERN_METHOD(
    enableRbfWithSequence:(nonnull NSString*)id
    nsequence:(nonnull NSNumber*)nsequence
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** addData methods */
RCT_EXTERN_METHOD(
    addData:(nonnull NSString*)id
    data:(nonnull NSArray*)data
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** setRecipients methods */
RCT_EXTERN_METHOD(
    setRecipients:(nonnull NSString*)id
    recipients:(nonnull NSArray*)recipients
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** finish methods */
RCT_EXTERN_METHOD(
    finish:(nonnull NSString*)id
    walletId:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
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

RCT_EXTERN_METHOD(
    newBip86: (nonnull NSString*)secretKeyId
    keychain:(nonnull NSString*)keychain
    network:(nonnull NSString*)network
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    newBip86Public: (nonnull NSString*)publicKeyId
    fingerprint:(nonnull NSString*)fingerprint
    keychain:(nonnull NSString*)keychain
    network:(nonnull NSString*)network
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** PSBT Methods */
RCT_EXTERN_METHOD(
    extractTx:(nonnull NSString*)base64
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    serialize:(nonnull NSString*)base64
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txid:(nonnull NSString*)base64
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** BumpFeeTxBuilder Methods */
RCT_EXTERN_METHOD(
    bumpFeeTxBuilderInit:(nonnull NSString*)txid
    newFeeRate:(nonnull NSNumber*)newFeeRate
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    bumpFeeTxBuilderEnableRbf:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    bumpFeeTxBuilderEnableRbfWithSequence:(nonnull NSString*)id
    nSequence:(nonnull NSNumber*)nSequence
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    bumpFeeTxBuilderFinish:(nonnull NSString*)id
    walletId:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)


/** Transaction Methods */
RCT_EXTERN_METHOD(
    createTransaction:(nonnull NSArray*)bytes
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    serializeTransaction:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    transactionTxid:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txWeight:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txSize:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txVsize:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txIsCoinBase:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txIsExplicitlyRbf:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txIsLockTimeEnabled:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txVersion:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txLockTime:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txInput:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    txOutput:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    transactionOutput:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    transactionLockTime:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** Script Methods */

RCT_EXTERN_METHOD(
    toBytes:(nonnull NSString*)id
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** Chain Position methods */

RCT_EXTERN_METHOD(
    createChainPosition:(nonnull NSDictionary*)position
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getChainPositionType:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getChainPositionData:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** Local Output methods */

RCT_EXTERN_METHOD(
    getLocalOutputOutpoint:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getLocalOutputTxout:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getLocalOutputKeychain:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    isLocalOutputSpent:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** ElectrumClient methods */
RCT_EXTERN_METHOD(
    createElectrumClient:(nonnull NSString*)url
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    electrumClientBroadcast:(nonnull NSString*)clientId
    transactionId:(nonnull NSString*)transactionId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    electrumClientFullScan:(nonnull NSString*)clientId
    fullScanRequest:(nonnull NSString*)fullScanRequest
    stopGap:(nonnull NSNumber*)stopGap
    batchSize:(nonnull NSNumber*)batchSize
    fetchPrevTxouts:(nonnull BOOL*)fetchPrevTxouts
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    electrumClientSync:(nonnull NSString*)clientId
    syncRequest:(nonnull NSString*)syncRequest
    batchSize:(nonnull NSNumber*)batchSize
    fetchPrevTxouts:(nonnull BOOL*)fetchPrevTxouts
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** AddressInfo methods */

RCT_EXTERN_METHOD(
    createAddressInfo:(nonnull NSNumber*)index
    addressId:(nonnull NSString*)addressId
    keychain:(nonnull NSString*)keychain
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getAddressInfoIndex:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getAddressInfoAddress:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getAddressInfoKeychain:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** EsploraClient methods */

RCT_EXTERN_METHOD(
    createEsploraClient:(nonnull NSString*)url
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    esploraClientBroadcast:(nonnull NSString*)clientId
    transactionId:(nonnull NSString*)transactionId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    esploraClientSync:(nonnull NSString*)clientId
    syncRequest:(nonnull NSString*)syncRequest
    parallelRequests:(nonnull NSNumber*)parallelRequests
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    esploraClientFullScan:(nonnull NSString*)clientId
    fullScanRequest:(nonnull NSString*)fullScanRequest
    stopGap:(nonnull NSNumber*)stopGap
    parallelRequests:(nonnull NSNumber*)parallelRequests
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** SyncRequest methods */

RCT_EXTERN_METHOD(
    createSyncRequest:(nonnull NSString*)walletId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getSyncRequestHeight:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getSyncRequestWalletId:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getSyncRequestRange:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getSyncRequestFetchPrevTxouts:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getSyncRequestParallelRequests:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    freeSyncRequest:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    freeAddress:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    freeNetwork:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** Wallet Methods */
RCT_EXTERN_METHOD(
    getAddress:(nonnull NSString*)id
    addressIndex:(nullable id)addressIndex
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getInternalAddress:(nonnull NSString*)id
    addressIndex:(nullable id)addressIndex
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    isMine:(nonnull NSString*)id
    scriptId:(nonnull NSString*)scriptId
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    getNetwork:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    listUnspent:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

/** Script Methods */
RCT_EXTERN_METHOD(
    createScript:(nonnull NSArray*)rawOutputScript
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    scriptToBytes:(nonnull NSString*)id
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

@end

