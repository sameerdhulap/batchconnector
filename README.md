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

### Batch Integration

Follow the [Batch Implementation](https://doc.batch.com/react-native/sdk-integration/) guide in order to add Batch plugin to your project.

### Receiving Woosmap Geofencing Region events using iOS Notification

Follow the steps below in order to capture events of geofence SDK

1. Add a new swift class file GeofencingEventsReceiver.swift and in iOS folder and add it your iOS workspace with following code in it. 

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
        
        // if you want only push to batch geofence event related to POI,
        // check first if the POIregion.origin is equal to "POI"
        if POIregion.origin == "POI"
        {
          if let POI = POIs.getPOIbyIdStore(idstore: POIregion.identifier) as POI? {
            
            // Event with custom attributes
            //                        BatchProfile.trackEvent(name: "woos_geofence_entered_event", attributes: BatchEventAttributes { data in
            //                          // Custom attribute
            //                          data.put(POI.idstore ?? "", forKey: "identifier")
            //                          // Compatibility reserved key
            //                          data.put(POI.name ?? "", forKey: "name")
            //                        })
          }
          else {
            // error: Related POI doesn't exist
          }
        }
      }
    }
  }
  // Stop receiving notification
  @objc public func stopReceivingEvent() {
    NotificationCenter.default.removeObserver(self, name: .didEventPOIRegion, object: nil)
  }
  
}
```

2.  Update `AppDelegate.mm` as following

``` java

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

### Receiving Woosmap Geofencing Region events using Android Broadcasts

Geofencing SDK triggers an action `com.woosmap.action.GEOFENCE_TRIGGERED` and broadcasts `regionLog` in the intent extra. The format of the data will always be as follows:

``` json
{
  "longitude": -0.1337,
  "latitude": 51.50998,
  "date": 1700824501480,
  "didenter": true,
  "identifier": "custom-region1",
  "radius": 100,
  "frompositiondetection": false,
  "eventname": "woos_geofence_exited_event",
  "spenttime": 75
}
```

Follow the steps below in order to listen to the broadcasts sent by the Woosmap Geofencing Plugin

1. Add following dependencies in the `build.gradle` file of your main project.

  ``` java
  repositories {
          ...
          ....
          maven { url 'https://jitpack.io' }
      }
  ```

2. Add following dependencies in the `app/build.gradle` file of your main project.

  ``` java
  dependencies {
      ...
      ...
      woosmap:geofencing-core-android-sdk:core_geofence_2.+"
      implementation "com.webgeoservices.woosmapgeofencing:woosmap-mobile-sdk:4.+"
  }
  ```

3. Add a new Java class GeofencingEventsReceiver.java and add following code in it.
 
```java, GeofencingEventsReceiver.java
package com.marketingconnector;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.webgeoservices.woosmapgeofencingcore.database.POI;
import com.webgeoservices.woosmapgeofencingcore.database.WoosmapDb;

import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class GeofencingEventsReceiver extends BroadcastReceiver {
    private static final String TAG = "GeofencingReceiver";
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    @Override
    public void onReceive(Context context, Intent intent) {
        executorService.execute(() -> {
            try{
                // Get region data from the intent
                JSONObject regionData = new JSONObject(intent.getStringExtra("regionLog"));
                // Fetch the POI from the db based on the identifier
                POI poi;
                poi = WoosmapDb.getInstance(context).getPOIsDAO().getPOIbyStoreId(regionData.getString("identifier"));
                if (poi != null){ //poi could be null if the entered/exited region is a custom region.
//                    Add Your implementation here
//                    Event with custom attributes
//                    BatchEventAttributes attributes = new BatchEventAttributes()
//                            .put("identifier", poi.idStore)
//                            .put("name", poi.name);
//                    Batch.Profile.trackEvent(regionData.getString("eventname"), attributes);
                }
            }
            catch (Exception ex){
                Log.e(TAG, ex.toString());
            }
        });
    }

}

```

4. Register the newly created Broadcast Receiver from Application class.

``` kotlin
class MainApplication : Application(), ReactApplication {
  lateinit var geofencingEventsReceiver: GeofencingEventsReceiver
  
  override fun onCreate() {
    super.onCreate()
    ...
    ...

      // Register the receiver with the filter
      geofencingEventsReceiver = GeofencingEventsReceiver()
      val filter = IntentFilter("com.woosmap.action.GEOFENCE_TRIGGERED")
      registerReceiver(geofencingEventsReceiver, filter, RECEIVER_EXPORTED)
  }
}
```

