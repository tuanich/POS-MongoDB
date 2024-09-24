import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './homescreen';
import Order from './orderlist';
import Orderd from './orderdetail';
import Printer from './print';
import Paymentli from './paymentList';
import ReportM from './source/menuReport';
import ReportS from './source/report/report';
import Setting from './setting';
import store from './source/redux/store';
import { Provider } from 'react-redux';
//import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useCallback, useEffect, useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

SplashScreen.preventAutoHideAsync();

function HomeScreen({ navigation,route }) {
  return (
    <Home navigation={navigation} route={route}/>
   
  );
}

function Orderlist({ navigation,route }) {
  return (
    <Order navigation={navigation} route={route}  />
  );
}

function Orderdetail({ navigation,route }) {
  return (
    <Orderd navigation={navigation} route={route}/>
  );
}

function Print({ navigation,route }) {
  return (
    <Printer navigation={navigation} route={route}/>
  );
}

function SettingURL({ navigation,route }) {
  return (
    <Setting
    
    
    
    navigation={navigation} route={route}/>
  );
}

function Paymentlist({ navigation,route }) {
  return (
    <Paymentli navigation={navigation} route={route}/>
  );
}

function Report({ navigation,route}) {
  return (
    <ReportS navigation={navigation} route={route}/>
  );
  
}

function ReportMenu({ navigation,route}) {
  return (
    <ReportM navigation={navigation} route={route}/>
  );
  
}

const Stack = createNativeStackNavigator();

function App() {

  let [fontsLoaded, fontError] = useFonts({
    'Roboto-Italic': require('./assets/fonts/Roboto-Italic.ttf'),
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  
   
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} 
        initialParams={{ post: false }}
        options={{
          
          headerStyle: {
            backgroundColor: '#79B45D',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          
        }} />
        <Stack.Screen name="Order" component={Orderlist} 
       
        // options={{
        //   title: 'Chọn bàn',
        //   headerStyle: {
        //     backgroundColor: '#79B45D',
        //   },
        //   headerTintColor: '#fff',
        //   headerTitleStyle: {
        //     fontWeight: 'bold',
        //   },
        // }} 
        Params={{ post: false }}
        options={{
          headerShown: false,
     //     headerLeft: ()=>false,
      //    headerBackVisible:false,
      }}
        />
         <Stack.Screen 
         name="Orderdetail" 
         component={Orderdetail}
        //  options={{
        //   title: null,
        //   headerLeft: ()=>false,
        //   headerBackVisible:false,
        //   headerStyle: {
        //     backgroundColor: '#79B45D',
        //   },
        //   headerTintColor: '#fff',
        //   headerTitleStyle: {
        //   fontWeight: 'bold',
          
        //   },
        // }} 
        options={{
          headerShown: false,}}
         /> 
         <Stack.Screen 
         name="Printer" 
         component={Print}
         options={{
          title: 'Print',
         // headerLeft: ()=>false,
         
          headerStyle: {
            backgroundColor: '#79B45D',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold',
          
          },
        }} 
         /> 
         <Stack.Screen 
         name="Payments" 
         component={Paymentlist}
         options={{
          title: 'Đơn đã thanh toán',
         // headerLeft: ()=>false,
         
          headerStyle: {
            backgroundColor: '#79B45D',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold',
          
          },
        }} 
         /> 
         <Stack.Screen 
         name="ReportMenu" 
         component={ReportMenu}
         options={{
          title: 'Menu báo cáo',
         // headerLeft: ()=>false,
         
          headerStyle: {
            backgroundColor: '#79B45D',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold',
          
          },
        }} 
         />
         <Stack.Screen 
            name="Report" 
            component={Report}
            options={{
             title: '',
            // headerLeft: ()=>false,
            
             headerStyle: {
               backgroundColor: '#79B45D',
             },
             headerTintColor: '#fff',
             headerTitleStyle: {
             fontWeight: 'bold',
             
             },
           }} 
            /> 
            <Stack.Screen 
            name="Setting" 
            component={SettingURL}
            options={{
             title: 'Cài đặt Server',
            // headerLeft: ()=>false,
            
             headerStyle: {
               backgroundColor: '#79B45D',
             },
             headerTintColor: '#fff',
             headerTitleStyle: {
             fontWeight: 'bold',
             
             },
           }} 
            /> 
          
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

export default App;