import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import {url} from "@env";
//import config from "../../app.json";
//const url = config.url;
export default createSlice({
    name:'invoice',
    initialState:{status:'idle',data:''},
    reducers: {
    addinvoice: (state,action)=>{
     
      state.data=action.payload  ; 
    },
    },
    extraReducers: (builder) =>{
        builder
        .addCase(fetchInvoice.pending,(state,action)=>{
          state.status='loading';
        })
        .addCase(fetchInvoice.fulfilled,(state,action)=>{
          state.data=action.payload;
          state.status='idle';
        })
       
      }
})
export const fetchInvoice=createAsyncThunk('invoice/fetchInvoice',async ()=>{
    const res = await fetch(`${url}?action=getInvoice`);
    const data = await res.json();
    //console.log(data[1][0]);
    return data[0][0];
  })
  