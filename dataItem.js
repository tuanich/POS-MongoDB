import { StyleSheet, Text, ScrollView, TouchableOpacity, View, } from "react-native";
import { Feather } from '@expo/vector-icons';
import { convertNumber } from "./source/api";
export default function DataItem({ item, editItem, delItem }) {
  //console.log("item: ", item);
  if (typeof item != 'undefined') {

    return (
      <ScrollView>
        {
          item.map((files, index) => (
            <View style={styles.button} key={files[0]}>
              <View style={{ flex: 2.8 }}>
                <TouchableOpacity onPress={() => editItem(index)}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1.5, alignItems: 'flex-start' }}>
                      <Text>{index + 1}. {files[1]}</Text>
                    </View>
                    <View style={{ flex: 0.3, }}>
                      <Text>{convertNumber(files[2])}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0., padding: 4 }}>
                <TouchableOpacity onPress={() => delItem(index)}>
                  <View>

                    <Feather name="delete" size={24} color="black" /></View>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({

  button: {
    // alignItems: "flex-start",
    backgroundColor: "#DDDDDD",
    borderColor: "white",
    borderWidth: 0.2,
    padding: 12,
    fontSize: 14,
    flexDirection: "row",
    // flexWrap: 'wrap',

  },
});