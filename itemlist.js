import { StyleSheet, TouchableOpacity, View, ScrollView, RefreshControl, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { itemlistSelector } from './source/redux/selector';
import ItemSlice from './source/redux/itemSlice';
import { Icon, SearchBar } from 'react-native-elements';
import DataItem from './dataItem';
import 'localstorage-polyfill';


export default function ({ navigation, route }) {
  const itemList = useSelector(itemlistSelector);
  const dispath = useDispatch();
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState(route.params?.tab);
  const [tabname, setTabname] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [IT, setItem] = useState([]);
  const [datafilter, setDatafilter] = useState([]);
  const [sku, setSku] = useState();
  const ITEM_STORAGE = "ITEM_KEY";


  useEffect(() => {

    if (tab == 1) {
      // console.log("1");
      setTab(1);
      setTabname('Item');
      setItem(itemList.Item);
      setDatafilter(itemList.Item);



    }
    else {
      if (tab == 2) {
        //  console.log("2");
        setTab(2);
        setTabname('Drink');
        setItem(itemList.Drink);
        setDatafilter(itemList.Drink);
      }
      else {
        //        console.log("3");
        setTab(3);
        setTabname('Other');
        setItem(itemList.Other);
        setDatafilter(itemList.Other);
      }
    }


  }, [tab, itemList]);





  const editItem = useCallback((index) => {
    let data = datafilter.filter((item, i) => i == index);
    // console.log(data, index);


    navigation.navigate('Item', {
      params: {
        type: tab,
        sku: data[0][0],
        description: data[0][1],
        price: data[0][2],
        add: 0
      }
    })
  }, [datafilter, tab])

  const add = () => {

    // SKU maximun in Items
    // console.log(tab);
    let data = datafilter.map(item => item);
    data.sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
    setSku(data[0][0]);
    // console.log(data[0][0]);
    navigation.navigate('Item', { params: { type: tab, sku: data[0][0], add: 1 } })
  };

  const delItem = useCallback((index) => {

    const data = datafilter.filter((item, i) => !(i == index));
    setDatafilter(data);
    setItem(data);
    let d = { ...itemList };
    delete d[tabname];
    //  console.log("d1:", d);
    let obj = {};
    obj[tabname] = data;
    //  console.log("O:", obj);
    d = { ...d, ...obj };
    //  console.log("d2", d);
    localStorage.setItem(ITEM_STORAGE, JSON.stringify(d));
    dispath(ItemSlice.actions.addItem(d));



  }, [datafilter, IT]);

  const search = (text) => {

    // console.log(IT);

    setFilter(text);

    if (text != '') {
      setDatafilter(IT.filter(item => {
        return item[1].toUpperCase().indexOf(text.toUpperCase()) > -1;
      }))


    }
    else setDatafilter(IT);


  };




  return (
    <View style={styles.menu}>




      <View style={styles.menulist}>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', position: 'relative', alignItems: 'center', width: 415, height: 60, padding: 4 }}>
          <SearchBar
            placeholder="Type Here..."
            onChangeText={search}
            value={filter}
            onCancel={() => { setFilter('') }}
            containerStyle={{ width: 400, height: 50, backgroundColor: 'white', borderRadius: 18, alignItems: 'center', borderColor: 'white' }}
            inputContainerStyle={{ height: 35, backgroundColor: 'white' }}
          //      inputStyle={{size:10}}
          />
        </View>


        <ScrollView style={{ height: 720 }} refreshControl={
          <RefreshControl

            title='loading'
          />}>

          <DataItem item={datafilter} editItem={editItem} delItem={delItem} />

        </ScrollView>

      </View>


      <View style={{ flex: 1, alignItems: 'flex-end', position: 'absolute', bottom: 20, right: 35 }}>
        <TouchableOpacity onPress={() => add()}>
          <View><Icon type='ionicon' name='add-circle' color='#517fa4' size={70} style={styles.shadow} /></View>
        </TouchableOpacity>
      </View>
    </View>
  )

}




const styles = StyleSheet.create({

  menu: {
    flex: 1,
    //   flexDirection:'row',
    // backgroundColor: 'white',
  },
  menulist: {
    flex: 1,
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',


  },



});