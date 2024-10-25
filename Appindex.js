import React from 'react';
import App from './App';
import store from './source/redux/store';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';

function Appindex({ session }) {
    return (
        <Provider store={store}>
            <SessionProvider session={session}>
                <App />
            </SessionProvider>
        </Provider>
    );
}

export default Appindex;