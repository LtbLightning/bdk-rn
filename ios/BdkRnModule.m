//
//  BdkRnModule.m
//  BdkRnModule
//


#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BdkRnModule, NSObject)

RCT_EXTERN_METHOD(getNewAddress:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getLastUnusedAddress:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getBalance:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(
    initWallet: (nonnull NSString*)mnemonic
    password:(nonnull NSString *)password  
    network:(nonnull NSString *)network
    blockChainConfigUrl:(nonnull NSString *)blockChainConfigUrl
    blockChainSocket5:(nonnull NSString *)blockChainSocket5
    retry:(nonnull NSString *)retry
    timeOut:(nonnull NSString *)timeOut
    blockChain:(nonnull NSString *)blockChain
    resolve: (RCTPromiseResolveBlock)resolve 
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  genSeed: (nonnull NSString *)password
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
    genDescriptor: (nonnull NSString*)mnemonic
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
