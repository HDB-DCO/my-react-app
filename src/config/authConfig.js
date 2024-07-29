// authConfig.js
export const msalConfig = {
    auth: {
        clientId: 'b11b9455-88ff-4f2f-92fa-0caf915e91d8',
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: 'http://localhost:3000/auth/callback'
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false
    }
};

export const loginRequest = {
    scopes: ['User.Read']
};
