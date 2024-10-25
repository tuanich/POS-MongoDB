import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { mongoURL, apikey } from '@env';
import * as FileSystem from 'expo-file-system';


//import config from "./app.json";

export default function setting() {
  const [Url, setUrl] = useState({ name: mongoURL, key: apikey });

  const updateEnvFile = async () => {

    const envFilePath = `${FileSystem.documentDirectory}.env`;
    const newEnvContent = `mongoURL=${Url.name}\n apikey=${Url.key}\n`;


    try {
      const fileInfo = await FileSystem.getInfoAsync(envFilePath);
      if (!fileInfo.exists) {
        // Create the file if it doesn't exist
        await FileSystem.writeAsStringAsync(envFilePath, '', { encoding: FileSystem.EncodingType.UTF8 });
      }

      await FileSystem.writeAsStringAsync(envFilePath, newEnvContent, { encoding: FileSystem.EncodingType.UTF8 });
      Alert.alert('Success', 'Environment variable updated successfully!');
    } catch (error) {
      Alert.alert('Error', `Failed to update environment variable. ${error.message}`);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.textI}>API URL:</Text>
        <TextInput
          style={styles.textInput}
          value={Url.name}
          onChangeText={text => setUrl({ ...Url, ['name']: text })}
        />
      </View>
      <View style={styles.box}>
        <Text style={styles.textI}>API KEY:</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          value={Url.key}
          onChangeText={text => setUrl({ ...Url, ['key']: text })}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={updateEnvFile}>
          <Text style={styles.textButton}>Cập nhật</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  box: {
    marginBottom: 20,
  },
  textI: {
    fontSize: 18,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#79B45D',
    padding: 15,
    borderRadius: 12,
  },
  textButton: {
    color: 'white',
    fontSize: 16,
  },
});


