import {createSlice} from '@reduxjs/toolkit';
export default createSlice({
    name:'paymentlist',
    initialState:[],
    reducers: {
        addpayment: (state,action)=>{
            return [
                ...action.payload,
                ...state
                
                ]  ; 
    },
    addReportPayment: (state,action)=>{
        return [...action.payload] ; 
       },
    }
})

