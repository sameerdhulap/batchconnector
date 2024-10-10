This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Integration
### For iOS
For Native implementaion of events You have to create new swift file `GeofencingEventsReceiver.swift` in iOS folder and add it your workspace
``` swift
import Foundation
import WoosmapGeofencing
import react_native_plugin_geofencing

extension Notification.Name {
  static let updateRegions = Notification.Name("updateRegions")
  static let didEventPOIRegion = Notification.Name("didEventPOIRegion")
}

@objc(GeofencingEventsReceiver)
class GeofencingEventsReceiver: NSObject {
  @objc public func startReceivingEvent() {
    NotificationCenter.default.addObserver(self, selector: #selector(POIRegionReceivedNotification),
                                           name: .didEventPOIRegion,
                                           object: nil)
  }
  @objc func POIRegionReceivedNotification(notification: Notification) {
    if let POIregion = notification.userInfo?["Region"] as? Region{
      // YOUR CODE HERE
      if POIregion.didEnter {
        NSLog("didEnter")
      }
      else{
        NSLog("didExit")
      }
      // Add Your Batch intergation here
    }
  }
  // Stop receiving notification
  @objc public func stopReceivingEvent() {
    NotificationCenter.default.removeObserver(self, name: .didEventPOIRegion, object: nil)
  }
  
}
```

Also Update `AppDelegate.mm` as following

``` objective-c

GeofencingEventsReceiver * objWoosmapReceiver;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"MarketingConnector";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  objWoosmapReceiver = [GeofencingEventsReceiver new];
  [objWoosmapReceiver startReceivingEvent];
  
  
  ....
  ....
  ....
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
```
