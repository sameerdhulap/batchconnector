#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UNUserNotificationCenter.h>
#import <BrazeKit/BrazeKit-Swift.h>
#import "BrazeReactBridge.h"

@interface AppDelegate : RCTAppDelegate<UNUserNotificationCenterDelegate>
@property (class, nonatomic, strong) Braze *braze;
@end
