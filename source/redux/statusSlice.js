import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { url } from "@env";
//import config from "../../app.json";
//const url = config.url;
export default createSlice({
  name: 'statusList',
  initialState: { status: 'idle', data: [] },
  reducers: {
    addStatus: (state, action) => {
      // console.log(action.payload);
      state.data = action.payload;
    },
    updateStatus: (state, action) => {
      const current = state.data.find(item => item[1] === action.payload.type)
      current[2] = action.payload.status;
      current[3] = action.payload.sumtotal;
      current[4] = action.payload.timestamp;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatus.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchStatus.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'idle';
      })

  }
})

export const fetchStatus = createAsyncThunk('status/fetchStatus', async () => {
  const res = await fetch(`${url}?action=getStatus`);
  const data = await res.json();
  // console.log("fetch:", data.type);
  return data.type;
})

