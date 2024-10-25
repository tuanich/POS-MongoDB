import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getItems, getTables, getPayments, insertLogin, updateLogout, getLogin, getReport4 } from './source/mongo';
import { itemlistSelector, orderlistSelector, statuslistSelector } from './source/redux/selector';
import ItemSlice from './source/redux/itemSlice';
import OrderSlice from './source/redux/orderSlice';
import statusSlice from './source/redux/statusSlice';
import { showMessage } from "react-native-flash-message";
import { COLORS, FONTS } from './source/constants';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { convertNumber } from "./source/api";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Icon } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import 'localstorage-polyfill';
import { useFocusEffect } from '@react-navigation/native';
import GoogleSignIn from './googlesignin';
import { format } from 'date-fns';
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const ITEM_STORAGE = "ITEM_KEY";
const STATUS_STORAGE = "STATUS_KEY";
const SALES_STORAGE = "SALES_KEY";
const PAYMENT_STORAGE = "PAYMENT_KEY";
//const LOGIN_STORAGE = "LOGIN_KEY";

function headerRight(signin) {

  return (
    <View>
      <Text style={{ color: 'white' }}>{signin}</Text>
    </View>
  )
}

function HomeScreen({ navigation, route }) {
  const [refreshing, setRefreshing] = useState(true);
  const [accessView, setAccessView] = useState("none");
  const [summary, setSummary] = useState({ salesToday: 0, quantity: 0, salesYesterday: 0, percent: 0, totalAwait: 0, available: 0, dataP: [] });
  const dispatch = useDispatch();
  const itemList = useSelector(itemlistSelector);
  const statusList = useSelector(statuslistSelector);
  const orderList = useSelector(orderlistSelector);
  const [user, setUser] = useState({});
  const [signin, setSignin] = useState('');

  useEffect(() => {
    //  console.log('signin', signin);
    navigation.setOptions({ headerRight: () => headerRight(signin) });
    //    let storedLogin = localStorage.getItem(LOGIN_STORAGE);
    //    if (storedLogin) {
    //      storedLogin = storedLogin.replace(/\'/g, '\"');
    //   setUser(JSON.parse(storedLogin));
    //  }
  }, [signin]);



  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(

    useCallback(() => {
      if (route.params?.post)

        loadStoredData();
    }, [route.params?.post])
  );

  const loadStoredData = async () => {
    let storagedPayment = localStorage.getItem(PAYMENT_STORAGE);
    let storagedStatus = localStorage.getItem(STATUS_STORAGE);
    let _storagePayment = [];
    let _storageStatus = [];
    let available = 0;
    let totalAwait = 0;
    let salesToday = 0;
    let quantity = 0;
    let salesYesterday = summary.salesYesterday;
    let dataP = [];
    dataP = summary.dataP.map(item => item);

    if (storagedPayment) {
      storagedPayment = storagedPayment.replace(/\'/g, '\"');
      _storagePayment = JSON.parse(storagedPayment);
      _storagePayment.forEach(item => { quantity++; salesToday += item.total; });
    }
    if (storagedStatus) {
      storagedStatus = storagedStatus.replace(/\'/g, '\"');
      _storageStatus = JSON.parse(storagedStatus);
      _storageStatus.forEach(item => {
        if (item[2] === 1) available++;
        totalAwait += item[3];
      });
    }
    if (dataP.length > 0) {
      dataP[dataP.length - 1].sales = salesToday;
      let percent = ((salesToday / salesYesterday) * 100).toFixed(0) - 100;
      setSummary({ salesToday, quantity, salesYesterday, percent, totalAwait, available, dataP });
    }
    else {
      const report4 = await getReport4();

      dataP = processData(report4);
      salesToday = report4[0].total;
      salesYesterday = report4[1].total;
      let percent = ((salesToday / salesYesterday) * 100).toFixed(0) - 100;
      setSummary({ salesToday, quantity, salesYesterday, percent, totalAwait, available, dataP });
    }
  }

  const loadData = async () => {
    await Promise.all([loadItems(), loadTables()]);
    showMessage({
      message: "Dữ liệu load thành công",
      description: "Load dữ liệu",
      type: "success",
      backgroundColor: "#517fa4",
    });
    setRefreshing(false);
    setAccessView('auto');
  };

  const loadItems = async () => {

    const items = await getItems();
    if (items) {

      localStorage.setItem(ITEM_STORAGE, JSON.stringify(items));

      dispatch(ItemSlice.actions.addItem(items));
    }

  };

  const loadTables = async () => {
    let totalAwait = 0;
    let available = 0;
    let salesToday = 0;
    let salesYesterday = 0;
    let quantity = 0;
    let dataP = [];

    const [tables, payments] = await Promise.all([getTables(), getPayments()]);
    if (payments) {

      dataP = processData(payments.report4);
      salesYesterday = payments.report4[1].total;
      payments.payments.forEach(item => { salesToday += item.total; quantity++; });
      localStorage.setItem(PAYMENT_STORAGE, JSON.stringify(payments.payments));

    }
    if (tables) {

      const status = tables.map(item => [item.sku, item.type, item.status, item.subtotal, item.timestamp, item.name]);
      status.forEach(item => {
        if (item[2] === 1) available++;
        totalAwait += item[3];
      });


      const tableData = tables.reduce((acc, item) => {
        acc[item.type] = item[item.type];
        return acc;
      }, {});
      let percent = ((salesToday / salesYesterday) * 100).toFixed(0) - 100;

      setSummary({ salesToday, quantity, salesYesterday, percent, totalAwait, available, dataP });
      dispatch(statusSlice.actions.addStatus(status));
      dispatch(OrderSlice.actions.table2Order(tableData));

    }

  };

  useEffect(() => {
    localStorage.setItem(STATUS_STORAGE, JSON.stringify(statusList));
  }, [statusList]);

  useEffect(() => {
    localStorage.setItem(SALES_STORAGE, JSON.stringify(orderList));
  }, [orderList]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setAccessView('none');
    loadData();
  }, []);



  const processData = useCallback((data) => {
    if (!data || data.length === 0) {
      return [{ x: '0', y: 0 }];
    } else {
      const d = data.map(item => item);
      d.sort((a, b) => (a._id.localeCompare(b._id)));
      return d.map((item) => {
        if (!item._id || !item.total) {
          return { x: '0', y: 0 };
        } else {
          return {
            day: item._id.substring(0, 5),
            sales: item.total,
          };
        }
      });
    }
  }, [])

  const signed = (sign, GoogleSign) => {

    const insertUser = async () => {
      let dataLogin = await getLogin(sign.email);
      if (dataLogin) {

        setUser(dataLogin);
        //  localStorage.setItem(LOGIN_STORAGE, JSON.stringify(dataLogin));
      } else {

        let date = new Date();
        date = format(date, 'dd/MM/yyyy, HH:mm:ss');
        let data = {
          name: sign.name,
          familyName: sign.familyName,
          givenName: sign.givenName,
          email: sign.email,
          status: 1,
          login: date,
          logout: ''
        };
        //   localStorage.setItem(LOGIN_STORAGE, JSON.stringify(data));
        setUser(data);
        await insertLogin(data);
      }
    }
    insertUser();
    setSignin(sign.email);
    GoogleSignin = GoogleSign;

  };

  const logout = () => {

    const updateUser = async () => {

      let date = new Date();
      date = format(date, 'dd/MM/yyyy, HH:mm:ss');


      try {
        await updateLogout(date, user.login);
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (error) {
        console.log(error);
      } finally { }
      setSignin('');
    }
    updateUser();
  };

  function renderSummary() {

    return (
      <View style={styles.container}>
        <View style={styles.dashboard}>
          <View style={styles.container2}>

            <View style={styles.showcaseContainer}>

              <Text style={styles.totalSalesT}>Tổng doanh thu: {convertNumber(summary.salesToday)}</Text>
              <Icon type='MaterialIcons' name='attach-money' color={COLORS.primary} size={15} />
            </View>
            <View style={styles.showcaseContainer}>
              {
                summary.percent > 0 ?
                  (<Text style={styles.totalSalesT}>Tăng: <Text style={{ color: 'green' }}>{summary.percent}%</Text> <Feather name='trending-up' color={'green'} size={16} /></Text>) :
                  (<Text style={styles.totalSalesT}>Giảm: <Text style={{ color: 'red' }}>{summary.percent}%</Text> <Feather name='trending-down' color={'red'} size={16} /></Text>)
              }
            </View>
            <View style={styles.showcaseContainer}>

              <Text style={styles.totalSalesT}>Tổng số đơn: {summary.quantity}  </Text>
              <FontAwesome5 name='money-bill' size={15} />
            </View>


          </View>
          <View style={styles.container3}>

            <Text style={styles.totalSalesText1}>Số bàn chờ TT: <Text style={{ color: 'red' }}>{summary.available}</Text>/10</Text>


            <Text style={styles.totalSalesText}>Số tiền chờ TT: <Text style={{ color: 'red' }}>{convertNumber(summary.totalAwait)}</Text></Text>

            <TouchableOpacity onPress={() => { navigation.navigate('Payments') }}>
              <Text style={styles.totalSalesText2}>Xem chi tiết đơn </Text>
            </TouchableOpacity>

          </View>


        </View>


        <View style={{ flex: 1 }}>
          {summary.dataP.length > 0 ? (
            <VictoryChart theme={VictoryTheme.material}
              padding={{ left: 72, right: 14, top: 35, bottom: 30 }}
              domainPadding={{ x: 30 }}>
              <VictoryBar
                data={summary.dataP}
                labels={({ datum }) => convertNumber(datum.sales)}
                x="day"
                y="sales"
                style={{ data: { fill: COLORS.primary } }}
              />
            </VictoryChart>) : null}

        </View>
      </View >
    )
  }

  function homeRender() {
    if (JSON.stringify(statusList) === '[]') {
      return (
        <View style={[{ flex: 1, justifyContent: "center" }, styles.horizontal]}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lightGray2 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            title='loading'
            progressBackgroundColor='#79B45D'
            color='#FFFFFF'
            tintColor='#FFFFFF'
          />
        }
      >
        {renderSummary()}

        <View style={{ flex: 0.28, bottom: 0 }} pointerEvents={accessView}>
          <View style={{ flexDirection: 'row' }}>

            <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Tablelist')}>
              <Entypo name='shop' color={'white'} size={27} />
              <Text style={styles.textButton}>Đặt món</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('ItemList')}>
              <Ionicons name='fast-food' color={'white'} size={27} />
              <Text style={styles.textButton}>Quản lý món ăn</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('ReportMenu')}>
              <FontAwesome5 name='chart-line' color={'white'} size={27} />
              <Text style={styles.textButton}>Xem thêm báo cáo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Setting')}>
              <Feather name='settings' color={'white'} size={27} />
              <Text style={styles.textButton}>Cài đặt</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
            <TouchableOpacity style={styles.ButtonLogout} onPress={() => logout()}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 1 }}>
                <AntDesign name='logout' color={'white'} size={20} /><Text style={styles.textButton}> Đăng xuất</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    );
  }

  return (!signin ? <GoogleSignIn signed={signed} /> : homeRender());


}




