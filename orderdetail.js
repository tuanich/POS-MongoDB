
import { StyleSheet, Text, View,TouchableOpacity,ActivityIndicator,ScrollView,RefreshControl,Image} from 'react-native';
import Constants from 'expo-constants';
import { format } from "date-fns";
import Data from './Data';
import { useCallback, useEffect, useState,useLayoutEffect,useRef} from 'react';
import React, { Component } from 'react';
import Order from './order';
import { HeaderBackButton } from '@react-navigation/elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSave,faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import {pay,convertNumber,updateStatus,getItems,updateTable,clearTable,getTable,generateInvoiceNumber} from './source/api';
import { useDispatch,useSelector } from 'react-redux';
//import { addOrderAction, addPaymentAction, addSalesAction,addInvoiceAction,addItemAction,addStatus,table2Order} from './source/redux/action';
import orderSlice from './source/redux/orderSlice';
import paymentSlice from './source/redux/paymentSlice';
import salesSlice from './source/redux/salesSlice';
import invoiceSlice from './source/redux/invoiceSlice';
import itemSlice from './source/redux/itemSlice';
import statusSlice from './source/redux/statusSlice';


import {invoicelistSelector, itemlistSelector, orderlistSelector,statuslistSelector} from './source/redux/selector';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import { COLORS, FONTS, SIZES, icons, images } from './source/constants';

import 'localstorage-polyfill'; 

function TabListMenu({itemList,addOrder})
{ 
  const [tab, setTab]= useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [IT, setItem] = useState(itemList.Item);

  const setValueItem = useCallback((tab)=>{
 
    if (tab==1){
    setTab(1);  
    setItem(itemList.Item);}
    if (tab==2){
      setTab(2); 
      setItem(itemList.Drink);}
    if (tab==3){
      setTab(3); 
        setItem(itemList.Other);}
  
   },[tab,itemList]);
   const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    
  }, []);
  
  const wait = (timeout) => {
    reloadItem();
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const reloadItem = ()=>{
    let abortController = new AbortController();
    let aborted = abortController.signal.aborted; // true || false
    
    let data = async () => {
    
      const d= (await getItems());
    aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
    if (aborted === false){  
     
      dispath(itemSlice.actions.addItem(d));
      setValueItem(1);
      setItem(d.Item);
    }
    }
    data();
    return () => {
    abortController.abort();
    };      
    }
  return(
    <View style={styles.menu}>
    <View style={styles.tablist}>
          <TouchableOpacity onPress={()=>{setValueItem(1)}}>
            <View style={[styles.tabMenu,{backgroundColor: tab === 1 ? '#5E8D48' : '#79B45D'}]}>
          <Text style={styles.tabItem}>Món ăn</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{setValueItem(2)}}>
          <View style={[styles.tabMenu,{backgroundColor: tab === 2 ? '#5E8D48' : '#79B45D'}]}>
          <Text style={styles.tabItem}>Thức uống</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{setValueItem(3)}}>
          <View style={[styles.tabMenu,{backgroundColor: tab === 3 ? '#5E8D48' : '#79B45D'}]}>
          <Text style={styles.tabItem}>Khác</Text>
          </View>
          </TouchableOpacity>
         
        </View>
          <View style={styles.menulist}>
    
          <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          title='loading'
        />}> 
        <Data item={IT} addOrder={addOrder} />  
        </ScrollView>  
        </View>
        </View>
  )

}


//const STATUS_STORAGE="STATUS_KEY";
const SALES_STORAGE="SALES_KEY";

