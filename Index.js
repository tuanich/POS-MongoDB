import React from 'react';
import ReacDom from 'react-dom';
import App from './App';
import store from './source/redux/store';
import { Provider } from 'react-redux';

// if(Platform.OS === 'android') { // only android needs polyfill
//      require('intl'); // import intl object
//      require('intl/locale-data/jsonp/en-IN'); // load the required locale details
//    }

function Index (){
    

      return (
       <Provider store={store}>
            
            <App />
            
            
       </Provider>
      );
    
  }
  export default Index