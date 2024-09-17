import * as React from 'react';
import { View, Text,TouchableOpacity,StyleSheet,ScrollView,RefreshControl,Dimensions,Image,ActivityIndicator } from 'react-native';

import { useEffect, useState,useCallback } from 'react';
import { getStatus,getTable,checkStatus } from './source/api';
import { useDispatch,useSelector } from 'react-redux';
//import {addStatus,table2Order,addOrderAction} from './source/redux/action';
//import statusSlice, { fetchCheckStatus } from './source/redux/statusSlice';
import { fetchStatus,fetchCheckStatus } from './source/redux/statusSlice';
import orderSlice, { fetchOrder } from './source/redux/orderSlice';

import {orderlistSelector, statuslistSelector} from './source/redux/selector';
import { COLORS, FONTS, SIZES, icons, images } from './source/constants';



let intervalID;
function Orderlist({ navigation,route}) {
  const [refreshing, setRefreshing] = useState(false);
  const dispath =useDispatch();
  const [tab,setTab] =useState(1); 
  const [list,setList]= useState([]);
  const [loading, setLoading]=useState(false);
 
  const orderLists=useSelector(orderlistSelector);

 
 
  const statusList =useSelector(statuslistSelector);



  const [status, setStatus] = useState([]);
  
  
  useEffect(()=>{
    if (tab==1)
    setList(statusList.filter(item=>item[0] < 200));
    else
    setList(statusList.filter(item=>item[0] >= 200))
    },[statusList])

 
  useEffect(()=>{
    
    reloadTable();
    
  },[route.params?.p])



  const reloadTable = ()=>{
   
    intervalID=setInterval(()=>{
      dispath(fetchStatus());
    //  reloadOrderTable();
    },5000);
    return ()=>{clearInterval(intervalID)}
    };

    const reloadOrderTable = ()=>{
    
      statusList.map(item=>{ 
        if (item[2]==1){
        TabletoOrder(item[1]);
                       }
                           }) ;
        
      };

      const TabletoOrder = (table)=>{
    
        dispath(fetchOrder(table));
      }


//   useEffect(() => {
//     if (route.params?.p) {
//       // Post updated, do something with `route.params.post`
//       // For example, send the post to the server
//     //   const storagedItem = localStorage.getItem(STATUS_STORAGE);
//     // if (storagedItem)
//     // {setStatus(JSON.parse(storagedItem));}
//      // console.log(route.params?.post)
//      // addPayment();
//     // dispath(addStatus())
//  //reloadTable();
//    // setTab(1);
//     }
//   }, [route.params?.p]);

  // useEffect(() => {
  //   localStorage.setItem(STATUS_STORAGE, JSON.stringify(status));
    
  // }, [status]);
  
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(3000).then(() => setRefreshing(false));
  }, []);

  const wait = (timeout) => {
    reloadTable();
    reloadOrderTable();
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  const pressTab =useCallback((i)=>
{
  setTab(i);
  let d=[];
  if (i==1){
    d = statusList.filter(item=>item[0] < 200);
  }
  else{
    d = statusList.filter(item=>item[0]>=200);
  }
  
  setList(d);
},[tab,statusList]);  


const back = useCallback(()=>{
  
  clearInterval(intervalID);
  navigation.navigate("Home",
                        {post: route.params.post });
},[])

const clickTable = useCallback((item)=>{
      if (item[2]==0) {
        dispath(orderSlice.actions.deleteOrder(item[1]));
        clearInterval(intervalID); 
        navigation.navigate('Orderdetail', { type: {item} });  
        
      }
      else{
        const p = new Promise(resolve=>{
          setLoading(true);
          resolve(dispath(fetchOrder(item[1])));
        })
        p.then((data)=>
        { //console.log(data);
          if (data.meta.requestStatus=='fulfilled'){
            setLoading(false);
            clearInterval(intervalID); 
            navigation.navigate('Orderdetail', { type: {item} });  
          }

        }
        )
      }
     
      
      
  
},[]);

function load(){
  if (loading)
  {
  return (
    
  //   <View style={{flex:1,  alignItems: 'center',flexDirection:'row', justifyContent:'center',backgroundColor:COLORS.white}}>
  //   <Text>Loading...</Text>
  // </View>
  <View style={[styles.container, styles.horizontal]}>
 
  <ActivityIndicator size="large" color="#00ff00" />

</View>
  )
  }
}

function renderNavBar() {
  return (
      <View
          style={{
              flexDirection: 'row',
              height: 80,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
          //    paddingHorizontal: SIZES.padding,
              backgroundColor: '#79B45D',
          }}
      >
          <TouchableOpacity
              style={{ justifyContent: 'center', width: 50, padding:10 }}
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
            
          <View style={styles.containerTab}>
      <View style={styles.listTab}>
        <TouchableOpacity style={[styles.btnTab,tab===1 && styles.btnTabActive]} onPress={()=>pressTab(1)}>
        <Text style={[styles.textTab,tab===1 && styles.textActive]}>Bàn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnTab,tab===2 && styles.btnTabActive]} onPress={()=>pressTab(2)}>
        <Text style={[styles.textTab,tab===2 && styles.textActive]}>Mang về</Text>
        </TouchableOpacity>
      </View>
    </View>
      </View>
  )
}

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.lightGray2 }}>
    {/* Nav bar section */}
    {renderNavBar()}

    <ScrollView refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        title='loading'
      />
    }>
     {/* <View style={styles.containerTab}>
      <View style={styles.listTab}>
        <TouchableOpacity style={[styles.btnTab,tab===1 && styles.btnTabActive]} onPress={()=>pressTab(1)}>
        <Text style={[styles.textTab,tab===1 && styles.textActive]}>Bàn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnTab,tab===2 && styles.btnTabActive]} onPress={()=>pressTab(2)}>
        <Text style={[styles.textTab,tab===2 && styles.textActive]}>Mang về</Text>
        </TouchableOpacity>
      </View>
    </View> */}
    <View style={styles.container}>
      <View style={styles.box}>
     { list.map((item,index) =>  
         
      ( 
        <TouchableOpacity style={item[2]===0?styles.button:styles.button1} key={index} onPress={()=>clickTable(item) } >
        <View>
       
        <Text style={item[2]===0?styles.innerText:styles.innerText1}>{item[1]}</Text> 
        </View>
       </TouchableOpacity> )
      
     )
      
      } 
      </View>
      
    </View>
    </ScrollView>
    {load()}
    </View>
  );
}
export default Orderlist;

