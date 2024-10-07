import { StyleSheet, Text, ScrollView, TouchableOpacity, View, } from "react-native";
import { Feather } from '@expo/vector-icons';
import { convertNumber } from "./source/api";
import { COLORS, FONTS, SIZES, icons, } from './source/constants';
export default function DataItem({ item, editItem, delItem }) {
  return (
    <ScrollView>
      {item ?
        item.map((files, index) => (
          <View style={styles.button} key={files._id}>
            <View style={{ flex: 2.8 }}>
              <TouchableOpacity onPress={() => editItem(index)}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1.5, alignItems: 'flex-start' }}>
                    <Text>{index + 1}. {files.description}</Text>
                  </View>
                  <View style={{ flex: 0.3, }}>
                    <Text>{convertNumber(files.price)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0., padding: 4 }}>
              <TouchableOpacity onPress={() => delItem(index, files.description)}>
                <View>

                  <Feather name="delete" size={24} color="black" /></View>
              </TouchableOpacity>
            </View>
          </View>
        ))
        : null}
    </ScrollView>
  );

};

const styles = StyleSheet.create({

  button: {
    // alignItems: "flex-start",
    // backgroundColor: "#DDDDDD",
    backgroundColor: COLORS.lightGray2,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    flexDirection: "row",
    // flexWrap: 'wrap',

  },
});