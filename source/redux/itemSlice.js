import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import {url} from "@env";
//import config from "../../app.json";
//const url = config.url;
export default createSlice({
    name:'itemlist',
    initialState:{status:'idle',data:{}},
    reducers: {
    addItem: (state,action)=>{
     state.data=action.payload ; 
    }},
    delItem: (state,action)=>{
      delete state.data[action.payload];    
      },
    
    
    extraReducers: (builder) =>{
        builder
        .addCase(fetchItems.pending,(state,action)=>{
          state.status='loading';
        })
        .addCase(fetchItems.fulfilled,(state,action)=>{
          state.data=action.payload;
          state.status='idle';
        })
    }
})

export const fetchItems=createAsyncThunk('item/fetchItems',async ()=>{
    const res = await fetch(`${url}?action=getItems`);
  //  let { items,drinks,others } = await data.json();
    const data = await res.json();
    let Data={};
    Data.Item = data.items;
    Data.Drink = data.drinks;
    Data.Other = data.others;
    
    return Data;
  })