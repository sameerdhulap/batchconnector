/**
 * @format
 */

import {AppRegistry, Platform, PermissionsAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import WoosmapGeofencing from '@woosmap/react-native-plugin-geofencing';

AppRegistry.registerComponent(appName, () => App);


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
        WoosmapGeofencing.requestPermissions(true);
      }
      else {
        if (status === 'GRANTED_FOREGROUND'){
          WoosmapGeofencing.requestPermissions(true);
        }
        else{
          WoosmapGeofencing.requestPermissions(false).then((permissionStatus) => {
            if (permissionStatus === 'GRANTED_FOREGROUND'){
              WoosmapGeofencing.requestPermissions(true);
            }
          });
        }
      }
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






