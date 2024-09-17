import {createSlice} from '@reduxjs/toolkit';
export default createSlice({
    name:'saleslist',
    initialState:[],
    reducers: {
    addSales: (state,action)=>{
     return [
        ...action.payload,
        ...state
        
        ]  ; 
    },
    addReportSales: (state,action)=>{
        return [...action.payload]  ; 
       },

    }
})