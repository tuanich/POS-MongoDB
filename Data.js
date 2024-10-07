import { StyleSheet, Text, ScrollView, TouchableOpacity, View, } from "react-native";
import { convertNumber } from "./source/api";
import { COLORS, FONTS, SIZES, icons, } from './source/constants';
import { useState } from "react";
export default function Data({ item, addOrder }) {




  return (
    <ScrollView>
      {
        item ? item.map((files, index) => (
          <TouchableOpacity key={index} onPress={() => addOrder(files.sku, files.description, files.price)}>
            <View style={styles.button}>
              <View style={{ flex: 1.5, alignItems: 'flex-start' }}>
                <Text>{index + 1}. {files.description}</Text>
              </View>
              <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                <Text>{convertNumber(files.price)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
          : null}
    </ScrollView>
  );

};

const styles = StyleSheet.create({

  button: {
    // alignItems: "flex-start",
    backgroundColor: "#ebebeb",
    // borderColor: COLORS.lightGray2,
    borderColor: "white",
    borderWidth: 0.2,
    padding: 12,
    fontSize: 16,
    flexDirection: "row",
    flexWrap: 'wrap',

  },
});