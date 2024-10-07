import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import Constants from 'expo-constants';
import { format } from "date-fns";
import { useCallback, useEffect, useState, useRef } from 'react';
import React, { Component } from 'react';
import Order from './order';
import mapping from "./mapping.json";
import { pay, convertNumber, updateStatus, getItems, updateTable, clearTable, getTable, generateInvoiceNumber } from './source/api';
import { useDispatch, useSelector } from 'react-redux';
import orderSlice from './source/redux/orderSlice';
import paymentSlice from './source/redux/paymentSlice';
import salesSlice from './source/redux/salesSlice';
import invoiceSlice from './source/redux/invoiceSlice';
import statusSlice from './source/redux/statusSlice';
import { invoicelistSelector, itemlistSelector, orderlistSelector, statuslistSelector } from './source/redux/selector';
import Dialog from "react-native-dialog";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { COLORS, FONTS, SIZES, icons, images } from './source/constants';
import RenderNavBar from './renderNavBar';
import TabListMenu from './tablistMenu';
import { insertPayment, updateTables } from './source/mongo';
import { checkDate } from "./source/api";
import 'localstorage-polyfill';


// TablistMenu


//const STATUS_STORAGE="STATUS_KEY";
const SALES_STORAGE = "SALES_KEY";
const PAYMENT_STORAGE = "PAYMENT_KEY";
const ITEM_STORAGE = "ITEM_KEY";

