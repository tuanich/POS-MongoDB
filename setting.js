import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { mongoURL } from '@env';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TextInput } from 'react-native';

//import config from "./app.json";

export default function setting() {
  const [Url, setUrl] = useState(mongoURL);

  return (
    <View styel={{ flex: 1 }}>
      <View style={styles.box}>

        <View style={{ flex: 1, alignItems: 'flex-start', padding: 10 }}>
          <Text style={styles.textButton}>URL = </Text>

          <TextInput style={styles.textI} onChangeText={(value) => { setUrl(value); }}>{Url}</TextInput>

        </View>



      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <TouchableOpacity style={styles.Button}>
          <Text style={styles.textButton}>Cập nhật</Text>
        </TouchableOpacity>
      </View>
    </View>



  );
};
const styles = StyleSheet.create({
  Button: {

    width: 150,
    height: 50,

    backgroundColor: '#79B45D',
    alignItems: 'center',

    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 15
  },
  textButton: {

    padding: 10,
    fontSize: 20,
    color: 'white',
  },
  textI: {

    fontSize: 18,
    //   margin:5
    //   width:300,
    //   height:300,
    //   top :0,

  },
  main: {
    flex: 1

  },

  urlContent: {



  },
  box: {
    fontSize: 14,
    padding: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 1,
  }
})
