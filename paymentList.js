import { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { paymentlistSelector, saleslistSelector } from './source/redux/selector'
import PaymentDetail from './paymentDetail';
import { convertNumber } from './source/api';
import { COLORS, FONTS, SIZES, icons, images } from './source/constants/';
import mapping from "./mapping.json";

export default function paymentList({ navigation, route }) {

  const [sum, setSum] = useState();
  const [sales, setSales] = useState();
  const payment = useSelector(paymentlistSelector);
  const dataInvoice = useSelector(saleslistSelector);
  // const [dataP,setDataP] =useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (<Text style={styles.back}>{sum}</Text>),
    });
  }, [navigation, sum]);

  useEffect(() => {

    //  var su=0;
    //   setDataP(payment.reverse());
    // payment.map((item)=> su+= parseInt(item[2]));





    setSum(convertNumber(payment.reduce((a, b) => a + (parseInt(b[2]) || 0), 0)));

    if (JSON.stringify(dataInvoice) != '[]') {
      let s = dataInvoice.reduce((result, item) => ({
        ...result,
        [item[1]]: [
          ...(result[item[1]] || []),
          item,
        ],
      }),
        {},
      );
      delete s['invoice'];
      setSales(s);
    }
  }, [dataInvoice, payment])

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


  const print = (day, id, sum, type) => {

    let order = [];
    sales[id].forEach(item => {
      let datalet = { description: `${item[3]}`, quan: `${item[4]}`, subtotal: `${item[5]}` };
      order.push(datalet);
    })

    navigation.navigate("Printer", { day: { day }, order: { order }, type: { type }, sum: { sum } });
  };






  if (JSON.stringify(payment) == '[]' || JSON.stringify(dataInvoice) == '[]') {


    return (
      <View style={[{ flex: 1, justifyContent: "center" }, styles.horizontal]}>

        <ActivityIndicator size="large" color="#00ff00" />

      </View>
    );
  }
  else {

    return (
      <ScrollView>

        {

          payment.map((files, index) => (
            <View key={index} style={{ flex: 1, borderRadius: 12, backgroundColor: COLORS.white, marginTop: 10, marginLeft: 10, marginRight: 10 }}>
              <TouchableOpacity onPress={() => print(files[0], files[1], files[2], files[3])}>
                <View style={styles.button}>

                  <View style={{ flex: 1.25, alignItems: 'flex-start' }}>
                    <Text>{files[0]}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <Text>{mapping.ban[files[3]]}</Text>
                  </View>
                  <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold' }}>Total: {convertNumber(parseInt(files[2]))}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <>
                {/* {console.log(files)}  */}
                {
                  (typeof sales != 'undefined') ? sales[files[1]].map((item, index) => (
                    <PaymentDetail key={index} item={item} />
                  )) : <Text>NULL</Text>
                }
              </>
            </View>
          ))}
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