import {createSlice} from '@reduxjs/toolkit';
export default createSlice({
    name:'report8List',
    initialState:[],
    reducers: {
    addReport8: (state,action)=>{
     return action.payload ; 
    },
    
    }
})