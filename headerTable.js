import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Dimensions, Image, ActivityIndicator } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useState, useCallback } from 'react';
import { generateInvoiceNumber } from './source/api';
import { useDispatch, useSelector } from 'react-redux';
//import {addStatus,table2Order,addOrderAction} from './source/redux/action';
//import statusSlice, { fetchCheckStatus } from './source/redux/statusSlice';
import { fetchStatus, fetchCheckStatus } from './source/redux/statusSlice';
import orderSlice, { fetchOrder } from './source/redux/orderSlice';
import invoiceSlice from './source/redux/invoiceSlice';
import { convertNumber } from './source/api';
import { orderlistSelector, statuslistSelector } from './source/redux/selector';
import { COLORS, FONTS, SIZES, icons, images } from './source/constants';
import { faClock, faUsd } from '@fortawesome/free-solid-svg-icons';


let intervalID = 5000;


function Headertable({ navigation, route }) {

  const [tab, setTab] = useState(1);


  const back = useCallback(() => {

    clearInterval(intervalID);
    navigation.navigate("Home",
      { post: route.params.post });
  }, [])

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
        style={{ justifyContent: 'center', width: 50, padding: 10 }}
        onPress={() => back()}
      >
        <Image
          source={icons.back_arrow}
          style={{
            width: 25,
            height: 25,
            tintColor: COLORS.white
          }} />
      </TouchableOpacity>

      <View style={styles.containerTab}>
        <View style={styles.listTab}>
          <TouchableOpacity style={[styles.btnTab, tab === 1 && styles.btnTabActive]}
            onPress={() => {
              setTab(1);
              navigation.navigate('Item', { p: 1 });
            }
            }>
            <Text style={[styles.textTab, tab === 1 && styles.textActive]}>Bàn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnTab, tab === 2 && styles.btnTabActive]}
            onPress={() => {
              setTab(2);
              navigation.navigate('Tablelist', { p: 2 });
            }
            }>
            <Text style={[styles.textTab, tab === 2 && styles.textActive]}>Mang về</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

  );
}

export default Headertable;

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
    //borderTopLeftRadius:1,
    //borderTopRightRadius:13,
    borderRadius: 18,
    flexDirection: 'row',
    // borderWidth:0.4,
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