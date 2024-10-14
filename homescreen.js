import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getItems, getTables, getPayments } from './source/mongo';
import { itemlistSelector, orderlistSelector, statuslistSelector } from './source/redux/selector';
import ItemSlice from './source/redux/itemSlice';
import OrderSlice from './source/redux/orderSlice';
import statusSlice from './source/redux/statusSlice';
import { showMessage } from "react-native-flash-message";
import { COLORS } from './source/constants';
import 'localstorage-polyfill';

const ITEM_STORAGE = "ITEM_KEY";
const STATUS_STORAGE = "STATUS_KEY";
const SALES_STORAGE = "SALES_KEY";
const PAYMENT_STORAGE = "PAYMENT_KEY";

function HomeScreen({ navigation, route }) {
  const [refreshing, setRefreshing] = useState(true);
  const [accessView, setAccessView] = useState("none");
  const dispatch = useDispatch();
  const itemList = useSelector(itemlistSelector);
  const statusList = useSelector(statuslistSelector);
  const orderList = useSelector(orderlistSelector);

  useEffect(() => {
    if (route.params?.post) {
      setRefreshing(false);
      setAccessView('auto');
    } else {
      loadData();
    }
  }, []);

  const loadData = async () => {
    await Promise.all([loadItems(), loadTables()]);
    showMessage({
      message: "Dữ liệu load thành công",
      description: "Load dữ liệu",
      type: "success",
      backgroundColor: "#517fa4",
    });
    setRefreshing(false);
    setAccessView('auto');
  };

  const loadItems = async () => {
    const storagedItem = localStorage.getItem(ITEM_STORAGE);
    if (!storagedItem || storagedItem === '{}') {
      const items = await getItems();
      if (items) {
        localStorage.setItem(ITEM_STORAGE, JSON.stringify(items));
        dispatch(ItemSlice.actions.addItem(items));
      }
    } else {
      dispatch(ItemSlice.actions.addItem(JSON.parse(storagedItem.replace(/\'/g, '\"'))));
    }
  };

  const loadTables = async () => {
    const storagedStatus = localStorage.getItem(STATUS_STORAGE);
    if (!storagedStatus || storagedStatus === '[]') {
      const [tables, payments] = await Promise.all([getTables(), getPayments()]);
      if (payments) {
        localStorage.setItem(PAYMENT_STORAGE, JSON.stringify(payments));
      }
      if (tables) {
        const status = tables.map(item => [item.sku, item.type, item.status, item.subtotal, item.timestamp, item.name]);
        const tableData = tables.reduce((acc, item) => {
          acc[item.type] = item[item.type];
          return acc;
        }, {});
        dispatch(statusSlice.actions.addStatus(status));
        dispatch(OrderSlice.actions.table2Order(tableData));

      }
    } else {
      dispatch(statusSlice.actions.addStatus(JSON.parse(storagedStatus.replace(/\'/g, '\"'))));
    }
  };

  useEffect(() => {
    localStorage.setItem(STATUS_STORAGE, JSON.stringify(statusList));
  }, [statusList]);

  useEffect(() => {
    localStorage.setItem(SALES_STORAGE, JSON.stringify(orderList));
  }, [orderList]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setAccessView('none');
    loadData();
  }, []);

  if (!itemList) {
    return (
      <View style={[{ flex: 1, justifyContent: "center" }, styles.horizontal]}>
        <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Setting')}>
          <Text style={styles.textButton}>Cài đặt Server</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (JSON.stringify(statusList) === '[]') {
    return (
      <View style={[{ flex: 1, justifyContent: "center" }, styles.horizontal]}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lightGray2 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          title='loading'
          progressBackgroundColor='#79B45D'
          color='#FFFFFF'
          tintColor='#FFFFFF'
        />
      }
    >
      <View pointerEvents={accessView}>
        <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Tablelist', route.params.post ? { post: false } : { post: true })}>
          <Text style={styles.textButton}>Đặt món</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Payments')}>
          <Text style={styles.textButton}>Đơn đã thanh toán</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('ReportMenu')}>
          <Text style={styles.textButton}>Báo cáo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('ItemList')}>
          <Text style={styles.textButton}>Quản lý món ăn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Setting')}>
          <Text style={styles.textButton}>Cài đặt Server</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  Button: {
    width: 260,
    height: 60,
    backgroundColor: '#79B45D',
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 15
  },
  textButton: {
    fontSize: 25,
    color: 'white',
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});