import {createSlice} from '@reduxjs/toolkit';
export default createSlice({
    name:'rPayment',
    initialState:[],
    reducers: {
    addrPayment: (state,action)=>{
     return action.payload ; 
    },
    
    }
})