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

import { getReport7 } from "../mongo";
import { Svg } from 'react-native-svg';
import { COLORS, FONTS, SIZES, icons, colorScales, month } from '../constants';
import SelectDropdown from 'react-native-select-dropdown';

import RenderItem from './renderItem';

export default function report8({ data, reportName }) {

    const [viewMode, setViewMode] = useState("chart");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [summary, setSummary] = useState({ sum: 0, total: 0, dataP: [] });
    const [year, setYear] = useState(new Date().getFullYear());
    //  const [months, setMonth] = useState();
    const [rdata, setRdata] = useState(data);


    useEffect(() => {
        if (data) {
            const d = processData(data);
            setSummary({
                sum: convertNumber(d.sum),
                total: convertNumber(d.total),
                dataP: d.data
            });
        }
    }, [data]);

    const Report = useCallback((index, y) => {
        if (index == 0) {
            const processD = processData(data);
            setSummary({
                sum: convertNumber(processD.sum),
                total: convertNumber(processD.total),
                dataP: processD.data
            });
            setRdata(data);
        }
        else {
            let abortController = new AbortController();
            let aborted = abortController.signal.aborted; // true || false
            let data = async () => {
                let d = (await getReport7(index, y));

                aborted = abortController.signal.aborted; // before 'if' statement check again if aborted

                if (!abortController.signal.aborted && d) {
                    //    const dataFilter= d.r7.filter((item,index)=>index!=0)

                    const processD = processData(d.r7);
                    setSummary({
                        sum: convertNumber(processD.sum),
                        total: convertNumber(processD.total),
                        dataP: processD.data
                    });
                    setRdata(d.r7);
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
        if (d.length === 0) return { sum: 0, total: 0, data: [] };
        else {
            let sum = 0;
            let total = 0;
            d = d.map(item => item);
            d.forEach(item => {
                sum += item.quantity;
                total += item.total;
            });

            const online = ["TakeAway", "Grab", "Baemin", "Goviet", "Now", "Loship"];
            let dataOffline = d.filter(item => !online.includes(item._id));
            let dataOnline = d.filter(item => online.includes(item._id));

            var sl = 0;
            var tt = 0;
            dataOffline.forEach(item => {
                sl += item.quantity;
                tt += item.total;
            });
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

    }, [data]);

    const setSelectCategoryByName = useCallback((name) => {

        let category = { name: name };
        setSelectedCategory(category);
    }, []);

    function renderChart() {

        const chartData = summary.dataP;
        const totalExpenseCount = chartData.reduce((a, b) => a + (b.Count || 0), 0);
        const total = chartData.reduce((a, b) => a + (b.subTotal || 0), 0);

        const PieChart = (
            <VictoryPie
                data={chartData}
                labels={(datum) => `${datum.y}`}
                radius={({ datum }) => (selectedCategory && selectedCategory.name === datum.name) ? SIZES.width * 0.4 : SIZES.width * 0.4 - 10}
                innerRadius={80}
                labelRadius={({ innerRadius }) => (SIZES.width * 0.4 + innerRadius) / 2.5}
                style={{
                    labels: { fill: "white", ...FONTS.body3 },
                    parent: { ...styles.shadow },
                }}
                width={Platform.OS === 'ios' ? SIZES.width * 0.8 : SIZES.width}
                height={Platform.OS === 'ios' ? SIZES.width * 0.8 : SIZES.width}
                colorScale={colorScales}
                events={[{
                    target: "data",
                    eventHandlers: {
                        onPress: () => [{
                            target: "labels",
                            mutation: (props) => {
                                const categoryName = chartData[props.index].name;
                                setSelectCategoryByName(categoryName);
                            }
                        }]
                    }
                }]}
            />
        );

        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {Platform.OS === 'ios' ? PieChart : <Svg width={SIZES.width} height={SIZES.width} style={{ width: "100%", height: "auto" }}>{PieChart}</Svg>}
                <View style={{ position: 'absolute', top: '41%', left: "40%" }}>
                    <Text style={{ ...FONTS.h2, textAlign: 'center' }}>{totalExpenseCount}</Text>
                    <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Tổng đơn</Text>
                    <Text style={{ ...FONTS.h4, textAlign: 'center' }}>{convertNumber(total)}</Text>
                </View>
            </View>
        );
    };

    const renderSummary = () => (
        <View style={{ padding: SIZES.padding }} key={`${reportName}-${Date.now()}`}>
            <RenderItem data={summary.dataP} setSelectCategoryByName={setSelectCategoryByName} selectedCategory={selectedCategory} name={reportName} />
        </View>
    );

    const renderList = () => (
        <View style={styles.main}>
            <View style={styles.orderContent}>
                <View style={[styles.viewOrder, { flex: 0.12 }]}><Text style={styles.menuOrder}>STT</Text></View>
                <View style={[styles.viewOrder, { flex: 0.32 }]} ><Text style={styles.menuOrder}>Phương tiện</Text></View>
                <View style={[styles.viewOrder, { flex: 0.21 }]}><Text style={styles.menuOrder}>SL đơn</Text></View>
                <View style={[styles.viewOrder, { flex: 0.35 }]} ><Text style={styles.menuOrder}>Thành tiền</Text></View>
            </View>
            <ScrollView>
                <View>
                    {rdata ? rdata.map((e, index) => (
                        <View style={styles.order} key={80 + "-" + index + "-" + reportName}>
                            <View style={{ flex: 0.11, alignItems: 'center', padding: 5 }}>
                                <Text>{index + 1}</Text>
                            </View>
                            <View style={{ flex: 0.32, alignItems: 'flex-start', padding: 5 }}>
                                <Text>{e._id}</Text>
                            </View>
                            <View style={{ flex: 0.20, alignItems: 'flex-end', padding: 5 }}>
                                <Text>{e.quantity}</Text>
                            </View>
                            <View style={{ flex: 0.37, alignItems: 'flex-end', padding: 4 }}>
                                <Text>{convertNumber(e.total)}</Text>
                            </View>
                        </View>
                    )) : (
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                            <Text>No data...</Text>
                        </View>
                    )}
                </View>

                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: 0.5, alignItems: 'center', padding: 5 }}>
                        <Text style={styles.sum}>Tổng cộng</Text>
                    </View>
                    <View style={{ flex: 0.20, alignItems: 'flex-end', padding: 5 }}>
                        <Text style={styles.sum}>{summary.sum}</Text>
                    </View>
                    <View style={{ flex: 0.37, alignItems: 'flex-end', padding: 5 }}>
                        <Text style={styles.sum}>{summary.total}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );



    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightGray2 }} >
            {/* Nav bar section */}


            {/* Header section */}


            {/* Category Header Section */}
            {renderCategoryHeaderSection()}

            <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
                {viewMode === "list" && renderList()}
                {viewMode === "chart" && (
                    <View>
                        {summary.dataP.length > 0 && renderChart()}
                        {summary.dataP.length > 0 && renderSummary()}
                    </View>
                )}
            </ScrollView>
        </View>
    )
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
        fontSize: 15,
        fontWeight: 'bold',
    }
})


