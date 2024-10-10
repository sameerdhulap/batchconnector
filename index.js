/**
 * @format
 */

import {AppRegistry, Platform, PermissionsAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import WoosmapGeofencing from '@woosmap/react-native-plugin-geofencing';

AppRegistry.registerComponent(appName, () => App);

function activateWoosmapGeofenceSDK(params) {
  // var woosmapSettings = {
  //   privateKeyWoosmapAPI: Platform.OS === 'ios' ? '653ce5d0-7019-48bc-a0d9-4353d5999a89' : '157c16cd-fc0e-46d9-8c40-f80953a9cbf7',
  //   trackingProfile: 'passiveTracking',
  // };
  // WoosmapGeofencing.initialize(woosmapSettings)
  //                 .then((value) => {
  //                   console.log(value);
  //                 })
  //                 .catch((error) => {
  //                   console.log('message: ' + error.message);
  //                 });
}

function checkPermissionStatus(){
  if(Platform.OS === 'ios'){
    checkLocationPermission();
  }
  else{
    checkNotificationPermission().then((status) => {
      checkLocationPermission();
    });
  }
}

function checkLocationPermission(){
  WoosmapGeofencing.getPermissionsStatus()
  .then((status) => {
    if (status === 'UNKNOWN'){
      //Ask permission
      if (Platform.OS === 'ios'){
        WoosmapGeofencing.requestPermissions(true)
        .then((permissionStatus) => {
          activateWoosmapGeofenceSDK();
        })
        .catch((error) => {
          console.log('message: ' + error.message);
        });
      }
      else {
        if (status === 'GRANTED_FOREGROUND'){
          WoosmapGeofencing.requestPermissions(true).then((permissionStatus) => {
            activateWoosmapGeofenceSDK();
          })
          .catch((error) => {
            console.log('message: ' + error.message);
          });
        }
        else{
          WoosmapGeofencing.requestPermissions(false).then((permissionStatus) => {
            if (permissionStatus === 'GRANTED_FOREGROUND'){
              WoosmapGeofencing.requestPermissions(true).then((backgroundPermissionStatus) => {
                console.log('background permission ' + backgroundPermissionStatus);
                activateWoosmapGeofenceSDK();
              })
              .catch((error) => {
                console.log('message: ' + error.message);
              });
            }
          });
        }
      }
    }
    else{
      activateWoosmapGeofenceSDK();
    }
    })
    .catch((error) => {
      console.log('message: ' + error.message);
    });
}
async function checkNotificationPermission() {
    try {
      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted;
    } catch (err) {
      console.warn(err);
    }
}
checkPermissionStatus();






