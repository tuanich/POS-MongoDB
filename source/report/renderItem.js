import React from "react";
import * as Crypto from 'expo-crypto';

import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import { convertNumber } from "../api";


import { COLORS, FONTS, SIZES } from '../constants';


const colorScales = ['#4E8397', '#845EC2', '#2C73D2', '#FF6F91', '#008F7A', '#0081CF', '#4B4453', "#BEC1D2", '#42B0FF', '#C4FCEF', '#898C95', '#FFD573', '#95A9B8', '#008159', '#FF615F', '#8e44ad', '#FF0000', '#D0E9F4', '#AC5E00'];


export default function RenderItem({ data, selectedCategory, setSelectCategoryByName, name }) {


    return (data ?
        data.map((item, index) =>
        (
            <TouchableOpacity key={index + "-" + name}

                style={{
                    marginTop: 3,
                    flexDirection: 'row',
                    height: 50,
                    paddingHorizontal: SIZES.radius,
                    borderRadius: 10,
                    backgroundColor: (selectedCategory && selectedCategory.name == item.name) ? item.color : COLORS.white
                }}
                onPress={() => {
                    let categoryName = item.name
                    setSelectCategoryByName(categoryName)
                }}
            >
                { }
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: (selectedCategory && selectedCategory.name == item.name) ? COLORS.white : item.color,
                            borderRadius: 5
                        }}
                    />

                    <Text style={{ marginLeft: SIZES.base, color: (selectedCategory && selectedCategory.name == item.name) ? COLORS.white : COLORS.primary, ...FONTS.h3 }}>{item.name}</Text>
                </View>


                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: (selectedCategory && selectedCategory.name == item.name) ? COLORS.white : COLORS.primary, ...FONTS.h4 }}>{item.Count} đơn - {parseInt(item.label) >= 10 ? item.label : '0' + item.label}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: (selectedCategory && selectedCategory.name == item.name) ? COLORS.white : COLORS.primary, ...FONTS.h4 }}>{convertNumber(item.subTotal)}</Text>
                    </View>
                </View>
            </TouchableOpacity>

        )
        )
        : null)
}