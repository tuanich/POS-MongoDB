import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, ActivityIndicator, TouchableOpacity, View, FlatList } from "react-native";
import { Feather } from '@expo/vector-icons';
import { convertNumber } from "./source/api";
export default function Order({ order, deleOrder, plus, minus }) {


  if (!order) {

    return (
      <ActivityIndicator
        size="large"
        animating={true}
        color="rgba(137,232,207,100)"
      />
    );
  }


  else {
    //  const data=order.filter (ord => ord.type === type);

    return (


      <FlatList
        data={order} // Assuming this is `this.state.data`

        keyExtractor={(e, index) => { return index.toString() }}

        renderItem={(e) => {

          return (<View style={styles.order}>
            <View style={{ flex: 0.9, alignItems: 'flex-start', padding: 4 }}>

              <Text>- {e.item.description}</Text>
            </View>
            <TouchableOpacity onPress={() => minus(e.index)}>
              <View style={{ alignItems: 'flex-end', padding: 4 }}>

                <Feather name="minus" size={24} color="black" /></View>
            </TouchableOpacity>

            <View style={{ flex: 0.05, alignItems: 'center', padding: 4 }}>

              <Text>{e.item.quantity}</Text>
            </View>
            <TouchableOpacity onPress={() => plus(e.index)}>
              <View style={{ alignItems: 'flex-end', padding: 4 }}>

                <Feather name="plus" size={24} color="black" />
              </View>
            </TouchableOpacity>


            <View style={{ flex: 0.25, alignItems: 'flex-end', padding: 4 }}>
              <Text>{convertNumber(parseInt(e.item.price) * parseInt(e.item.quantity))}</Text>
            </View>
            {/* <View style={{flex:0.175,alignItems:'flex-end',padding:4}}>
                     <Text>{convertNumber(e.item.price*e.item.quan)}</Text> 

                    </View>   */}
            <TouchableOpacity onPress={() => deleOrder(e.index)}>
              <View style={{ alignItems: 'flex-end', padding: 4 }}>

                <Feather name="delete" size={24} color="black" /></View>
            </TouchableOpacity>
          </View>)

        }}
      />
    );
  }
};
const styles = StyleSheet.create({
  order: {
    fontSize: 13,
    padding: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 1,

  }

})
