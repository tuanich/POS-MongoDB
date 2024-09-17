import * as React from 'react';
import { View, Text,TouchableOpacity,StyleSheet ,ScrollView,RefreshControl} from 'react-native';
import {getReport,getPayment} from './api';
import { useDispatch } from 'react-redux';
import {addrPayment,addrSales,addReport8} from './redux/action';
import rPaymentSlice from './redux/rPaymentSlice';
import rSalesSlice from './redux/rSalesSlice';
import report8Slice from './redux/report8Slice';

import { useEffect,useCallback,useState } from 'react';
import { COLORS, FONTS, SIZES, icons, images } from '../source/constants/';


const menu =[{name:'Báo cao theo PT vận chuyển trong ngày',naviName:'Report1'},
{name:'Báo cáo theo món ăn trong ngày',naviName:'Report2'}, 
{name:'Báo cáo thức uống trong ngày',naviName:'Report3'},
{name:'Báo cáo khác trong ngày',naviName:'Report4'},
{name:'Báo cáo doanh thu ngày',naviName:'Report5'},
{name:'Báo cáo doanh thu tháng',naviName:'Report6'},
{name:'Thống kê SL bán nhiều nhất',naviName:'Report7'},
{name:'Thông kê phương thức bán nhiều nhất',naviName:'Report8'},
];

export default function menuReport({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
   const dispath = useDispatch();

                useEffect(()=>{
                 reloadReport();
               },[]);


               const reloadReport =()=>{
                let abortController = new AbortController();
                let aborted = abortController.signal.aborted; // true || false
                let data = async () => {
                    let d= (await getReport());
                    let b= (await getPayment());
                   
                 
                    aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
                    if (aborted === false){  
                     
                       if (typeof d!='undefined'){
                      dispath(rSalesSlice.actions.addrSales(d));
                    }
                      if (typeof b!='undefined')
                      {
                      dispath(rPaymentSlice.actions.addrPayment(b.R2));
                      dispath(report8Slice.actions.addReport8(b.R3))
                       }
                     }
                    }
                    data();
                    return () => {
                    abortController.abort();
                    };  
    }

      const onRefresh = useCallback(() => {
      setRefreshing(true);
      wait(3000).then(() => setRefreshing(false));
      }, []);
  
      const wait = (timeout) => {
      reloadReport();
    //  console.log(rPayment);
    //  renderSwitch(route.params.i);
      return new Promise(resolve => setTimeout(resolve, timeout));
      }


  return (
   // <View style={{ padding: 5 }}>
       <ScrollView contentContainerStyle={{ }} refreshControl={
         <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          title='loading'
          progressBackgroundColor='#79B45D'
          color='#fff'
          tintColor='#fff'
        />}>
         { menu.map( (item,index) => 
              
                   (<View key={index} style={styles.order}> 
                     <TouchableOpacity  style={{
                    flex:1,   
                    flexDirection: 'row',
                    height: 50,
                  //  width:500,
                    marginLeft:5,
                    marginRight:5,
                  // justifyContent:'center',
                    paddingHorizontal: SIZES.radius,
                    borderRadius: 10,
                    backgroundColor: COLORS.white,
                    alignItems:'center',
                    marginTop:5,
                }} onPress={()=>navigation.navigate('Report',{ i:index,name:item.name })}>
                     <View > 
                     
                    {/* <Text style={styles.name}>{e.item.name}</Text> */}
                    <Text style={{ marginLeft: SIZES.base, color: COLORS.primary, ...FONTS.h3 }}>{item.name}</Text>
                    </View>
                    </TouchableOpacity>
                   
                    </View>) )
          
              }
          
          </ScrollView>
        )
        
};
const styles = StyleSheet.create({
    order:{
       // fontSize:14,
      //  padding: 2,
        flexDirection:'row',
        flexWrap:'wrap',
       // margin:1,

    },
    button:{
        flex:1, 
        alignItems:'flex-start',
        padding:10,
        borderColor:'black',
        borderWidth:0.2,
        margin:0.5
    },
    name:{
        fontSize:20,
    }
    
})