export default function Orderdetail({ navigation, route }) {
  const [visible, setVisible] = useState(false);
  const flashMessage = useRef();
  const dispath = useDispatch();


  const [invoice, setInvoice] = useState(useSelector(invoicelistSelector));

  const [paymentList, setPaymentList] = useState([]);
  const orderList = useSelector(orderlistSelector);
  //const itemList = useSelector(itemlistSelector);
  //const [itemList, setItemList] = useState({});
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

    var type = route.params.type.item[1];

    setType(type);
    const storagedSales = localStorage.getItem(SALES_STORAGE);
    if (storagedSales) {
      const _storagedSales = storagedSales.replace(/\'/g, '\"');

      const data = JSON.parse(_storagedSales);
      setSales(data);

    }
    const storagedPayment = localStorage.getItem(PAYMENT_STORAGE);
    if (storagedPayment) {
      const _storagedPayment = storagedPayment.replace(/\'/g, '\"');

      setPaymentList(JSON.parse(_storagedPayment));


    }


    if (typeof orderList[type] == 'undefined' || JSON.stringify(orderList) == '{}') {

      setOrder([]);

    }
    else {

      setOrder(orderList[type]);
    }

    //--Get Item from storage

    //getInvoice
    // TabletoOrder(type);

  }, [orderList]);

  //---SUM----
  useEffect(() => {
    var su = 0;

    order.forEach(orderline => {
      su += parseInt(orderline.price) * parseInt(orderline.quantity);
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

      const time = { timestamp: date };
      let data = sales;
      delete data[type];
      let obj = {};
      let exportData = [];


      order.forEach(orderLine => {
        let orderUpdate;
        if (typeof orderLine.timestamp == 'undefined') { orderUpdate = Object.assign(orderLine, time); }
        else { orderUpdate = orderLine; }
        exportData.push(orderUpdate);

      })

        ;
      if (updateTables(exportData, 1, type, sum, ti, invoice)) {

        setOrder(exportData);
        obj[type] = exportData
        setSales({ ...obj, ...data });
        // dispath(clearOrderAction());
        dispath(orderSlice.actions.addOrder({ ...obj, ...data }));
        dispath(statusSlice.actions.updateStatus({ type: type, status: 1, sumtotal: sum, timestamp: ti }));


        // dispath(orderSlice.table2Order(...obj, ...data));

        // updateTable(exportData, type, date, invoice);


        flashMessage.current.showMessage({
          message: "Đã lưu thành công",
          description: "Lưu",
          type: "success",
          backgroundColor: "#517fa4",
        });
      }
      else {
        flashMessage.current.showMessage({
          message: "Lỗi hệ thống",
          description: "Lưu",
          type: "danger",
          backgroundColor: "#517fa4",
        });
      }
    }

    else {
      //   dispath(addStatus((prevState) =>
      //   prevState.map((status) =>
      //     status[1] === type ? [ ...[status[1]=type,status[2]=0] ] : status
      //   )
      // ));
      // const s =status.map(item=>{if (item[1]===type) {item[2]=0;}; return item});
      // dispath(statusSlice.actions.addStatus(s));
      if (updateTables([], 0, type, 0, "")); //clear table
      {


        //var index = status.map(item => item[1]).indexOf(type);

        //  updateStatus(index, 0, 0, 0);

        if (typeof sales[type] != 'undefined') {
          let data = sales;
          delete data[type];


          setSales({ ...data });
          // dispath(clearOrderAction());
          dispath(orderSlice.actions.addOrder({ ...data }));
          dispath(statusSlice.actions.updateStatus({ type: type, status: 0, sumtotal: 0, timestamp: 0 }));
          //   clearTable(type);

          flashMessage.current.showMessage({
            message: "Đã lưu thành công",
            description: "Lưu",
            type: "success",
            backgroundColor: "#517fa4",
          });
        }
      }

    }

  }, [order, sales, status, sum]);

  //--------Paymnet---
  const renderMsgbox = () => {
    return (
      <View style={styles.Msgbox}>

        <Dialog.Container visible={visible} contentStyle={{ borderRadius: 20, width: 390 }}>

          <Dialog.Title ><Text style={{ color: 'red', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>{mapping.ban[type]}</Text></Dialog.Title>

          <Dialog.Description>
            <Text style={{ color: 'black' }}> Sẽ được thanh toán.</Text>
          </Dialog.Description>
          <Dialog.Button label="Hủy" style={{ ...FONTS.body2, textTransform: 'none' }} onPress={() => setVisible(false)} />
          <Dialog.Button label="OK" style={{ ...FONTS.body2, fontWeight: 'bold', textTransform: 'none' }} onPress={() => payment()} />
        </Dialog.Container>
      </View>
    );
  }
  const paymentAlert = () => {
    setVisible(true);

  }

  /* Alert.alert(mapping.ban[type], 'Sẽ được thanh toán', [
     {
       text: 'Cancel',
       //   onPress: () => console.log('Cancel Pressed'),
       style: 'cancel',
     },
     { text: 'OK', onPress: () => payment() },
   ]);*/

  const payment = useCallback(() => {
    setVisible(false);
    if (order.length > 0) {
      var date = new Date();
      d = format(date, 'MM/dd/yyyy, HH:mm:ss');
      let orderData = order.map(item => item);

      if (JSON.stringify(order[0].timestamp) != undefined) {
        d = checkDate(orderData[0].timestamp);
      }
      else {

        orderData = orderData.map(item => {
          return { ...item, timestamp: d };
        });
      }

      let payment = { timestamp: d, invoice: invoice, total: sum, type: type, paymentType: "", tip: "", sales: orderData };
      const exportData = {
        payment: payment,
        sale: orderData
      }

      const Pay = async () => {
        let getPay = await insertPayment(exportData);
        if (getPay) {


          let paymentListNEW = paymentList;
          paymentListNEW.push(payment);
          localStorage.setItem(PAYMENT_STORAGE, JSON.stringify(paymentListNEW));
          updateTables([], 0, type, 0, "");
          //  dispath(salesSlice.actions.addSales(exportData.sale));

          //   
          dispath(statusSlice.actions.updateStatus({ type: type, status: 0, sumtotal: 0, timestamp: 0 }));

          if (typeof sales[type] != 'undefined') {
            let data = sales;
            delete data[type];
            setSales({ ...data });
            //dispath(clearOrderAction());
            dispath(orderSlice.actions.addOrder({ ...data }));
          }

          //   clearTable(type);

          dispath(invoiceSlice.actions.addinvoice(generateInvoiceNumber()));
          flashMessage.current.showMessage({
            message: "Đã thanh toán thành công",
            description: "Thanh toán",
            type: "success",
            backgroundColor: "#517fa4",
          });
          setOrder([]);
          navigation.navigate("Printer", { day: { d }, order: { order }, type: { type }, sum: { sum } });
        }
        else {
          flashMessage.current.showMessage({
            message: "Lỗi hệ thống",
            description: "Thanh toán",
            type: "danger",
            backgroundColor: "#517fa4",
          });
        }
      }

      Pay();

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
    var sl = parseInt(order[index].quantity) + 1;

    setOrder((prevState) =>
      prevState.map((order, i) =>
        i === index ? { ...order, quantity: sl } : order
      ))

    // setSum(sum - (order[index].price * order[index].quan));
    // setOrder(order.filter((item,i) => i !== index));
  }, [order]);


  //-----minus quantity------
  const minus = useCallback((index) => {
    var sl = parseInt(order[index].quantity) - 1;


    if (sl == 0) deleOrder(index);
    else {
      setOrder((prevState) =>
        prevState.map((order, i) =>
          i === index ? { ...order, quantity: sl } : order
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

          quan = parseInt(orderline.quantity) + 1;
          flag = true;
        }
      });
      if (flag == true) {

        setOrder((prevState) =>
          prevState.map((order) =>
            order.description === items ? { ...order, quantity: quan } : order
          ));

      }


    };

    /* */

    if (flag == false) {

      const obj = { sku: sku.toString(), invoice: invoice, description: items, quantity: quan, price: price, type: type };
      //setOrder([obj,...order,]);
      setOrder([...order, obj,]);

    }

  }, [order]);





  return (

    <View style={{ flex: 1, }}>

      {/* Nav bar section */}
      {/*renderNavBar()*/}
      <RenderNavBar save={save} back={back} paymentAlert={paymentAlert} sum={sum} type={type}></RenderNavBar>
      {renderMsgbox()}
      <View style={styles.main}>

        <View style={styles.orderContent}>
          <View style={[styles.viewOrder, { flex: 0.6 }]}><Text style={styles.menuOrder}>Món ăn</Text></View>
          <View style={[styles.viewOrder, { flex: 0.1 }]} ><Text style={styles.menuOrder}>SL</Text></View>

          <View style={[styles.viewOrder, { flex: 0.3 }]} ><Text style={styles.menuOrder}>TTiền</Text></View>
        </View>
        <View style={styles.order}>
          <Order order={order} deleOrder={deleOrder} plus={plus} minus={minus} />
        </View>



        <TabListMenu addOrder={addOrder} />



        <FlashMessage ref={flashMessage} />

      </View>


    </View>

  );

}

const styles = StyleSheet.create({

  main: {
    flex: 1,

    backgroundColor: COLORS.lightGray2

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

  Msgbox: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',

  },


});
