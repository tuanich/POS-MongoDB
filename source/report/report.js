import { Text, View, ScrollView, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
//import { getReport, getPayment } from '../api';
import { useSelector, useDispatch } from 'react-redux';
import { rPaymentlistSelector, rSaleslistSelector, report8ListSelector, reportListSelector } from '../../source/redux/selector';
//import {addrPayment,addrSales,addReport8} from '../../source/redux/action';
import Report1 from './report1';
import Report2 from './report2';
import Report3 from './report3';
import Report4 from './report4';
import Report5 from './report5';
import Report6 from './report6';
import Report7 from './report7';
import Report8 from './report8';



export default function report1({ navigation, route }) {


        const report = useSelector(reportListSelector);

        useEffect(() => {

                navigation.setOptions({ title: route.params.name });

        }, [navigation]);


        function renderSwitch(c) {
                switch (c) {
                        case 0: return (<View style={{ flex: 1 }}>{ }<Report1 data={report.r} name={"A"} /></View>);

                        case 1: return (<View style={{ flex: 1 }}>{ }<Report2 data={report.r1} name={"B"} /></View>);

                        case 2: return (<View style={{ flex: 1 }}>{ }<Report3 data={report.r2} name={"C"} /></View>);

                        case 3: return (<View style={{ flex: 1 }}>{ }<Report4 data={report.r3} name={"D"} /></View>);

                        case 4: return (<View style={{ flex: 1 }}><Report5 data={report.r4} name={"E"} /></View>);

                        case 5: return (<View style={{ flex: 1 }}><Report6 data={report.r5} name={"F"} /></View>);

                        case 6: return (<View style={{ flex: 1 }}><Report7 data={report.r6} name={"G"} /></View>);

                        case 7: return (<View style={{ flex: 1 }} ><Report8 data={report.r7} name={"H"} /></View>);


                        default: return null
                }
        }

        if (typeof report == 'undefined' || report == null || report == '') {

                return (

                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                                <Text>No data...</Text>
                        </View>
                );
        }
        else {

                return (


                        <View style={{ flex: 1 }}>{renderSwitch(route.params.i)}</View>



                )
        }
};

