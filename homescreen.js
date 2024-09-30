import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { getPayment, getSales, getInvoice, getItems, getStatus, getTable, table2Order } from './source/api';
import { useDispatch, useSelector } from 'react-redux';
//import { addInvoiceAction, addItemAction,addReportPayment,addReportSales,addStatus,table2Order,addReport8} from './source/redux/action';

import { itemlistSelector, orderlistSelector, statuslistSelector } from './source/redux/selector';
import { useEffect, useCallback, useState, useRef } from 'react';
import { COLORS, FONTS, SIZES, icons, images } from './source/constants/';
import { url } from "@env";

import 'localstorage-polyfill';
import ItemSlice, { fetchItems } from './source/redux/itemSlice';
import OrderSlice from './source/redux/orderSlice';
import statusSlice, { fetchStatus } from './source/redux/statusSlice';
//import invoiceSlice, { fetchInvoice } from './source/redux/invoiceSlice';
import salesSlice from './source/redux/salesSlice';
import paymentSlice from './source/redux/paymentSlice';
import report8Slice from './source/redux/report8Slice';

import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

const ITEM_STORAGE = "ITEM_KEY";
const STATUS_STORAGE = "STATUS_KEY";
const SALES_STORAGE = "SALES_KEY";

function HomeScreen({ navigation, route }) {
  const flashMessage = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const dispath = useDispatch();
  const itemList = useSelector(itemlistSelector);
  const statusList = useSelector(statuslistSelector);
  const orderList = useSelector(orderlistSelector);



  useEffect(() => {

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

    // loadInvoice(); 
    getPaymentList();
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
      const d = (await getStatus());
      aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
      if (aborted === false) {


        dispath(statusSlice.actions.addStatus(d));
        reloadOrderTable(d);

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
        //console.log(item[1]);
        let d = await data.json();
        let b = {};
        b[item[1]] = table2Order(d.table);
        dispath(OrderSlice.actions.table2Order((b)));

        return b;
      }));
    });

    Promise.all(promises)
      .then((data) => {
        if (data.length == 0) {
          flashMessage.current.showMessage({
            message: "Không có dữ liệu",
            description: "Load dữ liệu",
            type: "info",

          })
        } else {
          flashMessage.current.showMessage({
            message: "Dữ liệu load thành công",
            description: "Load dữ liệu",
            type: "success",
            backgroundColor: "#517fa4",

          })
        }
      })
      .catch((error) => {
        flashMessage.current.showMessage({
          message: error,
          description: "Load dữ liệu",
          type: "danger",


        })
      });
    /*
        statusList.map(item => {
          if (item[2] == 1) {
            TabletoOrder(item[1]);
    
          }
        });*/
  };

  const TabletoOrder = (table) => {

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
      let b = (await getPayment());

      aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
      if (aborted === false) {
        dispath(salesSlice.actions.addReportSales(d.reverse()));
        dispath(paymentSlice.actions.addReportPayment(b.R1.reverse()));
        dispath(report8Slice.actions.addReport8(b.R3));

      }
    }
    data();
    return () => {
      abortController.abort();
    };
  }

  useEffect(() => {

    localStorage.setItem(ITEM_STORAGE, JSON.stringify(itemList));
  }, [itemList]);
  useEffect(() => {

    localStorage.setItem(STATUS_STORAGE, JSON.stringify(statusList));
  }, [statusList]);
  useEffect(() => {
    //console.log(orderList);
    localStorage.setItem(SALES_STORAGE, JSON.stringify(orderList));
  }, [orderList]);

  useEffect(() => {
    if (statusList != null || typeof statusList !== 'undefined') {
      // reloadOrderTable();
    }
  }, [statusList]);

  useEffect(() => {
    getPaymentList();

  }, [route.params?.post]);



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  const wait = (timeout) => {
    reloadItem();
    reloadTable();
    //reloadOrderTable();
    getPaymentList();
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
      <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          title='loading'
          progressBackgroundColor='#79B45D'
          color='#fff'
          tintColor='#fff'
        />}>
        <View >
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
        <FlashMessage ref={flashMessage} />
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