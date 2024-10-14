import React from "react";


import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import { convertNumber } from "../api";


import { COLORS, FONTS, SIZES } from '../constants';





export default function RenderItem({ data, selectedCategory, setSelectCategoryByName, name }) {


    return (data ?
        data.map((item, index) =>
        (
            <TouchableOpacity key={`${index}-${name}`}

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