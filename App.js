import * as React from 'react';
import { useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './homescreen';
import Tablelist from './tableList';
import Orderd from './orderdetail';
import Printer from './print';
import Paymentli from './paymentList';
import ReportM from './source/menuReport';
import ReportS from './source/report/report';
import Setting from './setting';
import FlashMessage from "react-native-flash-message";
import ItemDetail from './itemDetail';
import store from './source/redux/store';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Awesomeicons from 'react-native-vector-icons/FontAwesome6';
import Materialicons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, icons, } from './source/constants';


import { useFonts } from 'expo-font';
import Itemlist from './itemlist';



SplashScreen.preventAutoHideAsync();



function HomeScreen({ navigation, route }) {
  return (


    <View style={{ flex: 1 }}>

      <Home navigation={navigation} route={route} />
      <FlashMessage position='top' />
    </View>

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
  const { goBack } = useNavigation();
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
            return <Materialicons name={iconName} size={30} color={color} />;
          }

          // You can return any component that you like here!

        },
        tabBarActiveTintColor: '#79B45D',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#222222',
        },
        headerShown: 'false',
        headerLeft: () => < BackButton onPress={goBack} />,
        headerStyle: {
          backgroundColor: '#79B45D',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',

        },

      })}
    >
      <Tab.Screen name="Foods" component={_Foods} initialParams={{ tab: 1 }} options={{ title: "Món ăn" }} />
      <Tab.Screen name="Drinks" component={_Foods} initialParams={{ tab: 2 }} options={{ title: "Thức uống" }} />
      <Tab.Screen name="Others" component={_Foods} initialParams={{ tab: 3 }} options={{ title: "Các món khác" }} />
    </Tab.Navigator>


  );

}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BackButton = ({ onPress }) => <TouchableOpacity style={{ alignItems: "center", flexDirection: "row", justifyContent: "center" }} onPress={onPress}>
  <Image
    source={icons.back_arrow}
    style={{
      width: 22,
      height: 22,
      tintColor: COLORS.white,
      left: 15,
      marginRight: 15
    }}
  />
  <Text onPress={onPress}></Text>
</TouchableOpacity>

function App() {

  const [fontsLoaded] = useFonts({

    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
  })

  useEffect(() => {
    async function prepare() {

      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);


  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {

      await SplashScreen.hideAsync();

    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {

    return null;
  }




  return (


    <Provider store={store}>

      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator initialRouteName="Home">

          <Stack.Screen name="Dashboard" component={HomeScreen}

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
            //initialParams={{ post: true }}

            options={{
              //  header: ({ navigation, route }) => (<Headertable navigation={navigation} route={route} />),
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
              headerShown: false,
              //title: 'Quản lý Menu',
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