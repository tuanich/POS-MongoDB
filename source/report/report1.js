import React, { useRef,useCallback,useEffect,useState } from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Animated,
    Platform
} from 'react-native';
import { VictoryPie } from 'victory-native';
import { convertNumber } from "../api";

import {Svg} from 'react-native-svg';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';


const colorScales= [ '#4E8397','#845EC2','#2C73D2','#FF6F91','#008F7A','#0081CF','#4B4453',"#BEC1D2",'#42B0FF','#C4FCEF','#898C95','#FFD573','#95A9B8','#008159','#FF615F','#8e44ad','#FF0000','#D0E9F4','#AC5E00'];

export default function report1({data}){

const [viewMode, setViewMode] = useState("chart");
const [selectedCategory, setSelectedCategory] = useState(null);
const [sum,setSum] =useState();
const [total,setTotal] =useState();
const [dataP,setDataP] =useState([]);

if (typeof data!='undefined' || data!=null)
{
useEffect(()=>{
   
    var sum=0;
    var total=0;
    data.map(item=>{
      sum+=item[1];
      total+=item[2];
    });
    setSum(convertNumber(sum));
    setTotal(convertNumber(total));
    setDataP(processData());

},[data]);

    function renderCategoryHeaderSection() {
        return (
        //    <View style={{ flexDirection: 'row', padding: SIZES.padding, justifyContent: 'space-between', alignItems: 'center' }}>
        //         {/* Title */}
               
        //         {/* Button */}
                <View style={{alignItems:'flex-end', padding:8}}>
                <View style={{ flexDirection: 'row', }}>
                    
                    <TouchableOpacity 
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: viewMode == "chart" ? COLORS.secondary : null,
                            height: 50,
                            width: 50,
                            borderRadius: 25
                        }}
                        onPress={() => setViewMode("chart")}
                    >
                        <Image
                            source={icons.chart}
                            resizeMode="contain"
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: viewMode == "chart" ? COLORS.white : COLORS.darkgray,
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: viewMode == "list" ? COLORS.secondary : null,
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                            marginLeft: SIZES.base
                        }}
                        onPress={() => setViewMode("list")}
                    >
                        <Image
                            source={icons.menu}
                            resizeMode="contain"
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: viewMode == "list" ? COLORS.white : COLORS.darkgray,
                            }}
                        />
                    </TouchableOpacity>
                    </View>
                </View>
         //   </View>
        )
    }
    const processData = useCallback(()=>{
   
    const online=["TakeAway","Grab","Baemin","Goviet","Now","Loship"];
    let dataOffline= data.filter(item=>!online.includes(item[0]));
    let dataOnline= data.filter(item=>online.includes(item[0]));
   
    var sl=0;
    var tt=0;
    dataOffline.map(item=>{ 
        sl+=Number(item[1]);
        tt+=Number(item[2]);
    })
    dataOffline=['Ăn tại quán',sl,tt];
    dataOnline.push(dataOffline);
    dataOnline.sort((a, b) => parseInt(b[2]) - parseInt(a[2]));
  //  console.log(dataOnline[0][0]);
    setSelectCategoryByName(dataOnline[0][0]);
  
    let total = dataOnline.reduce((a, b) => a + (parseInt(b[2]) || 0), 0)
  //  let count = dataOnline.reduce((a, b) => a + (parseInt(b[1]) || 0), 0)
    let dataChart = dataOnline.map((item,index)=>{
        let percent = (item[2]/total*100).toFixed(0);
        return {
            label: `${percent}%`,
            y: Number(item[2]),
            Count: item[1],
            color: colorScales[index],
            name: item[0],
            id: index,
            subTotal:item[2],
        }
    })
 //   console.log(dataChart);
    return dataChart;
    },[data]);

    const setSelectCategoryByName =useCallback((name) =>{
      
        let category = {name:name};
        setSelectedCategory(category);
    },[]);
   // console.log(selectedCategory);
    function renderChart(){
       
        let chartData = dataP;
        
        // let colorScales = chartData.map((item) => item.color)
       // let colorScales = colorScales.map((item) => item[0]);
        let totalExpenseCount = chartData.reduce((a, b) => a + (b.Count || 0), 0)
        let total =  chartData.reduce((a, b) => a + (b.subTotal || 0), 0)

      
       

        if(Platform.OS == 'ios')
        {
            return (
                <View  style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <VictoryPie
                        
                        data={chartData}
                        labels={(datum) => `${datum.y}`}
                        radius={({ datum }) => (selectedCategory && selectedCategory.name == datum.name) ? SIZES.width * 0.4 : SIZES.width * 0.4 - 10}
                        innerRadius={80}
                        labelRadius={({ innerRadius }) => (SIZES.width * 0.4 + innerRadius) / 2.5}
                        style={{
                            labels: { fill: "white", ...FONTS.body3 },
                            parent: {
                                ...styles.shadow
                            },
                        }}
                        width={SIZES.width * 0.8}
                        height={SIZES.width * 0.8}
                        colorScale={colorScales}
                        events={[{
                            target: "data",
                            eventHandlers: {
                                onPress: () => {
                                    return [{
                                        target: "labels",
                                        mutation: (props) => {
                                            let categoryName = chartData[props.index].name
                                            setSelectCategoryByName(categoryName)
                                        }
                                    }]
                                }
                            }
                        }]}
    
                    />
    
                    <View style={{ position: 'absolute', top: '42%', left: "42%" }}>
                        <Text style={{ ...FONTS.h1, textAlign: 'center' }}>{totalExpenseCount}</Text>
                        <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Tổng đơn</Text>
                        <Text style={{ ...FONTS.h4, textAlign: 'center' }}>{convertNumber(total)}</Text>
                    </View>
                </View>
    
            )
        }
        else
        {
            // Android workaround by wrapping VictoryPie with SVG
            return (
                <View  style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Svg width={SIZES.width} height={SIZES.width} style={{width: "100%", height: "auto"}}>

                        <VictoryPie
                            standalone={false} // Android workaround
                            data={chartData}
                            labels={(datum) => `${datum.y}`}
                            radius={({ datum }) => (selectedCategory && selectedCategory.name == datum.name) ? SIZES.width * 0.4 : SIZES.width * 0.4 - 10}
                            innerRadius={80}
                            labelRadius={({ innerRadius }) => (SIZES.width * 0.4 + innerRadius) / 2.5}
                            style={{
                                labels: { fill: "white", ...FONTS.body3 },
                                parent: {
                                    ...styles.shadow
                                },
                            }}
                            width={SIZES.width}
                            height={SIZES.width}
                            colorScale={colorScales}
                            events={[{
                                target: "data",
                                eventHandlers: {
                                    onPress: () => {
                                        return [{
                                            target: "labels",
                                            mutation: (props) => {
                                                let categoryName = chartData[props.index].name
                                                setSelectCategoryByName(categoryName)
                                            }
                                        }]
                                    }
                                }
                            }]}
        
                        />
                    </Svg>
                    <View style={{ position: 'absolute', top: '42%', left: "42%" }}>
                        <Text style={{ ...FONTS.h1, textAlign: 'center' }}>{totalExpenseCount}</Text>
                        <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Tổng đơn</Text>
                        <Text style={{ ...FONTS.h4, textAlign: 'center' }}>{convertNumber(total)}</Text>
                    </View>
                </View>
            )
        }
    }

   

    function renderSummary()
    {
        let data = dataP;

        const renderItem = ({ item,index }) => (
            <TouchableOpacity key={index}
                style={{
                    marginTop:3,
                    flexDirection: 'row',
                    height: 50,
                    paddingHorizontal: SIZES.radius,
                    borderRadius: 10,
                    backgroundColor: (selectedCategory && selectedCategory.name == item.name) ? item.color : COLORS.white
                }}
                onPress={() => {
                    let categoryName = item.name
                    setSelectCategoryByName(categoryName)
                }}
            >
                {/* Name/Category */}
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: (selectedCategory && selectedCategory.name == item.name) ? COLORS.white : item.color,
                            borderRadius: 5
                        }}
                    />

                    <Text style={{ marginLeft: SIZES.base, color: (selectedCategory && selectedCategory.name == item.name) ? COLORS.white : COLORS.primary, ...FONTS.h3 }}>{item.name}</Text>
                </View>

                {/* Expenses */}
                {/* <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: (selectedCategory && selectedCategory.name == item.name) ? COLORS.white : COLORS.primary, ...FONTS.h3 }}>{convertNumber(item.y)} - {item.label}</Text>
                </View> */}
                <View style={{flex:1, justifyContent:'center'}}>
                  <View style={{ alignItems:'flex-end' }}>
                      <Text style={{ color: (selectedCategory && selectedCategory.name == item.name) ? COLORS.white : COLORS.primary, ...FONTS.h4 }}>{item.Count} đơn - {parseInt(item.label)>=10?item.label:'0'+item.label}</Text>
                  </View>
                  <View style={{alignItems:'flex-end'}}>
                  <Text style={{ color: (selectedCategory && selectedCategory.name == item.name) ? COLORS.white : COLORS.primary, ...FONTS.h4 }}>{convertNumber(item.y)}</Text>
                  </View>
                  </View>
            </TouchableOpacity>
        )

        return (
            <View style={{ padding: SIZES.padding }}>
                {/* <FlatList
                    data={data}
                    horizontal={true}
                    renderItem={renderItem}
                    keyExtractor={item => `${item.id}`}

                /> */}
                {
                    data.map((item,index)=> renderItem({item,index}))
                }
            </View>

        )
    }


    function renderList(){
        return(
        <View style={styles.main}>
                    <View style={styles.orderContent}>
                    <View style={[styles.viewOrder,{flex:0.12}]}><Text style={styles.menuOrder}>STT</Text></View> 
                    <View style={[styles.viewOrder,{flex:0.35}]} ><Text style={styles.menuOrder}>Phương tiện</Text></View> 
                    <View style={[styles.viewOrder,{flex:0.18}]}><Text style={styles.menuOrder}>SL đơn</Text></View> 
                    <View style={[styles.viewOrder,{flex:0.35}]} ><Text style={styles.menuOrder}>Thành tiền</Text></View>
                    </View>
                    <ScrollView>
                    <View>
                    {data.map((e,index)=>
                     (<View style={styles.order} key={index}>
                            <View style={{flex:0.11,alignItems:'center',padding:5}}> 
                            <Text>{index+1}</Text>
                            </View>
                            <View style={{flex:0.38, alignItems:'flex-start',padding:5}}> 
                            <Text>{e[0]}</Text>  
                            </View>
                            <View style={{flex:0.15,alignItems:'center',padding:5}}>
                            <Text>{e[1]}</Text>  
                            </View>
                            <View style={{flex:0.37,alignItems:'flex-end',padding:4}}>
                            <Text>{convertNumber(e[2])}</Text>  
                            </View>  
                            </View>) )
                            }
                          
                    </View>
                  
                    <View style={{flexDirection:'row',flex:1}}>
                    <View style={{flex:0.5,alignItems:'center',padding:5}}> 
                    <Text style={styles.sum}>Tổng cộng</Text>  
                    </View>
                    <View style={{flex:0.15,alignItems:'center',padding:5}}> 
                    <Text style={styles.sum}>{sum}</Text>  
                    </View>
                    <View style={{flex:0.36,alignItems:'flex-end',padding:5}}>
                    <Text style={styles.sum}>{total}</Text>  
                    </View>
                    </View>
                    </ScrollView>
                    </View>)
    }

return (
    <View style={{ flex: 1, backgroundColor: COLORS.lightGray2 }}>
    {/* Nav bar section */}
  

    {/* Header section */}
   

    {/* Category Header Section */}
    {renderCategoryHeaderSection()}

    <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {
            viewMode == "list" &&
            <View>
                {renderList()}
                {/* {renderIncomingExpenses()} */}
            </View>
        }
        {
            viewMode == "chart" &&
            <View>
                {renderChart()}
                 {renderSummary()} 
            </View>
        }
    </ScrollView>
</View>
)
    }
    
}
const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },

    main: {
        flex: 1,
         },
     
      order:{
        flex:1,
        flexDirection:'row',
      },
     
      viewOrder:{
        backgroundColor:'#5E8D48',
        borderWidth:0.2,
        borderColor:'white',
        alignItems:'center',
        
       // fontSize: 18,
       // color:'white',
      },
      orderContent:{
        flexDirection:'row',
     //   flexWrap:'wrap',
      //  flex:1,
      //  justifyContent:'center',
      },
      menuOrder:{
          
        fontSize: 18,
        color:'white',
        padding:5,
        
      },
      sum:{
        fontSize:18,
        fontWeight:'bold',
    }
})

