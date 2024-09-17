import * as React from 'react';
import { View, Text,TouchableOpacity,StyleSheet ,ScrollView,RefreshControl,ActivityIndicator,TextInput} from 'react-native';

import config from "./app.json";


export default function setting(){

    return (
        <View style={styles.main}>
         <View style={{flex:1 }}><Text style={styles.textButton}>URL=</Text><TextInput>{config.url}</TextInput></View> 
         {/* <View style={{flex:1 }}><TextInput>{config.url}</TextInput></View> */}
        </View>

);
};
const styles = StyleSheet.create({
    Button:{
        width:260,
        height:60,
        
        backgroundColor: '#79B45D',
        alignItems:'center',
        borderRadius: 12,
        justifyContent:'center',
        marginTop:15
      },
      textButton:{
       fontSize:25,
       color:'black',
      },
      main:{
        flex: 1, 
      }
})
