import {getPayment,getSales,getInvoice,getItems} from './source/api';
import { useDispatch,useSelector } from 'react-redux';
import { addInvoiceAction, addItemAction,addPaymentAction, addSalesAction} from './source/redux/action';
import {itemlistSelector} from './source/redux/selector';
import {useEffect,useCallback,useState} from 'react';
export default function reload(){
    const dispath =useDispatch();
    const reloadItem = useCallback(()=>{
        let abortController = new AbortController();
        let aborted = abortController.signal.aborted; // true || false
        
        let data = async () => {
        
          const d= (await getItems());
        aborted = abortController.signal.aborted; // before 'if' statement check again if aborted
        if (aborted === false){  
         
          dispath(addItemAction(d));
        }
        }
        data();
        return () => {
        abortController.abort();
        };      
        },[])
}