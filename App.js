import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './homescreen';
import Tablelist from './tableList';
import Orderd from './orderdetail';
import Printer from './print';
import Paymentli from './paymentList';
import ReportM from './source/menuReport';
import ReportS from './source/report/report';
import Setting from './setting';

import ItemDetail from './itemDetail';
import store from './source/redux/store';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Awesomeicons from 'react-native-vector-icons/FontAwesome6';
import Materialicons from 'react-native-vector-icons/MaterialCommunityIcons';

//import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import Itemlist from './itemlist';



SplashScreen.preventAutoHideAsync();



function HomeScreen({ navigation, route }) {
  return (




    <Home navigation={navigation} route={route} />


  );
}

function _Tablelist({ navigation, route }) {
  return (


    <Tablelist navigation={navigation} route={route} />



  );
}

function Orderdetail({ navigation, route }) {
  return (

    <Orderd navigation={navigation} route={route} />

  );
}

function Print({ navigation, route }) {
  return (

    <Printer navigation={navigation} route={route} />

  );
}

function SettingURL({ navigation, route }) {
  return (

    <Setting navigation={navigation} route={route} />

  );
}

function Paymentlist({ navigation, route }) {
  return (

    <Paymentli navigation={navigation} route={route} />

  );
}

function Report({ navigation, route }) {
  return (

    <ReportS navigation={navigation} route={route} />

  );

}

function ReportMenu({ navigation, route }) {
  return (

    <ReportM navigation={navigation} route={route} />

  );

}

function _Foods({ navigation, route }) {
  return (
    <Itemlist navigation={navigation} route={route} />
  )

}


function _ItemDetail({ navigation, route }) {
  return (

    <ItemDetail navigation={navigation} route={route} />

  )

}

function _ItemList({ navigation, route }) {
  return (


    <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;



          if (route.name === 'Foods') {
            iconName = focused
              ? 'bowl-food'
              : 'bowl-food';
            return <Awesomeicons name={iconName} size={size} color={color} />;
          }
          else {
            if (route.name === 'Drinks') {
              iconName = focused ? 'food-fork-drink' : 'food-fork-drink';

            }
            else {
              iconName = focused ? 'food-variant' : 'food-variant';



            }
            return <Materialicons name={iconName} size={size} color={color} />;
          }

          // You can return any component that you like here!

        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Foods" component={_Foods} initialParams={{ tab: 1 }} options={{ headerShown: false }} />
      <Tab.Screen name="Drinks" component={_Foods} initialParams={{ tab: 2 }} options={{ headerShown: false }} />
      <Tab.Screen name="Others" component={_Foods} initialParams={{ tab: 3 }} options={{ headerShown: false }} />
    </Tab.Navigator>


  );

}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {

  const [fontsLoaded] = useFonts({

    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
  })

  useEffect(() => {
    async function prepare() {
      //    console.log("preventAuto-hide");
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);


  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      //    console.log("fontsLoaded-hide");
      await SplashScreen.hideAsync();
      //    <AppLoading />;
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    //  console.log("!fontsLoaded");
    return null;
  }




  return (


    <Provider store={store}>

      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator initialRouteName="Home">

          <Stack.Screen name="Home" component={HomeScreen}
            initialParams={{ post: false }}
            options={{
              //      headerShown: false,
              headerStyle: {
                backgroundColor: '#79B45D',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },

            }} />
          <Stack.Screen name="Tablelist" component={_Tablelist}


            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="Orderdetail"
            component={Orderdetail}

            options={{
              headerShown: false,
            }}
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
            name="ItemList"
            component={_ItemList}
            options={{
              title: 'Quản lý Menu',
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
          <Stack.Screen
            name="Item"
            component={_ItemDetail}
            options={{
              title: 'Edit Item',
              // headerLeft: ()=>false,

              headerStyle: {
                backgroundColor: '#79B45D',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              }
            }}
          />


        </Stack.Navigator>

      </NavigationContainer>

    </Provider>
  );
}

export default App;