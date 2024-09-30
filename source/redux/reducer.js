const initState={
    orderList:{},
    itemList:{},
    paymentList:[],
    salesList:[],
    invoiceList:'',
    rPayment:[],
    rSales:[],
    statusList:[],
    report8List:[],
}
const rootReducer = (state=initState, action)=>{
  //  console.log(state,action)
 
    switch (action.type)
    {
        case 'ordList/addOrder':
            return {
                    ...state,
                    orderList:{
                      //  ...state.orderList,
                        ...action.payload
                    }
            }

        case 'ordList/table2Order':
            return {
                    ...state,
                    orderList:{
                    ...state.orderList,
                    ...action.payload
                        }
                }
        case 'ordList/clearOrder':
            
            return{
                ...state,
                
                orderList:{              
                }
            }

        case 'itemlist/addItem' :
            return {
                ...state,
                itemList:
                       //   ...state.itemList,
                    action.payload
                
        }
        case 'itemlist/delItem' :
            return { ...state, items: state.items.filter(i => i.id !== action.payload.id) }
       
        

        case 'paymentlist/addpayment':
            return {
                    ...state,
                    paymentList:[
                        ...action.payload,
                        ...state.paymentList
                        
                    ]
            }
        case 'paymentlist/addReportPayment':
            return {
                    ...state,
                    paymentList:[
                    ...action.payload,
                    
                            
                    ]
                }
        
        case 'saleslist/addsales':
            return {
                    ...state,
                    salesList:[
                    ...action.payload,
                    ...state.salesList
                    
                    ]
                }
        case 'saleslist/addReportSales':
                return {
                    ...state,
                    salesList:[
                    ...action.payload,
                    
                            
                    ]
                    }
        case 'invoice/addinvoice':
            return{
                ...state,
                invoiceList:
                action.payload
            }

        case 'rPayment/addrPayment':
            return {
                ...state,
                rPayment:
                action.payload
            }
        case 'rSales/addrSales':
                return {
                    ...state,
                    rSales:
                    action.payload
                }
        case 'statusList/addStatus':
                return {
                    ...state,
                    statusList:
                    action.payload
                    } 
        case 'report8List/addReport8':
                return {
                        ...state,
                        report8List:
                        action.payload
                        }       
        default: return state;    
    }

};
export default rootReducer