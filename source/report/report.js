import { Text, View, ScrollView, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { getReport, getPayment } from '../api';
import { useSelector, useDispatch } from 'react-redux';
import { rPaymentlistSelector, rSaleslistSelector, report8ListSelector } from '../../source/redux/selector';
//import {addrPayment,addrSales,addReport8} from '../../source/redux/action';
import Report1 from './report1';
import Report2 from './report2';
import Report3 from './report3';
import Report4 from './report4';
import Report5 from './report5';
import Report6 from './report6';
import Report7 from './report7';
import Report8 from './report8';
import * as Crypto from 'expo-crypto';


export default function report1({ navigation, route }) {
        //const [report,setReport]= useState();
        //const [rPayment,setRPayment]= useState([]);
        //const [refreshing, setRefreshing] = useState(false);
        //const dispath =useDispatch();
        // const [key, setKey] = useState(Crypto.randomUUID());
        const report = useSelector(rSaleslistSelector);
        const rPayment = useSelector(rPaymentlistSelector);
        const report8 = useSelector(report8ListSelector);

        useEffect(() => {

                navigation.setOptions({ title: route.params.name });
                //  setKey(Crypto.randomUUID());

        }, [navigation]);


        function renderSwitch(c) {
                switch (c) {
                        case 0: return (<View style={{ flex: 1 }}>{ }<Report1 data={rPayment} name={"A"} /></View>);
                                break;
                        case 1: return (<View style={{ flex: 1 }}>{ }<Report2 data={report.R1.r1} name={"B"} /></View>);
                                break;
                        case 2: return (<View style={{ flex: 1 }}>{ }<Report3 data={report.R1.r2} name={"C"} /></View>);
                                break;
                        case 3: return (<View style={{ flex: 1 }}>{ }<Report4 data={report.R1.r3} name={"D"} /></View>);
                                break;
                        case 4: return (<View style={{ flex: 1 }}><Report5 data={report.R2.r1} name={"E"} /></View>);
                                break;
                        case 5: return (<View style={{ flex: 1 }}><Report6 data={report.R2.r2} name={"F"} /></View>);
                                break;
                        case 6: return (<View style={{ flex: 1 }}><Report7 data={report.R1.r4} name={"G"} /></View>);
                                break;
                        case 7: return (<View style={{ flex: 1 }} ><Report8 data={report8} name={"H"} /></View>);
                                break;

                        default: break;
                }
        }

        if (typeof report == 'undefined' || typeof rPayment == 'undefined' || report == null || rPayment == null || report == '' || rPayment == '') {
                return (

                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                                <Text>No data...</Text>
                        </View>
                );
        }
        else {
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
                        <View style={{ flex: 1 }}>{renderSwitch(route.params.i)}</View>


                        // </ScrollView>
                )
        }
};

