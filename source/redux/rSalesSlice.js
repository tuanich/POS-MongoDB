import {createSlice} from '@reduxjs/toolkit';
export default createSlice({
    name:'rSales',
    initialState:[],
    reducers: {
    addrSales: (state,action)=>{
    return action.payload ; 
    },
    
    }
})