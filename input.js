
import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";


export default function Input({
    label,
    outlined,
    placeholder,
    leftIcon,
    rightIcon,
    numLines,
    onChangeHandler,
    secure,
    validate,
    errorMessage,
    errColor = 'red',
    bgColor = 'white',
    value

}) {


    const containerBorder = outlined ? styles.outlined : styles.standard;

    return (
        <View style={{ padding: 10 }}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.container, containerBorder, { borderStartColor: bgColor }]}>
                <View style={{ paddingRight: 8 }}>{leftIcon}</View>
                <TextInput
                    secureTextEntry={secure}
                    placeholder={
                        placeholder ? placeholder : label ? `Enter ${label}` : ''
                    }
                    value={value}
                    onChangeText={onChangeHandler}
                    onEndEditing={validate}
                    multiline={numLines > 1 ? trueL : false}
                    numberOfLines={numLines}
                    style={{ flex: 4 }}
                />
                <View style={{ paddingLeft: 8 }}>{rightIcon}</View>
            </View>
            <Text style={{ color: errColor }}>{errorMessage}</Text>
        </View>
    )
}

const styles = StyleSheet.create({

    label: {
        //       fontWeight: 500,
        marginBottom: 5,
        textTransform: 'capitalize',
    },
    container: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',

    },
    outlined: {
        borderColor: 'darkgrey',
        borderRadius: 8,
        borderWidth: 1,
    },
    standard: {
        borderBottomColor: 'darkgrey',
        borderBottomWidth: 1,
    }

})