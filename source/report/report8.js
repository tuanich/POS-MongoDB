import React, { useRef, useCallback, useEffect, useState } from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Animated,
    Platform
} from 'react-native';
import { VictoryPie } from 'victory-native';
import { convertNumber } from "../api";
import * as Crypto from 'expo-crypto';
import { getReport7 } from "../mongo";
import { Svg } from 'react-native-svg';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
import SelectDropdown from 'react-native-select-dropdown';
const month = ["All", "Tháng 01", "Tháng 02", "Tháng 03", "Tháng 04", "Tháng 05", "Tháng 06", "Tháng 07", "Tháng 08", "Tháng 09", "Tháng 10", "Tháng 11", "Tháng 12"];

const colorScales = ['#4E8397', '#845EC2', '#2C73D2', '#FF6F91', '#008F7A', '#0081CF', '#4B4453', "#BEC1D2", '#42B0FF', '#C4FCEF',
    '#898C95', '#FFD573', '#95A9B8', '#008159', '#FF615F', '#8e44ad', '#FF0000', '#D0E9F4', '#AC5E00',
    '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
    '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E',
    '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC',
    '#E67300', '#8B0707', '#329262', '#5574A6',
];
import RenderItem from './renderItem';

export default function report8({ data, name }) {

    const [viewMode, setViewMode] = useState("chart");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sum, setSum] = useState();
    const [total, setTotal] = useState();
    const [dataP, setDataP] = useState([]);
    const [year, setYear] = useState();
    const [months, setMonth] = useState();
    const [rdata, setRdata] = useState(data);

    if (typeof data != 'undefined' && data != null) {
        useEffect(() => {

            const d = processData(data);
            setSum(convertNumber(Number(d.sum)));
            setTotal(convertNumber(Number(d.total)));
            setDataP(d.data);
            var dt = new Date();

            setYear(dt.getFullYear());
            setMonth(dt.getMonth() + 1);

        }, [data]);

        const Report = useCallback((index, y) => {
            if (index == 0) {
                const processD = processData(data);
                setDataP(processD.data);
                setSum(convertNumber(Number(processD.sum)));
                setTotal(convertNumber(Number(processD.total)));
                setRdata(data);
            }
            else {
                let abortController = new AbortController();
                let aborted = abortController.signal.aborted; // true || false
                let data = async () => {
                    let d = (await getReport7(index, y));

                    aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
                    if (aborted === false) {
                        if (typeof d != 'undefined') {
                            //    const dataFilter= d.r7.filter((item,index)=>index!=0)

                            const dataFilter = d.r7;
                            const processD = processData(dataFilter);
                            setRdata(dataFilter);
                            setDataP(processD.data);
                            setSum(convertNumber(Number(processD.sum)));
                            setTotal(convertNumber(Number(processD.total)));
                        }
                    }
                }
                data();
                return () => {
                    abortController.abort();
                }
            };
        }, [])

        function selectBox() {
            return (

                <SelectDropdown
                    data={month}
                    onSelect={(selectedItem, index) => {

                        Report(index, year);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                    defaultButtonText='Chọn tháng'
                    defaultValueByIndex={0}
                />

            )
        }

        function renderCategoryHeaderSection() {
            return (
                //    <View style={{ flexDirection: 'row', padding: SIZES.padding, justifyContent: 'space-between', alignItems: 'center' }}>
                //         {/* Title */}

                //         {/* Button */}

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.75, flexDirection: 'row', alignSelf: 'flex-start', padding: 5 }}>
                        {selectBox()}
                    </View>
                    <View style={{ flex: 0.25, flexDirection: 'row', alignSelf: 'flex-end', padding: 5 }}>

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
                // </View>
            )
        }
        const processData = useCallback((d) => {
            if (JSON.stringify(d) != '[]') {
                var sum = 0;
                var total = 0;
                d.map(item => {
                    sum += item.quantity;
                    total += item.total;
                });


                const online = ["TakeAway", "Grab", "Baemin", "Goviet", "Now", "Loship"];
                let dataOffline = d.filter(item => !online.includes(item._id));
                let dataOnline = d.filter(item => online.includes(item._id));

                var sl = 0;
                var tt = 0;
                dataOffline.map(item => {
                    sl += Number(item.quantity);
                    tt += Number(item.total);
                })
                dataOffline = { '_id': 'Ăn tại quán', 'quantity': sl, 'total': tt };
                dataOnline.push(dataOffline);
                dataOnline.sort((a, b) => parseInt(b.total) - parseInt(a.total));
                setSelectCategoryByName(dataOnline[0]._id);


                //  let total = dataOnline.reduce((a, b) => a + (parseInt(b[2]) || 0), 0)
                //  let count = dataOnline.reduce((a, b) => a + (parseInt(b[1]) || 0), 0)
                let dataChart = dataOnline.map((item, index) => {
                    let percent = (item.total / total * 100).toFixed(0);
                    return {
                        label: `${percent}%`,
                        y: Number(item.total),
                        Count: item.quantity,
                        color: colorScales[index],
                        name: item._id,
                        id: index,
                        subTotal: item.total,
                    }
                })

                return { sum: sum, total: total, data: dataChart };
            }
            else return []
        }, [data]);

        const setSelectCategoryByName = useCallback((name) => {

            let category = { name: name };
            setSelectedCategory(category);
        }, []);

        function renderChart() {

            let chartData = dataP;

            // let colorScales = chartData.map((item) => item.color)
            // let colorScales = colorScales.map((item) => item[0]);
            let totalExpenseCount = chartData.reduce((a, b) => a + (b.Count || 0), 0)
            let total = chartData.reduce((a, b) => a + (b.subTotal || 0), 0)




            if (Platform.OS == 'ios') {
                return (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <VictoryPie

                            data={chartData}
                            labels={(datum) => `${datum.y}`}
                            radius={({ datum }) => (selectedCategory && selectedCategory.name == datum.name) ? SIZES.width * 0.4 : SIZES.width * 0.4 - 10}
                            innerRadius={80}
                            labelRadius={({ innerRadius }) => (SIZES.width * 0.4 + innerRadius) / 2.5}
                            style={{
                                labels: { fill: "white", ...FONTS.body3 },
                                parent: {
                                    ...styles.shadow
                                },
                            }}
                            width={SIZES.width * 0.8}
                            height={SIZES.width * 0.8}
                            colorScale={colorScales}
                            events={[{
                                target: "data",
                                eventHandlers: {
                                    onPress: () => {
                                        return [{
                                            target: "labels",
                                            mutation: (props) => {
                                                let categoryName = chartData[props.index].name
                                                setSelectCategoryByName(categoryName)
                                            }
                                        }]
                                    }
                                }
                            }]}

                        />

                        <View style={{ position: 'absolute', top: '41%', left: "41%" }}>
                            <Text style={{ ...FONTS.h1, textAlign: 'center' }}>{totalExpenseCount}</Text>
                            <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Tổng đơn</Text>
                            <Text style={{ ...FONTS.h4, textAlign: 'center' }}>{convertNumber(total)}</Text>
                        </View>
                    </View>

                )
            }
            else {
                // Android workaround by wrapping VictoryPie with SVG
                return (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Svg width={SIZES.width} height={SIZES.width} style={{ width: "100%", height: "auto" }}>

                            <VictoryPie
                                standalone={false} // Android workaround
                                data={chartData}
                                labels={(datum) => `${datum.y}`}
                                radius={({ datum }) => (selectedCategory && selectedCategory.name == datum.name) ? SIZES.width * 0.4 : SIZES.width * 0.4 - 10}
                                innerRadius={80}
                                labelRadius={({ innerRadius }) => (SIZES.width * 0.4 + innerRadius) / 2.5}
                                style={{
                                    labels: { fill: "white", ...FONTS.body3 },
                                    parent: {
                                        ...styles.shadow
                                    },
                                }}
                                width={SIZES.width}
                                height={SIZES.width}
                                colorScale={colorScales}
                                events={[{
                                    target: "data",
                                    eventHandlers: {
                                        onPress: () => {
                                            return [{
                                                target: "labels",
                                                mutation: (props) => {
                                                    let categoryName = chartData[props.index].name
                                                    setSelectCategoryByName(categoryName)
                                                }
                                            }]
                                        }
                                    }
                                }]}

                            />
                        </Svg>
                        <View style={{ position: 'absolute', top: '42%', left: "42%" }}>
                            <Text style={{ ...FONTS.h1, textAlign: 'center' }}>{totalExpenseCount}</Text>
                            <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Tổng đơn</Text>
                            <Text style={{ ...FONTS.h4, textAlign: 'center' }}>{convertNumber(total)}</Text>
                        </View>
                    </View>
                )
            }
        }



        function renderSummary() {
            let data = dataP;



            return (
                <View style={{ padding: SIZES.padding }} key={Crypto.randomUUID() + "-" + 100}>
                    <RenderItem data={data} setSelectCategoryByName={setSelectCategoryByName} selectedCategory={selectedCategory} name={name} />
                </View>

            )
        }


        function renderList() {
            return (
                <View style={styles.main}>
                    <View style={styles.orderContent}>
                        <View style={[styles.viewOrder, { flex: 0.12 }]}><Text style={styles.menuOrder}>STT</Text></View>
                        <View style={[styles.viewOrder, { flex: 0.35 }]} ><Text style={styles.menuOrder}>Phương tiện</Text></View>
                        <View style={[styles.viewOrder, { flex: 0.18 }]}><Text style={styles.menuOrder}>SL đơn</Text></View>
                        <View style={[styles.viewOrder, { flex: 0.35 }]} ><Text style={styles.menuOrder}>Thành tiền</Text></View>
                    </View>
                    <ScrollView>
                        <View>
                            {rdata ? rdata.map((e, index) =>
                            (<View style={styles.order} key={index + 80}>
                                <View style={{ flex: 0.11, alignItems: 'center', padding: 5 }}>
                                    <Text>{index + 1}</Text>
                                </View>
                                <View style={{ flex: 0.38, alignItems: 'flex-start', padding: 5 }}>
                                    <Text>{e._id}</Text>
                                </View>
                                <View style={{ flex: 0.15, alignItems: 'center', padding: 5 }}>
                                    <Text>{e.quantity}</Text>
                                </View>
                                <View style={{ flex: 0.37, alignItems: 'flex-end', padding: 4 }}>
                                    <Text>{convertNumber(e.total)}</Text>
                                </View>
                            </View>))
                                : null}

                        </View>

                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 0.5, alignItems: 'center', padding: 5 }}>
                                <Text style={styles.sum}>Tổng cộng</Text>
                            </View>
                            <View style={{ flex: 0.15, alignItems: 'center', padding: 5 }}>
                                <Text style={styles.sum}>{sum}</Text>
                            </View>
                            <View style={{ flex: 0.36, alignItems: 'flex-end', padding: 5 }}>
                                <Text style={styles.sum}>{total}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>)
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
                            {(typeof dataP != 'undefined' && typeof dataP[0] != 'undefined') ? ([

                                dataP[0].Count != 0 ? renderChart() : null
                            ]) : null}
                            {

                                (typeof dataP != 'undefined' && typeof dataP[0] != 'undefined') ? ([

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


