import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import {url} from "@env";
import { table2Order } from '../api';
//import config from "../../app.json";
//const url = config.url;
export default createSlice({
    name:'ordList',
    initialState:{status:'idle',data:{}},
    reducers: {
    addOrder: (state,action)=>{
     state.data= {...action.payload}  ; 
    },
    clearOrder: (state,action)=>{
        state.data= {};
    },
    table2Order: (state,action)=>{
     state.data= {
         ...state.orderList,
         ...action.payload
     };

    },

    deleteOrder: (state,action)=>{
    delete state.data[action.payload];    
    }

    },
    extraReducers: (builder) =>{
        builder
        .addCase(fetchOrder.pending,(state,action)=>{
          state.status='loading';
        })
        .addCase(fetchOrder.fulfilled,(state,action)=>{
           
          state.data=action.payload;
          state.status='idle';
        })
      }
})
export const fetchOrder=createAsyncThunk('order/fetchOrder',async (table)=>{
  const res = await fetch(`${url}?action=getTables&table=${table}`);
  const data = await res.json();

  let d={};
  d[table]=table2Order(data.table);
 
 // console.log(data.table);
  return d;
})