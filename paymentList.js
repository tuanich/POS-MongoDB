import { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { paymentlistSelector, saleslistSelector } from './source/redux/selector'
import PaymentDetail from './paymentDetail';
import { convertNumber, pay } from './source/api';
import { COLORS, FONTS, SIZES, icons, images } from './source/constants/';
import mapping from "./mapping.json";
import 'localstorage-polyfill';


const PAYMENT_STORAGE = "PAYMENT_KEY";


export default function paymentList({ navigation, route }) {

  const [sum, setSum] = useState();
  //const [sales, setSales] = useState();
  //const payment = useSelector(paymentlistSelector);
  //const dataInvoice = useSelector(saleslistSelector);
  const [dataP, setDataP] = useState([]);
  //const [payment, setPayment] = useState({});

  // const [dataP,setDataP] =useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (<Text style={styles.back}>{sum}</Text>),
    });
  }, [navigation, sum]);

  useEffect(() => {


    const storagedPAYMENT = localStorage.getItem(PAYMENT_STORAGE);

    if (storagedPAYMENT) {
      const _storagedPayment = storagedPAYMENT.replace(/\'/g, '\"');
      let d = JSON.parse(_storagedPayment);

      //sort
      setDataP(d.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));

      setSum(convertNumber(d.reduce((a, b) => a + (parseInt(b.total) || 0), 0)));
    }





    // let data = payment.map(item => item);


    /*
        if (JSON.stringify(dataInvoice) != '[]') {
    
          let s = dataInvoice.reduce((result, item) => ({
            ...result,
            [item['invoice']]: [
              ...(result[item['invoice']] || []),
              item,
            ],
          }),
            {},
          );
    
    
          delete s['invoice'];
       
          setSales(s);*
        }*/
  }, [])



  // const groupBy = (posts, key) => {

  //   posts.reduce((result, item) => ({
  //     ...result,
  //     [item[key]]: [
  //       ...(result[item[key]] || []),
  //       item,
  //     ],
  //   }), 
  //   {},
  // );};


  const print = (sales, day, id, sum, type) => {

    const order = sales;
    /* let order = [];
     sales[id].forEach(item => {
       let datalet = { description: `${item.description}`, quan: `${item.quantity}`, subtotal: `${item.quantity * item.price}` };
       order.push(datalet);
     })*/

    navigation.navigate("Printer", { day: { day }, order: { order }, type: { type }, sum: { sum } });
  };






  // if (JSON.stringify(payment) == '[]' || JSON.stringify(payment) == '[null]' || JSON.stringify(payment) == '[[null]]') {
  if (JSON.stringify(dataP) == '[]' || JSON.stringify(dataP) == '[null]' || JSON.stringify(dataP) == '[[null]]') {

    return (
      <View style={[{ flex: 1, justifyContent: "center" }, styles.horizontal]}>

        <ActivityIndicator size="large" color="#00ff00" />

      </View>
    );
  }
  else {
    return (
      <ScrollView>

        {dataP ?
          dataP.map((files, index) => (
            <View key={index} style={{ flex: 1, borderRadius: 12, backgroundColor: COLORS.white, marginTop: 10, marginLeft: 10, marginRight: 10 }}>
              <TouchableOpacity onPress={() => print(files.sales, files.timestamp, files.invoice, files.total, files.type)}>
                <View style={styles.button}>

                  <View style={{ flex: 1.25, alignItems: 'flex-start' }}>
                    <Text>{files.timestamp}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <Text>{mapping.ban[files.type]}</Text>
                  </View>
                  <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold' }}>Total: {convertNumber(parseInt(files.total))}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <>

                {files.sales ?
                  files.sales.map((item, index) => (
                    <PaymentDetail key={index} item={item} />
                  ))
                  : null}
              </>
            </View>
          ))
          : null}
      </ScrollView>
    )
  }

};

const styles = StyleSheet.create({

  button: {
    // alignItems: "flex-start",
    backgroundColor: "#DDDDDD",
    borderColor: "white",
    //  borderWidth:0.2,
    padding: 12,
    fontSize: 16,
    flexDirection: "row",
    flexWrap: 'wrap',
    borderTopStartRadius: 12,
    borderTopEndRadius: 12,

  },
  order: {
    fontSize: 14,
    padding: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 1,

  },
  back: {
    fontSize: 20,
    color: 'white',
    padding: 10,
    //margin:5,
    //  alignContent:'flex-start',
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});