export default HomeScreen;

const styles = StyleSheet.create({
  Button: {
    width: 192,
    height: 50,
    backgroundColor: '#79B45D',
    alignItems: 'center',
    borderRadius: 14,
    justifyContent: 'center',
    margin: 5

  },
  ButtonLogout: {
    width: 100,
    height: 35,
    backgroundColor: '#4295d6',
    alignItems: 'center',
    borderRadius: 13,
    justifyContent: 'center',
    margin: 5
  },
  textButton: {
    fontSize: 12,
    color: 'white',
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  container: {
    flex: 1,
  },
  dashboard: {
    flexDirection: 'row',
    width: 392,
    height: 128,
    borderRadius: 15,
    // borderWidth: 0.3,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 9,
    backgroundColor: '#e4ede4',
  },
  container2: {
    flex: 0.56,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
    left: 4
  },
  container3: {
    flex: 0.44,
    alignItems: 'flex-start',
    padding: 10,

    right: 2
  },
  totalSalesT: {
    fontSize: 12,

    color: COLORS.primary,
    // marginBottom: 7,
  },
  totalSalesT1: {
    fontSize: 12,

    color: COLORS.primary,
    marginVertical: 4,
  },
  totalSalesText: {
    fontSize: 12,

    color: COLORS.primary,
    marginVertical: 9,
  },
  totalSalesText1: {
    fontSize: 12,

    color: COLORS.primary,
    marginVertical: 8,
  },
  totalSalesText2: {
    fontSize: 12,

    color: COLORS.primary,
    marginVertical: 7,
  },
  comparisonContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // width: '100%',
    marginBottom: 8,
  },
  comparisonText: {


    color: COLORS.secondary,

  },
  showcaseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },

});