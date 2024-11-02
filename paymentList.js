import { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { paymentlistSelector, saleslistSelector } from './source/redux/selector'
import PaymentDetail from './paymentDetail';
import { convertNumber, pay } from './source/api';
import { COLORS, FONTS, SIZES, icons, images } from './source/constants/';
import mapping from "./mapping.json";
import 'localstorage-polyfill';
import { getMorePayment } from './source/mongo';



const PAYMENT_STORAGE = "PAYMENT_KEY";


export default function paymentList({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);


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
    setIsLoading(true);

    const storagedPAYMENT = localStorage.getItem(PAYMENT_STORAGE);

    if (storagedPAYMENT) {
      const _storagedPayment = storagedPAYMENT.replace(/\'/g, '\"');
      let d = JSON.parse(_storagedPayment);

      //sort
      setDataP(d.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));

      setSum(convertNumber(d.reduce((a, b) => a + (parseInt(b.total) || 0), 0)));
      //  setIsLoading(false);


    }
    else {
      fetchData();
    }

  }, [])

  const fetchData = async () => {

    setIsLoading(true);
    let data = await getMorePayment(page);
    if (data && data.length > 0) {
      data = data.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      setDataP([...dataP, ...data]);
      setIsLoading(false);
    }

  }

  const fetchNextPage = () => {

    if (!isLoading) {
      setPage(prevPage => prevPage + 1);
      fetchData();
    }

  }

  const loadingButton = () => {

    setIsLoading(false);

    setPage(prevPage => prevPage + 1);
    fetchData();




  }



  const renderItem = ({ item }) => {

    return (
      <View key={item._id} style={{ flex: 1, borderRadius: 12, backgroundColor: COLORS.white, marginTop: 10, marginLeft: 10, marginRight: 10 }}>
        <TouchableOpacity onPress={() => print(item.sales, item.timestamp, item.invoice, item.total, item.type)}>
          <View style={styles.button}>

            <View style={{ flex: 1.25, alignItems: 'flex-start' }}>
              <Text>{item.timestamp}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Text>{mapping.ban[item.type]}</Text>
            </View>
            <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: 'bold' }}>Total: {convertNumber(parseInt(item.total))}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <>

          {item.sales ?
            item.sales.map((item, index) => (
              <PaymentDetail key={index} item={item} />
            ))
            : null}
        </>
      </View>
    )
  }
  const ListEndLoader = () => {
    return (
      <TouchableOpacity onPress={loadingButton}>
        <Text style={{ textAlign: 'center', padding: 10, fontSize: 16 }}>{isLoading ? 'Loading history...' : 'Load More'}</Text>
      </TouchableOpacity>
    )
  };




  const print = (sales, day, id, sum, type) => {

    const order = sales;

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
      <FlatList
        data={dataP}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.1}
        ListFooterComponent={ListEndLoader}
      >

      </FlatList>
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