const styles = StyleSheet.create({
container:{
flex:1,
//justifyContent:'space-around',
//alignItems:'center',
padding: 20,
//flexDirection:'row',
//flexWrap:'nowrap',

},

box:{
//flex: 0.25,
flexDirection:'row',
flexWrap:'wrap',


},
button: {
  paddingHorizontal: 10,
  paddingVertical: 10,
  borderRadius: 17,
  
  backgroundColor: "oldlace",
  alignSelf: "flex-start",
  marginHorizontal: "1.8%",
  marginBottom: 10,
  alignItems:'center',
  //minWidth: "48%",
  justifyContent:'center',
  width:110,
  height:110,
  
  textAlign: "center",
},
button1:{
  paddingHorizontal: 10,
  paddingVertical: 10,
  borderRadius: 17,
  
//  backgroundColor: "#79B45D",
  backgroundColor:'#EB8385',
  alignSelf: "flex-start",
  marginHorizontal: "1.8%",
  marginBottom: 10,
  alignItems:'center',
  //minWidth: "48%",
  justifyContent:'center',
  width:110,
  height:110,
  textAlign: "center",

},
innerText1: {
  color: COLORS.white, ...FONTS.body3
},
innerText: {
  color: COLORS.primary, ...FONTS.body3
},

containerTab:{
  flex:1,
 // paddingHorizontal:10,
  //justifyContent:'flex-end',
 // marginTop:10,

},
listTab:{
 flexDirection:'row',
 alignSelf:'flex-end',
 marginBottom:1.2,
 },
 btnTab:{
  width:Dimensions.get('window').width / 3,
 // borderTopLeftRadius:13,
 // borderTopRightRadius:13,
 borderRadius:10,
  flexDirection:'row',
//  borderWidth:0.2,
  padding:10,
  justifyContent:'center',
 // backgroundColor:'#EBEBEB',
  backgroundColor:'#79B45D',
  alignItems:'flex-end'
 },
 textTab:{
  color: COLORS.primary, ...FONTS.body3
 },
 btnTabActive:{
 // backgroundColor:"#EB8385",
  backgroundColor:'#5E8D48',
 },
 textActive:{
  color: COLORS.white, ...FONTS.body3
 },
 horizontal: {
  flexDirection: "row",
  justifyContent: "space-around",
  padding: 10
}
 })