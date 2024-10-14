import { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView, Image, Platform, TouchableOpacity } from 'react-native';
import { convertNumber, getReport, } from '../api';
import { getReport6 } from '../mongo';
import SelectDropdown from 'react-native-select-dropdown';
import { VictoryPie } from 'victory-native';
import { Svg } from 'react-native-svg';
import { COLORS, FONTS, SIZES, icons, colorScales, month } from '../constants';

import RenderItem from './renderItem';

export default function report7({ data, reportName }) {
    const [viewMode, setViewMode] = useState("chart");
    const [selectedCategory, setSelectedCategory] = useState(null);
    //const [rdata,setRdata] =useState(data.filter((item,index)=>index!=0));
    const [rdata, setRdata] = useState(data);

    const [summary, setSummary] = useState({ sum: 0, total: 0, dataP: [] });
    const [year, setYear] = useState(new Date().getFullYear());



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
            d.sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity));

            setSelectCategoryByName(d[0].description);


            //  let total = dataOnline.reduce((a, b) => a + (parseInt(b[2]) || 0), 0)
            //  let count = dataOnline.reduce((a, b) => a + (parseInt(b[1]) || 0), 0)
            let dataChart = d.map((item, index) => {
                let percent = (item.quantity / sum * 100).toFixed(0);
                return {
                    label: `${percent}%`,
                    y: Number(item.quantity),
                    Count: item.quantity,
                    color: colorScales[index],
                    name: item.description,
                    id: index,
                    subTotal: item.total,
                }
            })

            return { sum: sum, total: total, data: dataChart };
        }

    }, [data]);

    const Report = useCallback((index, y) => {
        if (index == 0) {
            const processD = processData(data);
            //   setRdata(data.filter((item,index)=>index!=0));
            setRdata(data.map(item => item));
            setDataP(processD.data);
            setSum(convertNumber(Number(processD.sum)));
            setTotal(convertNumber(Number(processD.total)));
        }
        else {
            let abortController = new AbortController();
            let aborted = abortController.signal.aborted; // true || false
            let data = async () => {
                let d = (await getReport6(index, y));

                aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
                if (!abortController.signal.aborted && d) {
                    const processD = processData(d.r6);
                    //   setRdata(d.r6.filter((item,index)=>index!=0));

                    setRdata(d.r6);
                    setSummary({
                        sum: convertNumber(processD.sum),
                        total: convertNumber(processD.total),
                        dataP: processD.data
                    });
                }
            }
            data();
            return () => abortController.abort();

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

    function renderChart() {

        const chartData = summary.dataP;

        // let colorScales = chartData.map((item) => item.color)
        // let colorScales = colorScales.map((item) => item[0]);
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
    }



    function renderSummary() {

        return (
            <View style={{ padding: SIZES.padding }} key={`${reportName}-${Date.now()}`}>
                <RenderItem data={summary.dataP} setSelectCategoryByName={setSelectCategoryByName} selectedCategory={selectedCategory} name={reportName} />
            </View>

        )
    }
    const setSelectCategoryByName = useCallback((name) => {

        let category = { name: name };
        setSelectedCategory(category);
    }, []);

    function renderList() {

        return (
            <View style={styles.main}>
                <View style={styles.orderContent}>
                    <View style={[styles.viewOrder, { flex: 0.12 }]}><Text style={styles.menuOrder}>STT</Text></View>
                    <View style={[styles.viewOrder, { flex: 0.46 }]} ><Text style={styles.menuOrder}>Mô tả</Text></View>
                    <View style={[styles.viewOrder, { flex: 0.17 }]}><Text style={styles.menuOrder}>SL </Text></View>
                    <View style={[styles.viewOrder, { flex: 0.31 }]} ><Text style={styles.menuOrder}>Thành tiền</Text></View>
                </View>
                <ScrollView>
                    <View>
                        {rdata ? rdata.map((e, index) =>
                        (<View style={styles.order} key={"-" + reportName + "-" + index}>
                            <View style={{ flex: 0.11, alignItems: 'center', padding: 5 }}>
                                <Text>{index + 1}</Text>
                            </View>
                            <View style={{ flex: 0.45, alignItems: 'flex-start', padding: 5 }}>
                                <Text>{e.description}</Text>
                            </View>
                            <View style={{ flex: 0.15, alignItems: 'center', padding: 5 }}>
                                <Text>{e.quantity}</Text>
                            </View>
                            <View style={{ flex: 0.31, alignItems: 'flex-end', padding: 5 }}>
                                <Text>{convertNumber(e.total)}</Text>
                            </View>
                        </View>)) : (<View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                            <Text>No data...</Text>
                        </View>)
                        }

                    </View>

                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flex: 0.53, alignItems: 'center', padding: 5 }}>
                            <Text style={styles.sum}>Tổng cộng</Text>
                        </View>
                        <View style={{ flex: 0.22, alignItems: 'center', padding: 5 }}>
                            <Text style={styles.sum}>{summary.sum}</Text>
                        </View>
                        <View style={{ flex: 0.32, alignItems: 'flex-end', padding: 5 }}>
                            <Text style={styles.sum}>{summary.total}</Text>
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
    },
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

});
