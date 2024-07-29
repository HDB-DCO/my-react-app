// authConfig.js

import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: 'b11b9455-88ff-4f2f-92fa-0caf915e91d8',
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: process.env.REACT_APP_REDIRECT_URI
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true
    }
};

export const loginRequest = {
    scopes: ['User.Read']
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const handleLogin = () => {
  msalInstance.loginRedirect(loginRequest);
};

export const handleTokenAcquisition = async () => {
  try {
    const response = await msalInstance.acquireTokenRedirect(loginRequest);
    console.log("Token acquired: ", response.accessToken);
  } catch (error) {
    console.error("Error acquiring token: ", error);
  }
};