import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { getPayToday, getSales, getInvoice, getItems, getStatus, getTable, table2Order } from './source/api';
import { useDispatch, useSelector } from 'react-redux';
//import { addInvoiceAction, addItemAction,addReportPayment,addReportSales,addStatus,table2Order,addReport8} from './source/redux/action';

import { itemlistSelector, orderlistSelector, statuslistSelector } from './source/redux/selector';
import { useEffect, useCallback, useState, useRef } from 'react';
import { COLORS, FONTS, SIZES, icons, } from './source/constants';
import { url } from "@env";

import 'localstorage-polyfill';
import ItemSlice, { fetchItems } from './source/redux/itemSlice';
import OrderSlice from './source/redux/orderSlice';
import statusSlice, { fetchStatus } from './source/redux/statusSlice';
//import invoiceSlice, { fetchInvoice } from './source/redux/invoiceSlice';
import salesSlice from './source/redux/salesSlice';
import paymentSlice from './source/redux/paymentSlice';


import { showMessage, hideMessage } from "react-native-flash-message";

const ITEM_STORAGE = "ITEM_KEY";
const STATUS_STORAGE = "STATUS_KEY";
const SALES_STORAGE = "SALES_KEY";

function HomeScreen({ navigation, route }) {

  const [refreshing, setRefreshing] = useState(true);
  const dispath = useDispatch();
  const itemList = useSelector(itemlistSelector);
  const statusList = useSelector(statuslistSelector);
  const orderList = useSelector(orderlistSelector);
  const [accessView, setAccessView] = useState("none");




  useEffect(() => {
    if (route.params?.post) { setRefreshing(false); setAccessView('auto'); }
    else {

      const storagedItem = localStorage.getItem(ITEM_STORAGE);

      if (storagedItem === '{}' || typeof storagedItem === 'undefined' || storagedItem === null) {
        reloadItem();
      }
      else {
        if (storagedItem) {
          const _storagedItem = storagedItem.replace(/\'/g, '\"');

          dispath(ItemSlice.actions.addItem(JSON.parse(_storagedItem)));
        }
      }
      const storagedStatus = localStorage.getItem(STATUS_STORAGE);

      if (storagedStatus === '[]' || typeof storagedStatus === 'undefined' || storagedStatus === null) {
        reloadTable();
      }
      else {
        if (storagedStatus) {
          const _storagedStatus = storagedStatus.replace(/\'/g, '\"');
          dispath(statusSlice.actions.addStatus(JSON.parse(_storagedStatus)));
        }
      }
    }
    // loadInvoice(); 
    // getPaymentList();
  }, []);

  const reloadItem = () => {
    // let abortController = new AbortController();
    // let aborted = abortController.signal.aborted; // true || false
    // let data = async () => {
    // const d= (await getItems());
    // aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
    // if (aborted === false){  
    // dispath(ItemSlice.actions.addItem(d));
    // }
    // }
    // data();
    // return () => {
    // abortController.abort();
    // };      
    dispath(fetchItems());
  }

  const reloadTable = () => {
    let abortController = new AbortController();
    let aborted = abortController.signal.aborted; // true || false
    let data = async () => {
      const D = (await getStatus()); // get status table
      const E = (await getSales()); //get sales today
      const B = (await getPayToday()); //get payment today
      aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
      if (aborted === false) {

        if (JSON.stringify(B.R1) != '[[null]]' && JSON.stringify(B.R1) != '[null]')  //item in array undefined
        {
          dispath(paymentSlice.actions.addReportPayment(B.R1.reverse()));
          dispath(salesSlice.actions.addReportSales(E.reverse()));
        }
        dispath(statusSlice.actions.addStatus(D));
        //  getPaymentList();
        reloadOrderTable(D);


      }
    }
    data();
    return () => {


      abortController.abort();

    };





    //  reloadOrderTable();
  };

  const reloadOrderTable = (d) => {

    d = d.filter(item => item[2] == 1);

    let promises = [];
    d.forEach(item => {

      promises.push(fetch(`${url}?action=getTables&table=${item[1]}`).then(async (data) => {

        let d = await data.json();
        let b = {};
        b[item[1]] = table2Order(d.table);
        //  console.log(b[item[1]]);
        dispath(OrderSlice.actions.table2Order((b)));

        return b;
      }));
    });

    Promise.all(promises)
      .then((data) => {
        if (data.length == 0) {

          showMessage({
            message: "Không có dữ liệu",
            description: "Load dữ liệu",
            type: "info",

          })
          setRefreshing(false);
          setAccessView('auto');
        } else {

          showMessage({
            message: "Dữ liệu load thành công",
            description: "Load dữ liệu",
            type: "success",
            backgroundColor: "#517fa4",

          })
          setRefreshing(false);
          setAccessView('auto');
        }
      })
      .catch((error) => {

        showMessage({
          message: error,
          description: "Load dữ liệu",
          type: "danger",


        })
        setRefreshing(false);
        setAccessView('auto');
      });
    /*
        statusList.map(item => {
          if (item[2] == 1) {
            TabletoOrder(item[1]);
    
          }
        });*/
  };

  /*const TabletoOrder = (table) => {

    let abortController = new AbortController();
    let aborted = abortController.signal.aborted; // true || false
    let data = async () => {
      let d = (await getTable(table));

      aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
      if (aborted === false) {
        let b = {};
        b[table] = d;
        //  console.log(b);
        dispath(OrderSlice.actions.table2Order((b)));

      }
      //console.log("false");
    }
    data();
    return () => {
      abortController.abort();
    };
  }

  const loadInvoice = () => {

    // let abortController = new AbortController();
    // let aborted = abortController.signal.aborted; // true || false
    // let data = async () => {
    // let e =(await getInvoice());
    // aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
    //     if (aborted === false){  
    //        dispath(invoiceSlice.actions.addinvoice(e[1]));
    //     }
    //     }
    //     data();
    //     return () => {
    //     abortController.abort();
    //     };  
    //  dispath(fetchInvoice());
  }

  const getPaymentList = () => {
    let abortController = new AbortController();
    let aborted = abortController.signal.aborted; // true || false
    let data = async () => {
      let d = (await getSales());
      let b = (await getPayToday());

      aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
      if (aborted === false) {


        // console.log("Paytoday:", JSON.stringify([undefined])); // Array[[undefined]]
        if (JSON.stringify(b.R1) != '[[null]]' && JSON.stringify(b.R1) != '[null]') {

          dispath(paymentSlice.actions.addReportPayment(b.R1.reverse()));
          dispath(salesSlice.actions.addReportSales(d.reverse()));
        }


      }
    }
    data();
    return () => {

      abortController.abort();
    };
  }
*/
  useEffect(() => {

    localStorage.setItem(ITEM_STORAGE, JSON.stringify(itemList));
  }, [itemList]);
  useEffect(() => {

    localStorage.setItem(STATUS_STORAGE, JSON.stringify(statusList));
  }, [statusList]);

  useEffect(() => {
    //  console.log(orderList);
    localStorage.setItem(SALES_STORAGE, JSON.stringify(orderList));
  }, [orderList]);

  useEffect(() => {
    if (statusList != null || typeof statusList !== 'undefined') {
      // reloadOrderTable();
    }
  }, [statusList]);

  /*
  useEffect(() => {
    //console.log(route.params?.post);
    //getPaymentList();

  }, [route.params?.post]);
  */



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setAccessView('none');
    wait(60000).then(() => { setRefreshing(false); setAccessView('auto'); });
  }, []);

  const wait = (timeout) => {
    reloadItem();
    reloadTable();
    //reloadOrderTable();

    return new Promise(resolve => setTimeout(resolve, timeout));
  }


  if (JSON.stringify(itemList) == '{}') {
    return (
      // <View style={{flex:1,  alignItems: 'center',flexDirection:'row', justifyContent:'center',backgroundColor:COLORS.white}}>
      //   <Text>Loading...</Text>
      // </View>
      <View style={[{ flex: 1, justifyContent: "center" }, styles.horizontal]}>

        <ActivityIndicator size="large" color="#00ff00" />

      </View>
    )
  }
  else {
    return (
      <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lightGray2 }} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          title='loading'
          progressBackgroundColor='#79B45D'
          color='#FFFFFF'
          tintColor='#FFFFFF'

        />}>
        <View pointerEvents={accessView}>
          <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Tablelist', route.params.post ? { post: false } : { post: true })}>
            <Text style={styles.textButton}>Đặt món</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Payments')}>
            <Text style={styles.textButton}>Đơn đã thanh toán</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('ReportMenu')}>
            <Text style={styles.textButton}>Báo cáo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('ItemList')}>
            <Text style={styles.textButton}>Quản lý món ăn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Setting')}>
            <Text style={styles.textButton}>Cài đặt Server</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  Button: {
    width: 260,
    height: 60,

    backgroundColor: '#79B45D',
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 15
  },
  textButton: {
    fontSize: 25,
    color: 'white',
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});