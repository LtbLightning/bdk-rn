//
//  RnBdkModule.m
//  RnBdkModule
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RnBdkModule, NSObject)

RCT_EXTERN_METHOD(getNewAddress:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
