//
//  BdkRnModule.m
//  BdkRnModule
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BdkRnModule, NSObject)

RCT_EXTERN_METHOD(getNewAddress:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getBalance:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(syncWallet:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(
    createWallet: (nonnull NSString*)mnemonic
    password:(nonnull NSString *)password  
    network:(nonnull NSString *)network
    blockChainConfigUrl:(nonnull NSString *)blockChainConfigUrl
    blockChainSocket5:(nonnull NSString *)blockChainSocket5
    retry:(nonnull NSString *)retry
    timeOut:(nonnull NSString *)timeOut
    blockChainName:(nonnull NSString *)blockChainName
    descriptor:(nonnull NSString *)descriptor
    resolve: (RCTPromiseResolveBlock)resolve 
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    generateMnemonicFromWordCount: (nonnull NSNumber *)wordCount
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    generateMnemonicFromString: (nonnull NSString *)mnemonic
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)


RCT_EXTERN_METHOD(
    getExtendedKeyInfo: (nonnull NSString*)network
    mnemonic:(nonnull NSString *)mnemonic
    password:(nonnull NSString *)password
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    broadcastTx: (nonnull NSString *)recipient
    amount: (nonnull NSNumber *)amount
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(getPendingTransactions:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getConfirmedTransactions:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
@end
