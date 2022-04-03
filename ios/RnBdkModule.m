//
//  RnBdkModule.m
//  RnBdkModule
//

//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RnBdkModule, NSObject)

RCT_EXTERN_METHOD(getNewAddress:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getBalance:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(
    createWallet: (nonnull NSString*)mnemonic
    password:(nonnull NSString *)password  
    resolve: (RCTPromiseResolveBlock)resolve 
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    restoreWallet: (nonnull NSString*)mnemonic
    password:(nonnull NSString *)password  
    resolve: (RCTPromiseResolveBlock)resolve 
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  genSeed: (nonnull NSString *)password
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  broadcastTx: (nonnull NSString *)recipient
                  amount: (nonnull NSNumber *)amount
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
                  )

@end
