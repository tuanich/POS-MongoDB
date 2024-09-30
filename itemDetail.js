import { StyleSheet, Text, TextInput, Pressable, TouchableOpacity, View, SafeAreaView, Dimensions } from "react-native";
import ItemSlice from './source/redux/itemSlice';
import { COLORS, FONTS, SIZES, icons, images } from './source/constants';
import { useDispatch, useSelector } from 'react-redux';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Entypo';
import MAIcon from 'react-native-vector-icons/MaterialIcons';
import Input from "./input";
import React, { useEffect, useState, useRef } from "react";
import { itemlistSelector } from './source/redux/selector';
import FlashMessage from "react-native-flash-message";

import 'localstorage-polyfill';

export default function ItemDetail({ navigation, route }) {
  const flashMessage = useRef();
  const dispath = useDispatch();
  const [itemList, setItemList] = useState(useSelector(itemlistSelector));
  const [values, setValues] = useState();
  const [show, setShow] = useState();
  const [error, setError] = useState();
  const [title, setTitle] = useState([]);
  const [savebtn, setSavebtn] = useState(1);
  const ITEM_STORAGE = "ITEM_KEY";
  useEffect(() => {
    //console.log(route.params.params.sku);
    var ti;
    if (route.params.params.type == 1) {
      ti = ['Món ăn', 1, "Item"];
    }
    else {
      if (route.params.params.type == 2) {
        ti = ['Thức uống', 2, "Drink"];
      }
      else
        ti = ['Các món khác', 3, "Other"];
    }
    //  const ti = [];
    setTitle(ti);
    navigation.setOptions({ title: ti[0] });
  }, [navigation]);

  useEffect(() => {
    // console.log(route.params);
    var s = parseInt(route.params.params.sku)
    if (route.params.params.add == 1) {
      s = s + 1;
      //  setData({ sku: s, description: "", quantity: "" });
      setValues({ sku: s, description: "", price: "" });
    }
    else {
      //  setData({ sku: s, description: route.params.params.description, price: route.params.params.price });
      setValues({ sku: s, description: route.params.params.description, price: route.params.params.price });
    }



  }, [])


  const Cancel = () => {
    navigation.navigate('ItemList')
  }
  const Save = () => {

    if (savebtn == 1) {
      const description = values?.description;
      const price = values?.price;
      const sku = values?.sku;
      const type = title[2];

      if (isNaN(+price)) {
        setError({ ...error, price: 'Vui lòng nhập số !!!' });
        return;
      }
      else setError({ ...error, price: '' });
      if (!description == "" && !price == "") {

        let d = { ...itemList }; //Copy
        let d2 = [...d[type]]; //copy

        if (route.params.params.add == 1) { //Add new

          d2.push([sku, description, parseInt(price), 0, ""]);
          //    console.log(d2);
        }
        else { //Edit
          d2 = d2.map(item => {
            if (item[0] == sku) {
              item = [];
              item[0] = sku;
              item[1] = description;
              item[2] = parseInt(price);
              item[3] = 0;
              item[4] = "";
              // console.log(item);
              return item;
            }
            return item;
          })
          //  console.log("d2:", d2);
        }

        delete d[type];
        let obj = {};
        obj[type] = d2
        ///console.log(obj);
        d = { ...d, ...obj };

        // console.log(d);
        localStorage.setItem(ITEM_STORAGE, JSON.stringify(d));
        dispath(ItemSlice.actions.addItem(d));
        flashMessage.current.showMessage({
          message: "Đã lưu thành công",
          description: "Lưu",
          type: "success",
          backgroundColor: "#517fa4",
        });
        setSavebtn(0);

        //  navigation.navigate('ItemList', { params: { tab: route.params.params.type } })
      }
      else {
        flashMessage.current.showMessage({
          message: "Không thể lưu",
          description: "Lưu",
          type: "info",
        });
      }
    }
  }

  function onChange(text, field) {
    // if (field == 'price') text = Number(text).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    setValues({ ...values, [field]: text });
  }

  return (
    <View style={{ flex: 1 }}>
      {/*  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f8f8f8' }}>
        <Text style={{ fontSize: 24 }}>{title}</Text>
      </View> */}
      <View style={{ padding: 10, backgroundColor: '#f8f8f8', height: '94%' }}>
        <View style={{ padding: 10 }}>
          <Text style={styles.label}>SKU</Text>
          <View style={[styles.container,]}>
            <View style={{ paddingRight: 8 }}><FAIcon name="info-circle" size={20} /></View>
            <TextInput
              label='SKU'
              name='sku'
              placeholder={values?.sku.toString()}
              editable={false}
              value={values?.sku.toString()}

              style={{ flex: 4 }}
            />
            {//console.log(values?.sku)
            }
            <View style={{ paddingLeft: 8 }}></View>
          </View>
          <Text></Text>
        </View>


        <Text></Text>

        <Input
          placeholder={'Enter description '}
          label='Tên sản phẩm'
          name='description'
          leftIcon={<MAIcon name="description" size={20} />}
          bgColor="#e1f3f8"
          outlined
          value={values?.description}
          onChangeHandler={text => onChange(text, 'description')}
          validate={() => {
            if (!values?.description) setError({ ...error, description: 'Vui lòng nhập tên sản phẩm !!!' });
            else setError({ ...error, description: '' });
          }}
          errorMessage={(error?.description)}
        />
        {//console.log(values)
        }
        <Text></Text>

        <Input
          placeholder={'Enter price '}
          label='Giá sản phẩm'
          name='price'
          leftIcon={<Icon name="price-tag" size={20} />}
          bgColor="#e1f3f8"
          outlined
          value={values?.price.toString()}
          onChangeHandler={text => onChange(text, 'price')}
          validate={() => {
            if (!values?.price || isNaN(+values?.price)) setError({ ...error, price: 'Vui lòng nhập giá sản phẩm !!!' })
            else setError({ ...error, price: '' });
          }}
          errorMessage={(error?.price)}
        />
        {//console.log(values?.price)
        }
        <Text></Text>



        {/*           <Input
            placeholder={'Enter price '}
            lable='Price'
            name='four'
            leftIcon={<Icon name="login" size={20} />}
            rightIcon={
             <Pressable onPress={()=>setShow({...show,password:!show?.password})}> 
                {!show?.password?(<Icon name="eye" size={20}/>):(<Icon name="eye" size={20}/>)}
            </Pressable>}
            secure={!show?.password}
            bgColor="#e1f3f8"
            outlined
            onChangeHandler={text=>onChange(text,'four')}
            />
            <Text>{values?.four}</Text> */}


      </View>
      <View style={[styles.container2,]}>
        <View style={styles.listTab}>
          <TouchableOpacity style={[savebtn == 0 ? styles.btnTabActive : styles.btnTab]}
            onPress={() => { Cancel() }
            }>
            <Text style={[savebtn == 0 ? styles.textActive : styles.textTab]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[savebtn == 1 ? styles.btnTabActive : styles.btnTab]}
            onPress={() => { Save() }
            }>
            <Text style={[savebtn == 1 ? styles.textActive : styles.textTab]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlashMessage ref={flashMessage} />

    </View>




  )
};

const styles = StyleSheet.create({

  button: {
    // alignItems: "flex-start",
    backgroundColor: "#DDDDDD",
    borderColor: "white",
    borderWidth: 0.2,
    padding: 12,
    fontSize: 16,
    flexDirection: "row",
    flexWrap: 'wrap',

  },
  label: {
    //  fontWeight: 500,
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',

  },

  container2: {
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',

  },
  outlined: {
    borderColor: 'darkgrey',
    borderRadius: 8,
    borderWidth: 1,
  },
  standard: {
    borderBottomColor: 'darkgrey',
    borderBottomWidth: 1,
  },
  listTab: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    // marginBottom: 1.2,
  },
  btnTab: {
    width: Dimensions.get('window').width / 2,
    //borderTopLeftRadius:1,
    //borderTopRightRadius:13,
    borderRadius: 12,
    flexDirection: 'row',
    // borderWidth:0.4,
    borderColor: 'white',
    padding: 13,
    justifyContent: 'center',
    // backgroundColor:'#EBEBEB',
    backgroundColor: 'white',
    alignItems: 'flex-end'
  },
  textTab: {
    color: COLORS.black, ...FONTS.body3
  },
  btnTabActive: {
    width: Dimensions.get('window').width / 2,
    //borderTopLeftRadius:1,
    //borderTopRightRadius:13,
    borderRadius: 12,
    flexDirection: 'row',
    // borderWidth:0.4,
    borderColor: 'white',
    padding: 13,
    justifyContent: 'center',
    // backgroundColor:'#EBEBEB',
    backgroundColor: '#517fa4',
    alignItems: 'flex-end'
  },
  textActive: {
    color: COLORS.white, ...FONTS.body3
  }
});
