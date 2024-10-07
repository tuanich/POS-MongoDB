import { createSlice } from '@reduxjs/toolkit';
export default createSlice({
    name: 'reportList',
    initialState: {},
    reducers: {
        addReport: (state, action) => {
            //console.log(action.payload);
            return action.payload;
        },

    }
})