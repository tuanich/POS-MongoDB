import React, { useRef, useCallback, useEffect, useState } from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,

    Image,

    TouchableOpacity,

} from 'react-native';

import { convertNumber } from "../api";

import RenderChart from "./renderChart";
import { COLORS, SIZES, icons, } from '../constants';
import RenderItem from './renderItem';
import * as Crypto from 'expo-crypto';


const colorScales = ['#4E8397', '#845EC2', '#2C73D2', '#FF6F91', '#008F7A', '#0081CF', '#4B4453', "#BEC1D2", '#42B0FF', '#C4FCEF', '#898C95', '#FFD573', '#95A9B8', '#008159', '#FF615F', '#8e44ad', '#FF0000', '#D0E9F4', '#AC5E00'];

export default function report3({ data, name }) {
    const [viewMode, setViewMode] = useState("chart");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sum, setSum] = useState();
    const [total, setTotal] = useState();
    const [dataP, setDataP] = useState([]);
    const [rdata, setRdata] = useState([]);

    if (typeof data != 'undefined' && data != null) {
        useEffect(() => {

            var sum = 0;
            var total = 0;
            //  const d=data.filter((item,i)=>i!==0); 

            const d = data;
            d.map(item => {
                sum += item[1];
                total += item[2];
            });
            setSum(convertNumber(sum));
            setTotal(convertNumber(total));
            setRdata(d);
            setDataP(processData());
        }, [data]);

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

            let total = data.reduce((a, b) => a + (parseInt(b[2]) || 0), 0)
            //  let count = dataOnline.reduce((a, b) => a + (parseInt(b[1]) || 0), 0)
            //   let dataFinal= data.filter((item,index)=>(index!=0));
            let dataFinal = data.map(item => item);

            dataFinal = dataFinal.sort((a, b) => parseInt(b[2]) - parseInt(a[2]));
            setSelectCategoryByName(dataFinal[0][0]);
            let dataChart = dataFinal.map((item, index) => {

                let percent = (item[2] / total * 100).toFixed(0);

                return {
                    label: `${percent}%`,
                    y: Number(item[2]),
                    Count: item[1],
                    color: colorScales[index],
                    name: item[0],
                    id: index,
                    subTotal: item[2],
                }
            })
            //   console.log(dataChart);
            return dataChart;
        }, [data]);

        const setSelectCategoryByName = useCallback((name) => {

            let category = { name: name };
            setSelectedCategory(category);
        }, []);

        function renderChart() {
            let chartData = dataP;
            return (
                <RenderChart chartData={chartData} selectedCategory={selectedCategory} setSelectCategoryByName={setSelectCategoryByName} />
            )
        }



        function renderSummary() {
            let data = dataP;


            return (
                <View style={{ padding: 5 }} key={name}>
                    <RenderItem data={data} setSelectCategoryByName={setSelectCategoryByName} selectedCategory={selectedCategory} name={name} />
                </View>

            )

        }


        function renderList() {
            return (
                <View style={styles.main}>
                    <View style={styles.orderContent}>
                        <View style={[styles.viewOrder, { flex: 0.12 }]}><Text style={styles.menuOrder}>STT</Text></View>
                        <View style={[styles.viewOrder, { flex: 0.48 }]} ><Text style={styles.menuOrder}>Thức uống</Text></View>
                        <View style={[styles.viewOrder, { flex: 0.18 }]}><Text style={styles.menuOrder}>SL chai</Text></View>
                        <View style={[styles.viewOrder, { flex: 0.28 }]} ><Text style={styles.menuOrder}>Thành tiền</Text></View>
                    </View>
                    <ScrollView>
                        <View>
                            {rdata.map((e, index) =>
                            (<View style={styles.order} key={index}>
                                <View style={{ flex: 0.11, alignItems: 'center', padding: 5 }}>
                                    <Text>{index + 1}</Text>
                                </View>
                                <View style={{ flex: 0.48, alignItems: 'flex-start', padding: 5 }}>
                                    <Text>{e[0]}</Text>
                                </View>
                                <View style={{ flex: 0.15, alignItems: 'center', padding: 5 }}>
                                    <Text>{e[1]}</Text>
                                </View>
                                <View style={{ flex: 0.28, alignItems: 'flex-end', padding: 5 }}>
                                    <Text>{convertNumber(e[2])}</Text>
                                </View>
                            </View>))
                            }

                        </View>

                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 0.60, alignItems: 'center', padding: 5 }}>
                                <Text style={styles.sum}>Tổng cộng</Text>
                            </View>
                            <View style={{ flex: 0.15, alignItems: 'center', padding: 5 }}>
                                <Text style={styles.sum}>{sum}</Text>
                            </View>
                            <View style={{ flex: 0.28, alignItems: 'flex-end', padding: 5 }}>
                                <Text style={styles.sum}>{total}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );
        }

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
                            {renderList()}
                            {/* {renderIncomingExpenses()} */}
                        </View>
                    }
                    {
                        viewMode == "chart" &&
                        <View>
                            {renderChart()}
                            {
                                // console.log(dataP[0])
                                (typeof dataP != 'undefined' && typeof dataP[0] != 'undefined') ? ([
                                    //    console.log("-", dataP),
                                    dataP[0].Count != 0 ? renderSummary() : null
                                ]) : null
                            }
                        </View>
                    }
                </ScrollView>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },

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
})

