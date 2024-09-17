import { StyleSheet, Text, ScrollView,TouchableOpacity, View, } from "react-native";

export default function Data( {item,addOrder} ) {
  

  const convertNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
    
      return (
    <ScrollView>
      { 
      item.map((files, index) => (
         <TouchableOpacity key={index} onPress={()=>addOrder(files[0],files[1],files[2])}>
         <View style={styles.button}>
           <View style={{flex:1.5, alignItems:'flex-start'}}>
           <Text>{index+1}. {files[1]}</Text>
           </View>
           <View style={{flex:0.5, alignItems:'flex-end'}}>
           <Text>{convertNumber(files[2])}</Text>
           </View>
         </View>
       </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  
  button: {
   // alignItems: "flex-start",
    backgroundColor: "#DDDDDD",
    borderColor: "white",
    borderWidth:0.2,
    padding: 12,
    fontSize:16,
    flexDirection:"row",
    flexWrap:'wrap',

  },
});