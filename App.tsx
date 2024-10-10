/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import WoosmapGeofencing, { Region } from '@woosmap/react-native-plugin-geofencing';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const callback = (value: Region) => {
    console.log(JSON.stringify(value));
  };

  const woosmapSettings = {
    privateKeyWoosmapAPI: Platform.OS === 'ios' ? '653ce5d0-7019-48bc-a0d9-4353d5999a89' : '157c16cd-fc0e-46d9-8c40-f80953a9cbf7',
    trackingProfile: 'passiveTracking',
  };

  WoosmapGeofencing.initialize(woosmapSettings)
                  .then((value) => {
                    console.log(value);
                  })
                  .then(()=>{
                    WoosmapGeofencing.watchRegions(callback)
                    .then((watchRef: string) => {
                      console.log('Watch added for' + watchRef);
                    })
                    .catch((error: any) => {
                      console.error(error);
                    });
                  })
                  .catch((error) => {
                    console.log('message: ' + error.message);
                  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }} ><Text>Integration with Woosmap Geofence SDK and native Events</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default App;
