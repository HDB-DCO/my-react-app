import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MsalProvider } from '@azure/msal-react';
import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './config/authConfig';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));


const msalInstance = new PublicClientApplication(msalConfig);

root.render(
    
    <React.StrictMode>
    <BrowserRouter>
        <MsalProvider instance={msalInstance}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>
        </MsalProvider>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();