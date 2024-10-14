import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useDispatch } from 'react-redux';
import { getReport } from "./mongo";
import { COLORS, FONTS, SIZES } from '../source/constants/';
import reportSlice from './redux/reportSlice';

const menu = [
  { name: 'Báo cáo theo PT vận chuyển trong ngày', naviName: 'Report1' },
  { name: 'Báo cáo theo món ăn trong ngày', naviName: 'Report2' },
  { name: 'Báo cáo theo thức uống trong ngày', naviName: 'Report3' },
  { name: 'Báo cáo theo các món khác trong ngày', naviName: 'Report4' },
  { name: 'Báo cáo doanh thu trong 7 ngày', naviName: 'Report5' },
  { name: 'Báo cáo doanh thu tháng', naviName: 'Report6' },
  { name: 'Thống kê số lượng bán nhiều nhất', naviName: 'Report7' },
  { name: 'Thông kê phương thức bán nhiều nhất', naviName: 'Report8' },
];

export default function MenuReport({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [accessView, setAccessView] = useState("none");
  const dispatch = useDispatch();

  useEffect(() => {
    onRefresh();
  }, []);

  const reloadReport = useCallback(async () => {
    let abortController = new AbortController();
    let signal = abortController.signal;

    try {
      let report = await getReport();
      if (!signal.aborted && report) {
        dispatch(reportSlice.actions.addReport(report));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
      setAccessView('auto');
    }

    return () => abortController.abort();
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setAccessView('none');
    wait(30000).then(() => setRefreshing(false));
  }, [reloadReport]);

  const wait = (timeout) => {
    reloadReport();
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  return (
    <ScrollView
      pointerEvents={accessView}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          title='loading'
          progressBackgroundColor='#79B45D'
          color='#fff'
          tintColor='#fff'
        />
      }
    >
      <View pointerEvents={accessView}>
        {menu.map((item, index) => (
          <View key={item.naviName} style={styles.order}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Report', { i: index, name: item.name })}
            >
              <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  order: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    marginLeft: 5,
    marginRight: 5,
    paddingHorizontal: SIZES.radius,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    marginLeft: SIZES.base,
    color: COLORS.primary,
    ...FONTS.h3,
  },
});
