import React from "react";
import {
    View,
    Text,
    Platform,
    StyleSheet
} from 'react-native';
import { VictoryPie } from 'victory-native';
import { convertNumber } from "../api";

import { Svg } from 'react-native-svg';
import { FONTS, SIZES } from '../constants';


const colorScales = ['#4E8397', '#845EC2', '#2C73D2', '#FF6F91', '#008F7A', '#0081CF', '#4B4453', "#BEC1D2", '#42B0FF', '#C4FCEF', '#898C95', '#FFD573', '#95A9B8', '#008159', '#FF615F', '#8e44ad', '#FF0000', '#D0E9F4', '#AC5E00'];


export default function RenderChart({ chartData, selectedCategory, setSelectCategoryByName }) {


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

                <View style={{ position: 'absolute', top: '42%', left: "42%" }}>
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

