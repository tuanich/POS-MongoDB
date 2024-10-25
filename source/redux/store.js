// import { createStore } from 'redux';
// import rootReducer from './reducer';
// import {composeWithDevTools} from 'redux-devtools-extension';

// const composeEnhancer=composeWithDevTools();

// const store = createStore(rootReducer,composeEnhancer);
// export default store;

import { configureStore } from '@reduxjs/toolkit';
import OrderSlice from './orderSlice';
import ItemSlice from './itemSlice';
import PaymentSlice from './paymentSlice';
import rPaymentSlice from './rPaymentSlice';
import salesSlice from './salesSlice';
import invoiceSlice from './invoiceSlice';
import rSalesSlice from './rSalesSlice';
import statusSlice from './statusSlice';
import report8Slice from './report8Slice';
import reportSlice from './reportSlice';


const store = configureStore({
    reducer: {
        orderList: OrderSlice.reducer,
        itemList: ItemSlice.reducer,
        paymentList: PaymentSlice.reducer,
        salesList: salesSlice.reducer,
        invoiceList: invoiceSlice.reducer,
        rPayment: rPaymentSlice.reducer,
        rSales: rSalesSlice.reducer,
        statusList: statusSlice.reducer,
        report8List: report8Slice.reducer,
        reportList: reportSlice.reducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({

            serializableCheck: false,
        }),

})

export default store