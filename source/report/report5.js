import { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image } from 'react-native';
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis, VictoryLabel, VictoryLine } from 'victory-native';

import { convertNumber } from '../api';
import { Svg } from 'react-native-svg';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';


export default function report5({ data, name }) {
  const [rdata, setRdata] = useState([]);
  const [sum, setSum] = useState();
  const [total, setTotal] = useState();
  const [viewMode, setViewMode] = useState("chart");
  const [dataP, setDataP] = useState([]);
  const [year, setYear] = useState();
  if (typeof data != 'undefined' && data != null) {
    useEffect(() => {
      var sum = 0;
      var total = 0;
      //  const d = data.filter((item,i)=>i!==0);


      const d = data.map(item => item);
      setYear(d[0]._id.substring(6, 10))

      d.sort((a, b) => (b._id.localeCompare(a._id)));
      d.map(item => {
        sum += item.quantity;
        total += item.total;
      });

      setRdata(d);
      setSum(convertNumber(sum));
      setTotal(convertNumber(total));

      setDataP(processData());

    }, [data])
    const processData = useCallback(() => {
      //  const d=data.map((item,index)=>((index==0)?(item[2]=0):item));


      if (typeof data == 'undefined' || data == []) {
        return [{ x: 0, y: 0 }];
      }
      else {
        const d = data.map(item => item);

        d.sort((a, b) => (b._id.localeCompare(a._id)));

        return (d.map((item, index) => {
          if (typeof item._id == 'undefined' || typeof item.total == 'undefined') return {
            x: '0',
            y: '0'
          }
          else {
            return {
              x: item._id.substring(0, 5),
              y: item.total,
            }
          }
        }))
      }
    }, [])

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

    function renderChart() {
      const dataChart = dataP;

      var thang = dataChart[0]['x'].substring(0, 2);
      return (
        <View style={{ flex: 1 }} key={name}>
          <VictoryChart
            theme={VictoryTheme.material}
            width={480}
            height={670}
            // domainPadding={{ y: 50 }}

            padding={{ left: 72, right: 82, top: 20, bottom: 30 }}


            domainPadding={{ x: 30 }}
          //  domainPadding={{x: [10000, -1000], y: [100,10]}}
          //  domain={{ y: [0, 20000000] }}
          >

            <VictoryBar

              barRatio={0.5}
              //   alignment="start"
              style={{
                data: { fill: "#79B45D" },
              }}

              data={dataChart}
              //   labels={({ datum, index }) => index != 0 ? '| ' + convertNumber(datum.y) : ''}
              labels={({ datum }) => convertNumber(datum.y)}
            />

          </VictoryChart>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'red', fontSize: 20 }}>
              Năm {year}
            </Text>

          </View>
        </View>

      )
    }
    function renderList() {
      return (

        <View style={styles.main}>
          <View style={styles.orderContent}>
            <View style={[styles.viewOrder, { flex: 0.12 }]}><Text style={styles.menuOrder}>STT</Text></View>
            <View style={[styles.viewOrder, { flex: 0.33 }]} ><Text style={styles.menuOrder}>Ngày</Text></View>
            <View style={[styles.viewOrder, { flex: 0.27 }]}><Text style={styles.menuOrder}>Tổng SL đơn</Text></View>
            <View style={[styles.viewOrder, { flex: 0.28 }]} ><Text style={styles.menuOrder}>Tổng tiền</Text></View>
          </View>
          <ScrollView>
            <View >
              {rdata ? rdata.map((e, index) =>

              (<View style={styles.order} key={e._id + "-" + reportName}>
                <View style={{ flex: 0.12, alignItems: 'center', padding: 5 }}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={{ flex: 0.40, alignItems: 'flex-start', padding: 5 }}>
                  <Text>{e._id}</Text>
                </View>
                <View style={{ flex: 0.15, alignItems: 'center', padding: 5 }}>
                  <Text>{e.quantity}</Text>
                </View>
                <View style={{ flex: 0.32, alignItems: 'flex-end', padding: 5 }}>
                  <Text>{convertNumber(e.total)}</Text>
                </View>
              </View>)

              )
                : null}
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

      )
    };


    return (
      <View style={{ flex: 1, backgroundColor: COLORS.lightGray2 }} >
        {/* Nav bar section */}


        {/* Header section */}


        {/* Category Header Section */}
        {renderCategoryHeaderSection()}

        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          {
            viewMode == "list" &&
            <View>
              {
                renderList()
              }
              {/* {renderIncomingExpenses()} */}
            </View>
          }
          {
            viewMode == "chart" &&
            <View>
              {

                (typeof dataP != 'undefined' && typeof dataP[0] != 'undefined') ? (

                  dataP[0].x != 'undefined' ? renderChart() : null
                ) : null
              }
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

    fontSize: 16,
    color: 'white',
    padding: 5,

  },
  sum: {
    fontSize: 15,
    fontWeight: 'bold',
  }

});
