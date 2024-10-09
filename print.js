import * as React from 'react';
import { View, StyleSheet, Button, Platform, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import Constants from 'expo-constants';
import { convertNumber } from './source/api';
import mapping from "./mapping.json";

export default function print({ navigation, route }) {

    const [selectedPrinter, setSelectedPrinter] = React.useState();
    const day = route.params.day.day;
    const type = route.params.type.type;
    const sum = route.params.sum.sum;
    const order = route.params.order.order;

    const print = async () => {
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        await Print.printAsync({
            html,
            printerUrl: selectedPrinter?.url, // iOS only
        });
    }

    const selectPrinter = async () => {
        const printer = await Print.selectPrinterAsync(); // iOS only
        setSelectedPrinter(printer);
    }

    const html = `
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
        * {
        
        margin: 0;
        padding: 0;
        
    }
        
    .flex-column {
        display: flex;
        flex-direction: column;
        
    }
    .company-info {margin-top: 0px;} 
    .flex-column {display: flex;flex-direction: column} 
    .receipt,.company-info,.receipt-footer{align-items:center;padding:5px} 
    #company-name{font-size:1.1rem} 
    #company-address{font-size:0.7rem}
    #company-phone{font-size:1.1rem} 
    td.description{width:285px;text-align:left} 
    th.description{text-align:left} 
 
    td.quantity{width:12px,text-align:right} 
    td.subtotal{width:65px,text-align:right}
    th.type{text-align:right} 
    
    .dotted-border{border-bottom:dotted 2px} 
    table.summary-table{text-align:right} 
    tbody.summary-table 
    td:nth-child(1){width:330px}
    th.description {
        width: 255px;
        text-align: center;
    }
    th.delete{width:5px}
    
        
    th.subtotal {
        width: 75px;
        
    }
    th.quantity{
    width: 70px;
    }
    
    .description
    {
      text-align: left;
        padding:2px;
        font-size:0.75rem;
    }
    
    .quantity{
      text-align: center;
        padding:2px;
        font-size:0.75rem;
    }
  
    .subtotal
     {
        text-align: right;
        padding:2px;
        font-size:0.75rem;
       
    }
    
        </style>
    </head>
    <body>
    <article class="receipt flex-column" id="prt">
    <div>
    <div class="company-info flex-column" style="margin: 0;padding: 0;">
        <p id="company-name">Bánh Canh Ghẹ Trang</p>
        <p id="company-address">587 Lũy Bán Bích, Phú Thạnh, Tân Phú</p>
        <p id="company-phone">0908 960 209</p>
        <p id="company-address">Ngày: ${day}</p>
    </div>
    <div>
        <table >
            <thead>
                <tr>
                <th class="description"></th>
                <th class="quantity"></th>
                <th class="type">${mapping.ban[type]}</th>
                </tr>
                <tr>
                    <td class="dotted-border" colspan="3"></td>
                </tr>
                <tr>
                    <td class="empty-border" colspan="3"></td> 
                </tr>
                <tr>
                    <th class="description">Món ăn</th>
                    <th class="quantity">Số lượng</th>
                    <th class="subtotal">Thành tiền</th>
                     <th class="delete"></th>
                </tr>
                <tr>
                    <td class="dotted-border" colspan="3"></td>
                </tr>
                <tr>
                    <td class="empty-border" colspan="3"></td>
                </tr>
                
            </thead>
            <tbody>
    ${order.map((orderLine) => {
        return (
            `<tr>
                <td class="description">- ${orderLine.description}</td>
                <td class="quantity">${orderLine.quantity}</td>
                <td class="subtotal">${convertNumber(orderLine.quantity * orderLine.price)}</td>
            </tr>`)
    }).join('')
        }
    </tbody>
        </table>
    </div>
    <div>
        <table >
            <tbody class="summary-table">
              <tr>
                    <td class="dotted-border" colspan="4"></td>
                </tr>
                <tr>
                    <td class="empty-border" colspan="4"></td>
                </tr>
                <tr>
                     
                    <td style="font-size:15px;text-align:center"><strong>Tổng tiền:</strong></td>
                    
                    <td id="subtotal-summary" style="font-size:15px;text-align:right"><strong>${convertNumber(sum)}</strong></td>
                    
                </tr>
     
            </tbody>
            
        </table>
    </div>
    <div class="receipt-footer flex-column">
        
        <p>Cám ơn Quí khách !!!</p>
  
    </div></div>
    </article>
    </body>
    </html>
    `;



    return (

        <><WebView
            style={styles.container}
            originWhitelist={['*']}
            source={{ html: html }} /><View style={styles.container}>


                <Button title='Print' style={styles.button} onPress={print} />
                <View style={styles.spacer} />

                {Platform.OS === 'ios' &&
                    <>
                        <View style={styles.spacer} />
                        <Button title='Select printer' onPress={selectPrinter} />
                        <View style={styles.spacer} />
                        {selectedPrinter ? <Text style={styles.printer}>{`Selected printer: ${selectedPrinter.name}`}</Text> : undefined}
                    </>}
            </View></>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    button: {
        borderColor: "white",
        borderWidth: 5,
    }
});
