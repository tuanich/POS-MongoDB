export const addOrderAction= (data)=>{
   return  {
        type:'ordList/addOrder',
    payload:data
            }

}
export const table2Order= (data)=>{
    return  {
         type:'ordList/table2Order',
     payload:data
             }
 
 }
export const clearOrderAction=()=>{
   return{ type:'ordList/clearOrder',
    payload:''
}
}

export const addItemAction= (data)=>{
    return  {
         type:'itemlist/addItem',
     payload:data
             }
 
 }

 export const addPaymentAction= (data)=>{
    return  {
         type:'paymentlist/addpayment',
     payload:data
             }
 
 }
 export const addSalesAction= (data)=>{
    return  {
         type:'saleslist/addsales',
     payload:data
             }
            }

export const addReportPayment= (data)=>{
    return  {
        type:'paymentlist/addReportPayment',
        payload:data
            }
             
            }
export const addReportSales= (data)=>{
        return  {
            type:'saleslist/addReportSales',
            payload:data
                }
            }

 export const addInvoiceAction= (data)=>{
     return  {
            type:'invoice/addinvoice',
            payload:data
             }
 
 }
 export const addrPayment= (data)=>{
    return  {
           type:'rPayment/addrPayment',
           payload:data
            }

}
export const addrSales= (data)=>{
    return  {
           type:'rSales/addrSales',
           payload:data
            }

}

export const addStatus= (data)=>{
    return  {
           type:'statusList/addStatus',
           payload:data
            }

}

export const addReport8 =(data)=>{
    return  {
           type:'report8List/addReport8',
           payload:data
            }

}