import React, { useCallback, useEffect, useState } from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import { convertNumber } from "../api";
import { COLORS, SIZES, icons } from '../constants';
import RenderItem from './renderItem';
import RenderChart from "./renderChart";

const colorScales = ['#4E8397', '#845EC2', '#2C73D2', '#FF6F91', '#008F7A', '#0081CF', '#4B4453', "#BEC1D2", '#42B0FF', '#C4FCEF', '#898C95', '#FFD573', '#95A9B8', '#008159', '#FF615F', '#8e44ad', '#FF0000', '#D0E9F4', '#AC5E00'];

export default function report1({ data, name }) {
    const [viewMode, setViewMode] = useState("chart");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [summary, setSummary] = useState({ sum: 0, total: 0, dataP: [] });

    useEffect(() => {
        if (data) {
            let sum = 0;
            let total = 0;
            data.forEach(item => {
                sum += item.quantity;
                total += item.total;
            });
            setSummary({
                sum: convertNumber(sum),
                total: convertNumber(total),
                dataP: processData(data)
            });
        }
    }, [data]);

    const processData = useCallback((data) => {
        const online = ["TakeAway", "Grab", "Baemin", "Goviet", "Now", "Loship"];
        let dataOffline = data.filter(item => !online.includes(item._id));
        let dataOnline = data.filter(item => online.includes(item._id));

        let sl = 0;
        let tt = 0;
        dataOffline.forEach(item => {
            sl += Number(item.quantity);
            tt += Number(item.total);
        });
        dataOffline = { '_id': 'Ăn tại quán', 'quantity': sl, 'total': tt };
        dataOnline.push(dataOffline);
        dataOnline.sort((a, b) => parseInt(b.total) - parseInt(a.total));

        setSelectCategoryByName(dataOnline[0]._id);

        let total = dataOnline.reduce((a, b) => a + (parseInt(b.total) || 0), 0);
        return dataOnline.map((item, index) => ({
            label: `${((item.total / total) * 100).toFixed(0)}%`,
            y: Number(item.total),
            Count: item.quantity,
            color: colorScales[index],
            name: item._id,
            id: index,
            subTotal: item.total,
        }));
    }, []);

    const setSelectCategoryByName = useCallback((name) => {
        setSelectedCategory({ name });
    }, []);

    const renderCategoryHeaderSection = () => (
        <View style={{ alignItems: 'flex-end', padding: 8 }}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: viewMode === "chart" ? COLORS.secondary : null,
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
                            tintColor: viewMode === "chart" ? COLORS.white : COLORS.darkgray,
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: viewMode === "list" ? COLORS.secondary : null,
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
                            tintColor: viewMode === "list" ? COLORS.white : COLORS.darkgray,
                        }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderChart = () => (
        <RenderChart
            chartData={summary.dataP}
            selectedCategory={selectedCategory}
            setSelectCategoryByName={setSelectCategoryByName}
        />
    );

    const renderSummary = () => (
        <View style={{ padding: SIZES.padding }}>
            <RenderItem
                data={summary.dataP}
                setSelectCategoryByName={setSelectCategoryByName}
                selectedCategory={selectedCategory}
                name={name}
            />
        </View>
    );

    const renderList = () => (
        <View style={styles.main}>
            <View style={styles.orderContent}>
                <View style={[styles.viewOrder, { flex: 0.12 }]}><Text style={styles.menuOrder}>STT</Text></View>
                <View style={[styles.viewOrder, { flex: 0.35 }]} ><Text style={styles.menuOrder}>Phương tiện</Text></View>
                <View style={[styles.viewOrder, { flex: 0.18 }]}><Text style={styles.menuOrder}>SL đơn</Text></View>
                <View style={[styles.viewOrder, { flex: 0.35 }]} ><Text style={styles.menuOrder}>Thành tiền</Text></View>
            </View>
            <ScrollView>
                <View>
                    {data ? data.map((e, index) => (
                        <View style={styles.order} key={e._id + "-" + name}>
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
                        </View>
                    )) : null}
                </View>

                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: 0.5, alignItems: 'center', padding: 5 }}>
                        <Text style={styles.sum}>Tổng cộng</Text>
                    </View>
                    <View style={{ flex: 0.15, alignItems: 'center', padding: 5 }}>
                        <Text style={styles.sum}>{summary.sum}</Text>
                    </View>
                    <View style={{ flex: 0.36, alignItems: 'flex-end', padding: 5 }}>
                        <Text style={styles.sum}>{summary.total}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightGray2 }}>
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
    );
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
    },
    orderContent: {
        flexDirection: 'row',
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
