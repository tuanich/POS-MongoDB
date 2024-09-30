import { StyleSheet, Text, View, Alert } from 'react-native';
import Constants from 'expo-constants';
import { format } from "date-fns";
import { useCallback, useEffect, useState, useRef } from 'react';
import React, { Component } from 'react';
import Order from './order';
import { pay, convertNumber, updateStatus, getItems, updateTable, clearTable, getTable, generateInvoiceNumber } from './source/api';
import { useDispatch, useSelector } from 'react-redux';
import orderSlice from './source/redux/orderSlice';
import paymentSlice from './source/redux/paymentSlice';
import salesSlice from './source/redux/salesSlice';
import invoiceSlice from './source/redux/invoiceSlice';
import statusSlice from './source/redux/statusSlice';
import { invoicelistSelector, itemlistSelector, orderlistSelector, statuslistSelector } from './source/redux/selector';

import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { COLORS, FONTS, SIZES, icons, images } from './source/constants';
import RenderNavBar from './renderNavBar';
import TabListMenu from './tablistMenu'

import 'localstorage-polyfill';

// TablistMenu


//const STATUS_STORAGE="STATUS_KEY";
const SALES_STORAGE = "SALES_KEY";

export default function Orderdetail({ navigation, route }) {
  const flashMessage = useRef();
  const dispath = useDispatch();

  const [invoice, setInvoice] = useState(useSelector(invoicelistSelector));


  const orderList = useSelector(orderlistSelector);
  const itemList = useSelector(itemlistSelector);
  const [type, setType] = useState();
  const status = useSelector(statuslistSelector);

  // const [status, setStatus] = useState();

  // const [it, setItem] = useState();
  //  const [tab, setTab]= useState(1);
  const [order, setOrder] = useState([]);
  const [sales, setSales] = useState({ '': [] });
  const [sum, setSum] = useState(0);

  useEffect(() => {
    var type = route.params.type.item[1];

    if (invoice == '') {

      setInvoice(orderList[type][0].invoice)
    }

  }, [invoice]);



  const back = () => {
    navigation.navigate("Tablelist",
      { p: { status } });
  }

  ///-----------------renderNavBar




  useEffect(() => {
    //  console.log("------");

    var type = route.params.type.item[1];
    // console.log(orderList);
    // console.log(`orderlist2:${orderList[type]}`);
    setType(type);
    const storagedSales = localStorage.getItem(SALES_STORAGE);
    if (storagedSales) {
      const _storagedSales = storagedSales.replace(/\'/g, '\"');

      const data = JSON.parse(_storagedSales);
      setSales(data);
      // console.log(data);
    }


    if (typeof orderList[type] == 'undefined' || JSON.stringify(orderList) == '{}') {

      setOrder([]);

    }
    else {

      setOrder(orderList[type]);
    }

    //--Status  
    // const storagedStatus = localStorage.getItem(STATUS_STORAGE);
    // if (storagedStatus)
    // {setStatus(JSON.parse(storagedStatus)); }


    // setItem(itemList.Item);
    //getInvoice
    // TabletoOrder(type);

  }, [orderList]);

  //---SUM----
  useEffect(() => {
    var su = 0;

    order.forEach(orderline => {
      su += parseInt(orderline.price) * parseInt(orderline.quan);
    });
    setSum(su);
  }, [order]);

  //-----Sales-----
  useEffect(() => {

    localStorage.setItem(SALES_STORAGE, JSON.stringify(sales));

  }, [sales]);



  //--------Status-----------------
  // useEffect(() => {
  //   localStorage.setItem(STATUS_STORAGE, JSON.stringify(status));

  // }, [status]);

  //-------------Items---------------------------
  // useEffect(() => {
  //   localStorage.setItem(ITEM_STORAGE, JSON.stringify(dataItem));
  // }, [dataItem]);

  ///------Save-------
  const save = useCallback(() => {

    // const data=order.filter (ord => ord.type === type);
    if (order.length > 0) {
      var date = new Date();
      const ti = format(date, 'HH:mm:ss');
      date = format(date, 'MM/dd/yyyy, HH:mm:ss');

      const time = { timeStamp: date };


      //update status
      //   dispath(addStatus((prevState) =>
      //   prevState.map((status) =>
      //     status[1] === type ? [ ...[status[1]=type,status[2]=1] ] : status
      //   )
      // ));

      // const s =status.map(item=>{if (item[1]===type) {item[2]=1;}; return item});

      // dispath(statusSlice.actions.addStatus(s));

      dispath(statusSlice.actions.updateStatus({ type: type, status: 1, sumtotal: sum, timestamp: ti }));

      var index = status.map(item => item[1]).indexOf(type);
      //var index = status.findIndex(item => item[0] === type);
      //console.log(index);
      //console.log(status[0].indexOf(type));
      updateStatus(index, 1, sum, ti);
      //////////

      let data = sales;

      delete data[type];

      let obj = {};



      // var options={hour12:false,year:'numeric',month:'2-digit',day:'2-digit',hour:'numeric',minute:'numeric',second:'numeric'};
      //
      // date = date.toLocaleString('en-US', options);

      let exportData = [];
      // console.log(order);

      order.forEach(orderLine => {

        let orderUpdate;
        if (typeof orderLine.timeStamp == 'undefined') { orderUpdate = Object.assign(orderLine, time); }
        else { orderUpdate = orderLine; }

        exportData.push(orderUpdate);

      })

      setOrder(exportData);
      obj[type] = exportData;

      setSales({ ...obj, ...data });
      // dispath(clearOrderAction());
      dispath(orderSlice.actions.addOrder({ ...obj, ...data }));
      // console.log({ ...obj, ...data });

      // dispath(orderSlice.table2Order(...obj, ...data));

      updateTable(exportData, type, date, invoice);
      flashMessage.current.showMessage({
        message: "Đã lưu thành công",
        description: "Lưu",
        type: "success",
        backgroundColor: "#517fa4",
      });
    }

    else {
      //   dispath(addStatus((prevState) =>
      //   prevState.map((status) =>
      //     status[1] === type ? [ ...[status[1]=type,status[2]=0] ] : status
      //   )
      // ));
      // const s =status.map(item=>{if (item[1]===type) {item[2]=0;}; return item});
      // dispath(statusSlice.actions.addStatus(s));

      dispath(statusSlice.actions.updateStatus({ type: type, status: 0, sumtotal: 0, timeStamp: 0 }));

      var index = status.map(item => item[1]).indexOf(type);
      updateStatus(index, 0, 0, 0);
      if (typeof sales[type] != 'undefined') {
        let data = sales;
        delete data[type];


        setSales({ ...data });
        // dispath(clearOrderAction());
        dispath(orderSlice.actions.addOrder({ ...data }));
        clearTable(type);
        flashMessage.current.showMessage({
          message: "Đã lưu thành công",
          description: "Lưu",
          type: "success",
          backgroundColor: "#517fa4",
        });
      }

    }
  }, [order, sales, status, sum]);

  //--------Paymnet---
  const paymentAlert = () =>
    Alert.alert(type, 'Sẽ được thanh toán', [
      {
        text: 'Cancel',
        //   onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => payment() },
    ]);

  const payment = useCallback(() => {
    if (order.length > 0) {

      const paym = pay(order, type, sum, invoice);
      const s = paym['order'];
      const p = paym['payment'];
      const day = paym['day'];
      dispath(salesSlice.actions.addSales(s));
      dispath(paymentSlice.actions.addpayment(p));

      // dispath(addStatus((prevState) =>
      // prevState.map((status) =>
      //   status[1] === type ? [ ...[status[1]=type,status[2]=0] ] : status
      // )));
      // const st =status.map(item=>{if (item[1]===type) {item[2]=0;}; return item});
      // dispath(statusSlice.actions.addStatus(st));

      dispath(statusSlice.actions.updateStatus({ type: type, status: 0, sumtotal: 0, timestamp: 0 }));

      var index = status.map(item => item[1]).indexOf(type);
      updateStatus(index, 0, 0, 0);
      navigation.navigate("Printer", { day: { day }, order: { order }, type: { type }, sum: { sum } });
      // setOrder([]);
      if (typeof sales[type] != 'undefined') {
        let data = sales;
        delete data[type];
        setSales({ ...data });
        //dispath(clearOrderAction());
        dispath(orderSlice.actions.addOrder({ ...data }));
      }

      clearTable(type);

      dispath(invoiceSlice.actions.addinvoice(generateInvoiceNumber()));
      flashMessage.current.showMessage({
        message: "Đã thanh toán thành công",
        description: "Thanh toán",
        type: "success",
        backgroundColor: "#517fa4",
      });

    }

  }, [order, sales, status, sum])




  //------ Tab ------



  //-----Delete oreder------
  const deleOrder = useCallback((index) => {


    // setSum(sum - (order[index].price * order[index].quan));
    setOrder(order.filter((item, i) => i !== index));
  }, [order]);

  //-----plus quantity------
  const plus = useCallback((index) => {
    var sl = parseInt(order[index].quan) + 1;

    setOrder((prevState) =>
      prevState.map((order, i) =>
        i === index ? { ...order, quan: sl } : order
      ))

    // setSum(sum - (order[index].price * order[index].quan));
    // setOrder(order.filter((item,i) => i !== index));
  }, [order]);


  //-----minus quantity------
  const minus = useCallback((index) => {
    var sl = parseInt(order[index].quan) - 1;


    if (sl == 0) deleOrder(index);
    else {
      setOrder((prevState) =>
        prevState.map((order, i) =>
          i === index ? { ...order, quan: sl } : order
        ))
    }


    // setSum(sum - (order[index].price * order[index].quan));
    // setOrder(order.filter((item,i) => i !== index));
  }, [order]);

  ///-----Add order --------
  const addOrder = useCallback((sku, items, price) => {
    var quan = 1;
    var flag = false;
    var su = 0;

    if (order.length > 0) {

      order.forEach(orderline => {

        if (orderline.description == items) {

          quan = parseInt(orderline.quan) + 1;
          flag = true;
        }
      });
      if (flag == true) {

        setOrder((prevState) =>
          prevState.map((order) =>
            order.description === items ? { ...order, quan: quan, price: price } : order
          ));

      }


    };

    /* */

    if (flag == false) {

      const obj = { sku: sku, description: items, quan: quan, price: price };
      //setOrder([obj,...order,]);
      setOrder([...order, obj,]);

    }

  }, [order]);




  if (itemList == null) {

    return (
      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </View>)
  }
  else {
    return (

      <View style={{ flex: 1, }}>

        {/* Nav bar section */}
        {/*renderNavBar()*/}
        <RenderNavBar save={save} back={back} paymentAlert={paymentAlert} sum={sum} type={type}></RenderNavBar>
        <View style={styles.main}>

          <View style={styles.orderContent}>
            <View style={[styles.viewOrder, { flex: 0.6 }]}><Text style={styles.menuOrder}>Món ăn</Text></View>
            <View style={[styles.viewOrder, { flex: 0.1 }]} ><Text style={styles.menuOrder}>SL</Text></View>

            <View style={[styles.viewOrder, { flex: 0.3 }]} ><Text style={styles.menuOrder}>TTiền</Text></View>
          </View>
          <View style={styles.order}>
            <Order order={order} deleOrder={deleOrder} plus={plus} minus={minus} />
          </View>



          <TabListMenu itemList={itemList} addOrder={addOrder} />



          <FlashMessage ref={flashMessage} />

        </View>


      </View>

    );
  }
}

const styles = StyleSheet.create({

  main: {
    flex: 1,



  },


  order: {
    flex: 1,

  },

  orderContent: {
    flexDirection: 'row',
    //   flexWrap:'wrap',
    //  flex:1,
    //  justifyContent:'center',
  },
  menuOrder: {


    fontSize: 18,
    color: 'white',
    padding: 1,

  },
  viewOrder: {
    backgroundColor: '#5E8D48',
    borderWidth: 0.2,
    borderColor: 'white',
    alignItems: 'center',
    // fontSize: 18,
    // color:'white',
  },



});
