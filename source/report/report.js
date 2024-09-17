import {Text,View,ScrollView,RefreshControl } from'react-native';
import {useEffect,useState,useCallback} from 'react';
import {getReport, getPayment} from '../api';
import { useSelector,useDispatch } from 'react-redux';
import {rPaymentlistSelector,rSaleslistSelector,report8ListSelector} from '../../source/redux/selector';
//import {addrPayment,addrSales,addReport8} from '../../source/redux/action';
import Report1 from './report1';
import Report2 from './report2';
import Report3 from './report3';
import Report4 from './report4';
import Report5 from './report5';
import Report6 from './report6';
import Report7 from './report7';
import Report8 from './report8';


export default function report1({navigation,route}){
 //const [report,setReport]= useState();
 //const [rPayment,setRPayment]= useState([]);
 //const [refreshing, setRefreshing] = useState(false);
 //const dispath =useDispatch();
  
  const report =useSelector(rSaleslistSelector);
  const rPayment =useSelector(rPaymentlistSelector);
  const report8= useSelector(report8ListSelector)
 
  useEffect(()=>{
   //  console.log(route.params.i);
     navigation.setOptions({title: route.params.name});
  },[navigation]);

 
      function renderSwitch(c)
      {
        switch (c)
  { 
    case 0: return (<Report1 data={rPayment}/>);
              break;
      case 1: return (<Report2 data={report.R1.r1}/>);
              break;
      case 2: return (<Report3 data={report.R1.r2}/>);
              break;
      case 3: return (<Report4 data={report.R1.r3}/>);
              break;
      case 4: return (<Report5 data={report.R2.r1}/>);
              break;
      case 5: return (<Report6 data={report.R2.r2}/>);
              break;
      case 6: return (<Report7 data={report.R1.r4}/>);
              break;
      case 7: return (<Report8 data={report8}/>);
              break;
      
    default : break;
  }
      }

 if (typeof report=='undefined' || typeof rPayment=='undefined' || report==null || rPayment==null || report=='' || rPayment=='')
{ 
  return (
   
    <View style={{flex:1,  alignItems: 'center',flexDirection:'row', justifyContent:'center'}}>
        <Text>No data...</Text>
         </View>
  );
}
else{
   return (  
  //  <ScrollView contentContainerStyle={{ flex: 1, backgroundColor:'white'}} refreshControl={
  //        <RefreshControl
  //         refreshing={refreshing}
  //         onRefresh={onRefresh}
  //         title='loading'
  //         progressBackgroundColor='#79B45D'
  //         color='#fff'
  //         tintColor='#fff'
  //       />}>
        renderSwitch(route.params.i)

  // </ScrollView>
 )
}
};

