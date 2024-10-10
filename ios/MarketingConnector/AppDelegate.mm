#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import "MarketingConnector-Swift.h"
#import <UserNotifications/UserNotifications.h>

@implementation AppDelegate

GeofencingEventsReceiver * objWoosmapReceiver;
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"MarketingConnector";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  objWoosmapReceiver = [GeofencingEventsReceiver new];
  [objWoosmapReceiver startReceivingEvent];
  
  
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge)
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
      if (granted) {
          dispatch_async(dispatch_get_main_queue(), ^{
              [[UIApplication sharedApplication] registerForRemoteNotifications];
          });
      } else {
          NSLog(@"Permission for push notifications denied.");
      }
  }];
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
  
  if (@available(iOS 14.0, *)) {
    completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionList | UNNotificationPresentationOptionBanner);
  } else {
    // Fallback on earlier versions
    completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert);
  }
}
@end
