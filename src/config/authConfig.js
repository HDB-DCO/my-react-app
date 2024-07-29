// authConfig.js
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
