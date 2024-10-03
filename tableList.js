import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Dimensions, Image, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useState, useCallback, useRef } from 'react';
import { generateInvoiceNumber } from './source/api';
import { useDispatch, useSelector } from 'react-redux';
import { table2Order, getStatus } from './source/api';
import { url } from "@env";
import mapping from "./mapping.json";
//import {addStatus,table2Order,addOrderAction} from './source/redux/action';
//import statusSlice, { fetchCheckStatus } from './source/redux/statusSlice';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import statusSlice, { fetchStatus, fetchCheckStatus } from './source/redux/statusSlice';
import OrderSlice, { fetchOrder } from './source/redux/orderSlice';
import invoiceSlice from './source/redux/invoiceSlice';
import { convertNumber } from './source/api';
import { orderlistSelector, statuslistSelector } from './source/redux/selector';
import { COLORS, FONTS, SIZES, icons, images } from './source/constants';
import { faClock, faUsd } from '@fortawesome/free-solid-svg-icons';



let intervalID;
function Tablelist({ navigation, route }) {
  const flashMessage = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const dispath = useDispatch();
  const [tab, setTab] = useState(1);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);


  const orderLists = useSelector(orderlistSelector);
  //console.log("orderlist0:", orderLists);



  const statusList = useSelector(statuslistSelector);



  const [status, setStatus] = useState([]);


  useEffect(() => {
    //console.log( route.params);

    if (tab == 1)
      setList(statusList.filter(item => item[0] < 200));
    else
      setList(statusList.filter(item => item[0] >= 200))
  }, [statusList, route.params?.p])


  useEffect(() => {

    //reloadTable();


  }, [route.params?.p])



  const reloadTable = () => {


    let abortController = new AbortController();
    let aborted = abortController.signal.aborted; // true || false
    let data = async () => {
      const d = (await getStatus());
      aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
      if (aborted === false) {


        dispath(statusSlice.actions.addStatus(d));
        // console.log(d);
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
        // console.log(item[1]);
        let d = await data.json();
        let b = {};
        b[item[1]] = table2Order(d.table);
        //console.log(b);
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
          setRefreshing(false);
        } else {

          flashMessage.current.showMessage({
            message: "Dữ liệu load thành công",
            description: "Load dữ liệu",
            type: "success",
            backgroundColor: "#517fa4",
          })
          setRefreshing(false);
        }
      })
      .catch((error) => {

        flashMessage.current.showMessage({
          message: error,
          description: "Load dữ liệu",
          type: "danger",

        })
        setRefreshing(false);
      });

    /* statusList.map(item => {
       if (item[2] == 1) {
         TabletoOrder(item[1]);
       }
     });*/

  };

  const TabletoOrder = (table) => {

    dispath(fetchOrder(table));
  }


  //   useEffect(() => {
  //     if (route.params?.p) {
  //       // Post updated, do something with `route.params.post`
  //       // For example, send the post to the server
  //     //   const storagedItem = localStorage.getItem(STATUS_STORAGE);
  //     // if (storagedItem)
  //     // {setStatus(JSON.parse(storagedItem));}
  //      // console.log(route.params?.post)
  //      // addPayment();
  //     // dispath(addStatus())
  //  //reloadTable();
  //    // setTab(1);
  //     }
  //   }, [route.params?.p]);

  // useEffect(() => {
  //   localStorage.setItem(STATUS_STORAGE, JSON.stringify(status));

  // }, [status]);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(15000).then(() => setRefreshing(false));
  }, []);

  const wait = (timeout) => {
    reloadTable();

    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const pressTab = useCallback((i) => {
    setTab(i);
    let d = [];
    if (i == 1) {
      d = statusList.filter(item => item[0] < 200);
    }
    else {
      d = statusList.filter(item => item[0] >= 200);
    }

    setList(d);
  }, [tab, statusList]);


  const back = useCallback(() => {

    clearInterval(intervalID);
    navigation.navigate("Home",
      { post: true });
  }, [])

  const clickTable = useCallback((item) => {
    // console.log("orderlist1:", orderLists);
    if (item[2] == 0) {
      const invoice = generateInvoiceNumber();

      dispath(invoiceSlice.actions.addinvoice(invoice));
      dispath(OrderSlice.actions.deleteOrder(item[1]));
      clearInterval(intervalID);
      navigation.navigate('Orderdetail', { type: { item } });

    }
    else {
      /* lay data order trong table tu database
      const p = new Promise(resolve => {
        setLoading(true);
        resolve(dispath(fetchOrder(item[1])));

      })
      p.then((data) => {
        if (data.meta.requestStatus == 'fulfilled') {
          setLoading(false);
          clearInterval(intervalID);

          //  dispath(invoiceSlice.actions.addinvoice(data.in));
          navigation.navigate('Orderdetail', { type: { item } });
        }

      }
      )*/

      navigation.navigate('Orderdetail', { type: { item } });


    }




  }, []);

  function load() {
    if (loading) {
      return (

        //   <View style={{flex:1,  alignItems: 'center',flexDirection:'row', justifyContent:'center',backgroundColor:COLORS.white}}>
        //   <Text>Loading...</Text>
        // </View>
        <View style={[styles.container, styles.horizontal]}>

          <ActivityIndicator size="large" color="#00ff00" />

        </View>
      )
    }
  }

  function renderNavBar() {
    return (
      <View
        style={{
          flexDirection: 'row',
          //  height: 80,
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          //    paddingHorizontal: SIZES.padding,
          backgroundColor: '#79B45D',
        }}
      >
        <TouchableOpacity
          style={{ justifyContent: 'center', width: 50, padding: 10 }}
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

        <View style={styles.containerTab}>
          <View style={styles.listTab}>
            <TouchableOpacity style={[styles.btnTab, tab === 1 && styles.btnTabActive]} onPress={() => pressTab(1)}>
              <Text style={[styles.textTab, tab === 1 && styles.textActive]}>Bàn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnTab, tab === 2 && styles.btnTabActive]} onPress={() => pressTab(2)}>
              <Text style={[styles.textTab, tab === 2 && styles.textActive]}>Mang về</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.lightGray2, }}>
      {/* Nav bar section */}
      {renderNavBar()}

      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          title='loading'
        />
      }>
        {/* <View style={styles.containerTab}>
      <View style={styles.listTab}>
        <TouchableOpacity style={[styles.btnTab,tab===1 && styles.btnTabActive]} onPress={()=>pressTab(1)}>
        <Text style={[styles.textTab,tab===1 && styles.textActive]}>Bàn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnTab,tab===2 && styles.btnTabActive]} onPress={()=>pressTab(2)}>
        <Text style={[styles.textTab,tab===2 && styles.textActive]}>Mang về</Text>
        </TouchableOpacity>
      </View>
    </View> */}
        <View style={styles.container}>
          <View style={styles.box}>

            {list.map((item, index) =>

            (
              <TouchableOpacity style={item[2] === 0 ? styles.button : styles.button1} key={index} onPress={() => clickTable(item)} >
                <View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={item[2] === 0 ? styles.innerText : styles.innerText1}>{mapping.ban[item[1]]}</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>

                    <FontAwesomeIcon icon={faClock} size={15} padding={10} /><Text style={item[2] === 0 ? styles._innerText : styles._innerText1}>{item[4]}</Text></View>

                  <View style={{ flexDirection: 'row' }}><FontAwesomeIcon icon={faUsd} size={15} padding={10} /><Text style={item[2] === 0 ? styles.innerText : styles.innerText1}>{convertNumber(item[3])}</Text></View>
                </View>
              </TouchableOpacity>)

            )

            }
          </View>

        </View>
        <FlashMessage ref={flashMessage} />
      </ScrollView>
      {load()}

    </View>
  );
}
export default Tablelist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent:'space-around',
    //alignItems:'center',
    padding: 17,
    //flexDirection:'row',
    //flexWrap:'nowrap',


  },

  box: {
    //flex: 0.25,
    flexDirection: 'row',
    flexWrap: 'wrap',


  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 17,

    backgroundColor: "oldlace",
    alignSelf: "flex-start",
    marginHorizontal: "1.5%",
    marginBottom: 8,
    alignItems: 'center',
    //minWidth: "48%",
    justifyContent: 'center',
    width: 114,
    height: 114,

    textAlign: "center",
  },
  button1: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 17,

    //  backgroundColor: "#79B45D",
    backgroundColor: '#649ed2',
    alignSelf: "flex-start",
    marginHorizontal: "1.5%",
    marginBottom: 8,
    alignItems: 'center',
    //minWidth: "48%",
    justifyContent: 'center',
    width: 114,
    height: 114,
    textAlign: "center",

  },
  innerText1: {
    color: COLORS.white, ...FONTS.body3,
    padding: 3
  },
  innerText: {
    color: COLORS.primary, ...FONTS.body3,
    padding: 3
  },

  _innerText1: {
    color: COLORS.white, ...FONTS.body4,
    padding: 3
  },
  _innerText: {
    color: COLORS.primary, ...FONTS.body4,
    padding: 3
  },

  containerTab: {
    flex: 1,
    // paddingHorizontal:10,
    //justifyContent:'flex-end',
    // marginTop:10,

  },
  listTab: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: 1.2,
  },
  btnTab: {
    width: Dimensions.get('window').width / 3,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderRadius: 13,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: 'white',
    padding: 10,
    justifyContent: 'center',
    // backgroundColor:'#EBEBEB',
    backgroundColor: '#79B45D',
    alignItems: 'flex-end'
  },
  textTab: {
    color: COLORS.primary, ...FONTS.body3
  },
  btnTabActive: {
    // backgroundColor:"#EB8385",
    backgroundColor: '#5E8D48',
  },
  textActive: {
    color: COLORS.white, ...FONTS.body3
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
})