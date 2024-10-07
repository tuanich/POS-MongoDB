import { StyleSheet, Text, View } from 'react-native';
export default function paymentDetail({ item }) {

    const convertNumber = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return (
        <View style={styles.order}>
            <View style={{ flex: 0.74, alignItems: 'flex-start', padding: 4 }}>

                <Text>-{item.description}</Text>
            </View>
            <View style={{ flex: 0.05, alignItems: 'center', padding: 4 }}>
                <Text>{item.quantity}</Text>
            </View>

            <View style={{ flex: 0.22, alignItems: 'flex-end', padding: 4 }}>
                <Text>{convertNumber(parseInt(item.quantity) * parseInt(item.price))}</Text>
            </View>
            {/* <View style={{flex:0.175,alignItems:'flex-end',padding:4}}>
                  <Text>{convertNumber(e.item.price*e.item.quan)}</Text> 

                 </View>   */}

        </View>
    )
}
const styles = StyleSheet.create({

    order: {
        fontSize: 14,
        padding: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 1,

    }

});