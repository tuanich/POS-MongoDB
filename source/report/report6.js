import { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image } from 'react-native';
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis, VictoryLabel } from 'victory-native';

import { convertNumber } from '../api';
import { Svg } from 'react-native-svg';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
export default function report6({ data }) {
  const [rdata, setRdata] = useState([]);
  const [sum, setSum] = useState();
  const [total, setTotal] = useState();
  const [viewMode, setViewMode] = useState("chart");
  const [dataP, setDataP] = useState([]);
  if (typeof data != 'undefined' || data != null) {
    useEffect(() => {
      var sum = 0;
      var total = 0;
      // const d = data.filter((item,i)=>i!==0);
      const d = data.map(item => item);
      d.map(item => {
        sum += item[2];
        total += item[3];
      });
      setRdata(d);
      setSum(convertNumber(sum));
      setTotal(convertNumber(total));
      setDataP(processData());

    }, [data])

    function renderCategoryHeaderSection() {
      return (
        //    <View style={{ flexDirection: 'row', padding: SIZES.padding, justifyContent: 'space-between', alignItems: 'center' }}>
        //         {/* Title */}

        //         {/* Button */}
        <View style={{ alignItems: 'flex-end', padding: 8 }}>
          <View style={{ flexDirection: 'row', }}>

            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: viewMode == "chart" ? COLORS.secondary : null,
                height: 50,
                width: 50,
                borderRadius: 25
              }}
              onPress={() => setViewMode("chart")}
            >
              <Image
                source={icons.chart}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: viewMode == "chart" ? COLORS.white : COLORS.darkgray,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: viewMode == "list" ? COLORS.secondary : null,
                height: 50,
                width: 50,
                borderRadius: 25,
                marginLeft: SIZES.base
              }}
              onPress={() => setViewMode("list")}
            >
              <Image
                source={icons.menu}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: viewMode == "list" ? COLORS.white : COLORS.darkgray,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        //   </View>
      )
    }
    const processData = useCallback(() => {
      //  const d=data.map((item,index)=>((index==0)?(item[2]=0):item));
      //  console.log(d);
      return (data.map((item, index) => {
        if (index == 0) return {
          x: '0',
          y: '0'
        }
        else {
          return {
            x: `T ${item[0]}/${item[1]}`,
            y: item[3],
          }
        }
      }))
    }, [])
    function renderChart() {
      const dataChart = dataP;
      //  console.log(dataChart);
      return (

        <VictoryChart
          theme={VictoryTheme.material}
          width={460}
          height={500}

          // domainPadding={{ y: 50 }}
          padding={{ left: 70, right: 82, top: 20, bottom: 25 }}


          domainPadding={{ x: 30 }}
          //  domainPadding={{x: [10000, -1000], y: [100,10]}}
          domain={{ y: [1000000, 200000000] }}
        >

          <VictoryBar horizontal

            barRatio={0.6}
            //   alignment="start"
            style={{
              data: { fill: "#79B45D" },
            }}

            data={dataChart}
            labels={({ datum, index }) => index != 0 ? '| ' + convertNumber(datum.y) : ''}

          />

        </VictoryChart>

      )
    }
    function renderList() {
      return (

        <View style={styles.main}>
          <View style={styles.orderContent}>
            <View style={[styles.viewOrder, { flex: 0.12 }]}><Text style={styles.menuOrder}>STT</Text></View>
            <View style={[styles.viewOrder, { flex: 0.17 }]} ><Text style={styles.menuOrder}>Tháng</Text></View>
            <View style={[styles.viewOrder, { flex: 0.18 }]} ><Text style={styles.menuOrder}>Năm</Text></View>
            <View style={[styles.viewOrder, { flex: 0.27 }]}><Text style={styles.menuOrder}>Tổng SL đơn</Text></View>
            <View style={[styles.viewOrder, { flex: 0.28 }]} ><Text style={styles.menuOrder}>Tổng tiền</Text></View>
          </View>
          <ScrollView>
            <View >
              {rdata.map((e, index) =>

              (<View style={styles.order} key={index}>
                <View style={{ flex: 0.12, alignItems: 'center', padding: 5 }}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={{ flex: 0.2, alignItems: 'flex-start', padding: 5 }}>
                  <Text>{e[0]}</Text>
                </View>
                <View style={{ flex: 0.2, alignItems: 'flex-start', padding: 5 }}>
                  <Text>{e[1]}</Text>
                </View>
                <View style={{ flex: 0.15, alignItems: 'center', padding: 5 }}>
                  <Text>{e[2]}</Text>
                </View>
                <View style={{ flex: 0.32, alignItems: 'flex-end', padding: 5 }}>
                  <Text>{convertNumber(e[3])}</Text>
                </View>
              </View>)

              )}
            </View>

            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ flex: 0.53, alignItems: 'center', padding: 5 }}>
                <Text style={styles.sum}>Tổng cộng</Text>
              </View>
              <View style={{ flex: 0.15, alignItems: 'center', padding: 5 }}>
                <Text style={styles.sum}>{sum}</Text>
              </View>
              <View style={{ flex: 0.32, alignItems: 'flex-end', padding: 5 }}>
                <Text style={styles.sum}>{total}</Text>
              </View>
            </View>
          </ScrollView>
        </View>

      );
    };

    return (
      <View style={{ flex: 1, backgroundColor: COLORS.lightGray2 }}>
        {/* Nav bar section */}


        {/* Header section */}


        {/* Category Header Section */}
        {renderCategoryHeaderSection()}

        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          {
            viewMode == "list" &&
            <View>
              {renderList()}
              {/* {renderIncomingExpenses()} */}
            </View>
          }
          {
            viewMode == "chart" &&
            <View>
              {renderChart()}
              {/* {renderSummary()}  */}
            </View>
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },

  order: {
    flex: 1,
    flexDirection: 'row',
  },

  viewOrder: {
    backgroundColor: '#5E8D48',
    borderWidth: 0.2,
    borderColor: 'white',
    alignItems: 'center',

    // fontSize: 18,
    // color:'white',
  },
  orderContent: {
    flexDirection: 'row',
    //   flexWrap:'wrap',
    //  flex:1,
    //  justifyContent:'center',
  },
  menuOrder: {

    fontSize: 18,
    color: 'white',
    padding: 5,

  },
  sum: {
    fontSize: 18,
    fontWeight: 'bold',
  }

});