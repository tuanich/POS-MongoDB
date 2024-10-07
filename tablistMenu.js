
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, RefreshControl, Image, Dimensions } from 'react-native';
import { COLORS, FONTS, SIZES, icons, images } from './source/constants';
import { useCallback, useEffect, useState } from 'react';
import { getItems } from './source/api';
import Data from './Data';
import 'localstorage-polyfill';

const ITEM_STORAGE = "ITEM_KEY";


export default function TabListMenu({ addOrder }) {
  const [tab, setTab] = useState(1);
  const [IT, setItem] = useState([]);
  const [itemList, setItemList] = useState({});

  useEffect(() => {
    const storagedItem = localStorage.getItem(ITEM_STORAGE);
    if (storagedItem) {
      const _storagedItem = storagedItem.replace(/\'/g, '\"');

      setItemList(JSON.parse(_storagedItem));
      setItem(JSON.parse(_storagedItem).Items);
    }
  }, [])

  const setValueItem = useCallback((tab) => {

    if (tab == 1) {
      setTab(1);
      setItem(itemList.Items);

    }
    if (tab == 2) {
      setTab(2);
      setItem(itemList.Drinks);

    }

    if (tab == 3) {
      setTab(3);
      setItem(itemList.Others);

    }


  }, [tab, itemList]);


  return (
    <View style={styles.menu}>


      <View style={styles.containerTab}>
        <View style={styles.listTab}>
          <TouchableOpacity style={[styles.btnTab, tab === 1 && styles.btnTabActive]} onPress={() => { setValueItem(1) }}>
            <Text style={[styles.textTab, tab === 1 && styles.textActive]}>Món ăn</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btnTab, tab === 2 && styles.btnTabActive]} onPress={() => { setValueItem(2) }}>
            <Text style={[styles.textTab, tab === 2 && styles.textActive]}>Thức uống</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btnTab, tab === 3 && styles.btnTabActive]} onPress={() => { setValueItem(3) }}>
            <Text style={[styles.textTab, tab === 3 && styles.textActive]}>Các món khác</Text>
          </TouchableOpacity>

        </View>
      </View>

      <View style={styles.menulist}>

        <ScrollView >
          <Data item={IT} addOrder={addOrder} />
        </ScrollView>
      </View>
    </View>
  )

}


const styles = StyleSheet.create({

  menu: {
    flex: 1.4,
    //   flexDirection:'row',
    // backgroundColor: 'white',
  },
  menulist: {
    flex: 10,

    flexDirection: 'row',
    backgroundColor: "#ebebeb",
  },

  /* tab vertical
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
  
  */

  // tab 
  containerTab: {
    flex: 1,
    // paddingHorizontal:10,
    //justifyContent:'flex-end',
    // marginTop:10,

  },
  listTab: {
    flexDirection: 'row',
    // alignSelf:'flex-end',
    // marginBottom:1.2,
  },
  btnTab: {
    width: Dimensions.get('window').width / 3,
    //  borderTopLeftRadius:13,
    //  borderTopRightRadius:13,
    borderRadius: 18,
    borderColor: 'white',

    flexDirection: 'row',
    borderWidth: 0.7,
    padding: 8,


    justifyContent: 'center',
    // backgroundColor:'#EBEBEB',
    backgroundColor: 'white',
    //  alignItems:'flex-end'
  },
  textTab: {
    color: COLORS.primary, ...FONTS.body3,

  },
  btnTabActive: {
    // backgroundColor:"#EB8385",
    backgroundColor: '#5E8D48',


  },
  textActive: {
    color: COLORS.white, ...FONTS.body3,

  },


});