export default function Orderdetail({ navigation, route }) {
  const dispath =useDispatch();
  const invoice = useSelector(invoicelistSelector);
 
  const orderList =useSelector(orderlistSelector);
  const itemList =useSelector(itemlistSelector);
  const [type, setType] = useState();
  const status = useSelector(statuslistSelector);
 // const [status, setStatus] = useState();

 // const [it, setItem] = useState();
//  const [tab, setTab]= useState(1);
  const [order, setOrder] =  useState([]);
  const [sales, setSales] =  useState({'':[]});
  const [sum, setSum] = useState(0);
 

  // useEffect(() => {
  //   setType(route.params.type.item[1]); 
    // navigation.setOptions({
      
    //   headerTitle: ()=>(<View style={styles.headerTT}>
      
    //   <TouchableOpacity onPress={()=>save()}>
    //    <View style={styles.Save}><FontAwesomeIcon icon={faSave} size={28} color='white'/></View> 
    //    </TouchableOpacity>
    //     <TouchableOpacity onPress={()=>payment()}> 
    //   <View style={styles.Bill}><FontAwesomeIcon icon={faMoneyBillWave} size={28} color='white'/></View>
    //   </TouchableOpacity> 
    //   <View style={styles.header}><Text style={{color:COLORS.white, ...FONTS.h2 }}>{type}</Text></View>
    //   </View>),
      
    //   headerRight: ()=>(<Text style={styles.back}>{sum===0?'':convertNumber(sum)}</Text>) , 
    //   headerLeft: ()=> (
    //     <View style={styles.backView}>
    //    <HeaderBackButton tintColor='#fff' customTintColor='#fff' onPress={()=>back()} />
    //     </View>
    //     ),
     
    // });
  // }, [navigation, type,sum]);
  // const TabletoOrder = (table)=>{
    
  //   let abortController = new AbortController();
  //   let aborted = abortController.signal.aborted; // true || false
  //   let data = async () => {
  //       let d =(await getTable(table));
  //       aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
  //       if (aborted === false){  
  //       if (typeof d!='undefined'){
  //         let b={};
  //       b[table]=d;
  //       dispath(table2Order(b));
        
  //       setOrder(d);   
  //       }
  //       }
  //       }
  //       data();
  //       return () => {
  //       abortController.abort();
  //       };  
  // }

  const back =()=>{
    navigation.navigate("Order",
                        {p: {status} });
  }

  function renderNavBar() {
    return (
        <View
            style={{
                flexDirection: 'row',
                height: 80,
                justifyContent: 'space-between',
                alignItems: 'flex-end',
            //    paddingHorizontal: SIZES.padding,
                backgroundColor: '#79B45D',
            }}
        >
            <TouchableOpacity
                style={{ justifyContent: 'center', width: 50, padding:10 }}
                onPress={() => back()}
            >
                <Image
                    source={icons.back_arrow}
                    style={{
                        width: 25,
                        height: 25,
                        tintColor: COLORS.white
                    }}
                />
            </TouchableOpacity>
            <View style={{flex:1,flexDirection:'row',marginBottom:6}}>
             
             {/* <View style={styles.headerTT}> */}
             <TouchableOpacity style={styles.Save} onPress={()=>save()}>
             <View ><FontAwesomeIcon icon={faSave} size={28} color='white'/></View> 
             </TouchableOpacity>
             <TouchableOpacity style={styles.Bill} onPress={()=>payment()}> 
              <View ><FontAwesomeIcon icon={faMoneyBillWave} size={28} color='white'/></View>
              </TouchableOpacity> 
              {/* </View> */}

            
              <View style={styles.header}>
                  <Text style={{color:COLORS.white, ...FONTS.h2 }}>{type}</Text>
              </View>
              
          
            
              <View style={styles.Sum}>
                <View style={{flex:1,alignItems:'flex-end'}}>
              <Text style={{color:COLORS.white, ...FONTS.h2 }}>{sum===0?'':convertNumber(sum)}</Text>
              </View>
              
        
               </View>
         
        
        </View>
        </View>
           
    )
  }

  
  useEffect(() => {
  //  console.log("------");
    
    var type=route.params.type.item[1];
  //  console.log(`orderlist:${orderList[type]}`);
    setType(type);
     const storagedSales = localStorage.getItem(SALES_STORAGE);
     if (storagedSales)
      { const data= JSON.parse(storagedSales);
        setSales(data);
    } 
    
   
    if (typeof orderList[type] =='undefined' || JSON.stringify(orderList)=='{}')
    { 
     
     setOrder([]);
      
  }
  else
  {
   
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
  useEffect(()=>{
    var su=0;
    
    order.forEach (orderline => {
      su+=parseInt(orderline.subtotal);
    });
    setSum(su);
  },[order]);

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
 const save = useCallback(() =>{
  // const data=order.filter (ord => ord.type === type);
   if (order.length>0){
  
    //update status
  //   dispath(addStatus((prevState) =>
  //   prevState.map((status) =>
  //     status[1] === type ? [ ...[status[1]=type,status[2]=1] ] : status
  //   )
  // ));
  
  // const s =status.map(item=>{if (item[1]===type) {item[2]=1;}; return item});
 
  // dispath(statusSlice.actions.addStatus(s));
   
     dispath(statusSlice.actions.updateStatus({type:type,status:1}));

  var index=status.map(item=>item[1]).indexOf(type);
  //var index = status.findIndex(item => item[0] === type);
  //console.log(index);
  //console.log(status[0].indexOf(type));
   updateStatus(index,1); 
//////////
   
    let data=sales;
    
    delete data[type];
   
    let obj={};
    

    var date = new Date();
    // var options={hour12:false,year:'numeric',month:'2-digit',day:'2-digit',hour:'numeric',minute:'numeric',second:'numeric'};
    //
    // date = date.toLocaleString('en-US', options);
    date= format(date,'MM/dd/yyyy, HH:mm:ss');
	  const time ={timeStamp:date};
    let exportData = [];
   // console.log(order);
    
      order.forEach(orderLine => {
        
         let orderUpdate;
         if (typeof orderLine.timeStamp=='undefined')
        { orderUpdate=Object.assign(orderLine,time);}
        else
        {orderUpdate = orderLine;}

          exportData.push(orderUpdate);
          
      })
     
    setOrder(exportData);  
    obj[type]=exportData;

    setSales({...obj,...data});
   // dispath(clearOrderAction());
    dispath(orderSlice.actions.addOrder({...obj,...data}));
    updateTable(exportData,type,date);
    showMessage({
      message: "Đã lưu thành công",
      description: "Lưu",
      type: "success",
    });  
  }
  
  else{
  //   dispath(addStatus((prevState) =>
  //   prevState.map((status) =>
  //     status[1] === type ? [ ...[status[1]=type,status[2]=0] ] : status
  //   )
  // ));
  // const s =status.map(item=>{if (item[1]===type) {item[2]=0;}; return item});
  // dispath(statusSlice.actions.addStatus(s));

  dispath(statusSlice.actions.updateStatus({type:type,status:0}));
  
  var index=status.map(item=>item[1]).indexOf(type);
  updateStatus(index,0);
  if (typeof sales[type] !='undefined')
   {
    let data=sales;
    delete data[type];
    
   
    setSales({...data});
   // dispath(clearOrderAction());
    dispath(orderSlice.actions.addOrder({...data}));
    clearTable(type);
    showMessage({
      message: "Đã lưu thành công",
      description: "Lưu",
      type: "success",
    });  
  }

  }
 },[order,sales,status]);

//--------Paymnet---
const payment = useCallback(() =>{
  if (order.length>0){
    
    const paym=pay(order,type,sum,invoice);
    const s =paym['order'];
    const p =paym['payment'];
    const day=paym['day'];
    dispath(salesSlice.actions.addSales(s));
    dispath(paymentSlice.actions.addpayment(p));
    
    // dispath(addStatus((prevState) =>
    // prevState.map((status) =>
    //   status[1] === type ? [ ...[status[1]=type,status[2]=0] ] : status
    // )));
    // const st =status.map(item=>{if (item[1]===type) {item[2]=0;}; return item});
    // dispath(statusSlice.actions.addStatus(st));

    dispath(statusSlice.actions.updateStatus({type:type,status:0}));

    var index=status.map(item=>item[1]).indexOf(type);
    updateStatus(index,0);
    navigation.navigate("Printer",{ day:{day},order:{order}, type:{type},sum:{sum} });
    setOrder([]);
    if (typeof sales[type] !='undefined')
   {
    let data=sales;
    delete data[type];
    setSales({...data});
    //dispath(clearOrderAction());
    dispath(orderSlice.actions.addOrder({...data}));
  }
 
  clearTable(type);
 
  dispath(invoiceSlice.actions.addinvoice(generateInvoiceNumber(invoice)));
  showMessage({
    message: "Đã thanh toán thành công",
    description: "Thanh toán",
    type: "success",
  });
 
  }
  
},[order,sales,status,sum,invoice])




 //------ Tab ------
 

 
 //-----Delete oreder------
const deleOrder = useCallback((index) =>{
 

 // setSum(sum - (order[index].price * order[index].quan));
  setOrder(order.filter((item,i) => i !== index));
},[order]);

///-----Add order --------
const addOrder = useCallback((sku,items,price)=>{
var quan = 1;
var flag=false;
var su=0;

if (order.length>0) 
{ 
  
  order.forEach (orderline => {
    
    if (orderline.description==items)
    {
      
      quan=parseInt(orderline.quan)+1;
      flag=true;
    }
    }) ;
    if (flag==true){
   
   setOrder((prevState) =>
   prevState.map((order) =>
     order.description === items ? { ...order,quan:quan,subtotal:quan*price } : order
   ));
      
    }
 
  
  };

 /* */

if (flag==false) {
 
   const obj={sku:sku,description: items, quan:quan, subtotal: price*quan};
   //setOrder([obj,...order,]);
   setOrder([...order,obj,]);

                   }
       
},[order]);




 if (itemList==null) {
  
  return(
    <View style={{flex:1,  alignItems: 'center',flexDirection:'row', justifyContent:'center'}}>
      <Text>Loading...</Text>
    </View>    )
  }
  else{
  return (
    
    <View style={{ flex: 1, backgroundColor: COLORS.lightGray2 }}>
    {/* Nav bar section */}
    {renderNavBar()}
        <View style={styles.main}>
    
      <View style={styles.orderContent}>
       <View style={[styles.viewOrder,{flex:0.66}]}><Text style={styles.menuOrder}>Món ăn</Text></View> 
       <View style={[styles.viewOrder,{flex:0.08}]} ><Text style={styles.menuOrder}>SL</Text></View> 
       {/* <View style={[styles.viewOrder,{flex:0.18}]}><Text style={styles.menuOrder}>Giá</Text></View>  */}
       <View style={[styles.viewOrder,{flex:0.26}]} ><Text style={styles.menuOrder}>TTiền</Text></View>
      </View>
      <View style={styles.order}>
       <Order order={order} deleOrder={deleOrder}/>  
      </View>

     
        
      <TabListMenu itemList={itemList} addOrder={addOrder} />

      
      
      
      <FlashMessage position="top" />
    </View> 

   </View>
   
  );}
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
},
  main: {
    flex: 1,
    
 
   
  },
  header: {
    flex: 0.45,
    flexDirection:"row",
    justifyContent:'center',
    
    
  //  height:1,
   
    //borderWidth: 0.1,
  },
  back:{
    fontSize:20,
    color:'white',
    padding:10,
    justifyContent:'center',
    //margin:5,
  //  alignContent:'flex-start',
  },
  backView:{
    flexDirection:'row',
    flexWrap:'wrap',
  //  position:'absolute',
  //  left:0,
    alignItems:"flex-end",
  },

  order:{
    flex:1,
  },
  menu:{
    flex: 2,
    flexDirection:'row',
   // backgroundColor: 'white',
  },
  tablist:{
    flex:0.4,
    //backgroundColor:'green',
    borderWidth: 0.1,
  },
  tabItem:{
    padding: 3,
    margin:2,
    fontSize:20,
    alignContent:"flex-start",
    color:"white",
  },
  tabMenu:{
    borderWidth:0.2,
    borderColor:'white',
    height: 46,
    justifyContent:'center',
  },
  menulist:{
    flex:1,
  },
  orderContent:{
    flexDirection:'row',
 //   flexWrap:'wrap',
  //  flex:1,
  //  justifyContent:'center',
  },
  menuOrder:{
    
    
    fontSize: 18,
    color:'white',
    padding:1,
    
  },
  viewOrder:{
    backgroundColor:'#5E8D48',
    borderWidth:0.2,
    borderColor:'white',
    alignItems:'center',
   // fontSize: 18,
   // color:'white',
  },
  headerTT:{
    flexDirection:'row',
   // flexDirection:'row',
   // marginTop:14,
  //  padding:14,
  //  alignSelf:'flex-start',
 //  justifyContent:'center',
   // marginBottom:1.2,
  // 
  },

  Save:{
 flexDirection:'row',
 flex:0.12,
    justifyContent:'center',
    marginTop:2,
  
  //alignSelf:'flex-end',
   // padding:14,
   
    
  },
  Bill:{
    flex:0.17,
  flexDirection:'row',
    justifyContent:'center',
  //  alignSelf:'flex-start',
  // alignContent:'center',
  //  padding:14,
  marginTop:2,
  },
  Sum:{
    flex:0.4,
  flexDirection:'row',
   justifyContent:'center',
    alignItems:'flex-end',
    alignSelf:'flex-end',
  // alignContent:'center',
  //  padding:14,
  }
});
