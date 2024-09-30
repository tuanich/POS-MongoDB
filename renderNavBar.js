import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, Image } from 'react-native';
import { faSave, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { COLORS, FONTS, SIZES, icons, images } from './source/constants';
import { convertNumber } from './source/api';

export default function renderNavBar({ save, back, paymentAlert, type, sum }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        //height: 80,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        //    paddingHorizontal: SIZES.padding,
        backgroundColor: '#79B45D',
      }}
    >
      <TouchableOpacity
        style={{ justifyContent: 'center', width: 50, padding: 10 }}
        onPress={() => back()}
      >
        <Image
          source={icons.back_arrow}
          style={{
            width: 25,
            height: 25,
            tintColor: COLORS.white
          }}
        />
      </TouchableOpacity>
      <View style={{ flex: 1, flexDirection: 'row', marginBottom: 6 }}>

        {/* <View style={styles.headerTT}> */}
        <TouchableOpacity style={styles.Save} onPress={() => save()}>
          <View ><FontAwesomeIcon icon={faSave} size={28} color='white' /></View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Bill} onPress={() => paymentAlert()}>
          <View ><FontAwesomeIcon icon={faMoneyBillWave} size={28} color='white' /></View>
        </TouchableOpacity>
        {/* </View> */}


        <View style={styles.header}>
          <Text style={{ color: COLORS.white, ...FONTS.h2 }}>{type}</Text>
        </View>



        <View style={styles.Sum}>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ color: COLORS.white, ...FONTS.h2 }}>{sum === 0 ? '' : convertNumber(sum)}</Text>
          </View>


        </View>


      </View>
    </View>

  )
}


const styles = StyleSheet.create({

  header: {
    flex: 0.45,
    flexDirection: "row",
    justifyContent: 'center',


    //  height:1,

    //borderWidth: 0.1,
  },


  Save: {
    flexDirection: 'row',
    flex: 0.12,
    justifyContent: 'center',
    marginTop: 2,

    //alignSelf:'flex-end',
    // padding:14,


  },
  Bill: {
    flex: 0.17,
    flexDirection: 'row',
    justifyContent: 'center',
    //  alignSelf:'flex-start',
    // alignContent:'center',
    //  padding:14,
    marginTop: 2,
  },
  Sum: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    // alignContent:'center',
    //  padding:14,
  }
});
