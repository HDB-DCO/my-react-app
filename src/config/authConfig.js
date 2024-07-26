// authConfig.js
export const msalConfig = {
    auth: {
        clientId: '08caf53e-c8f2-4833-b795-5e873e0b7d75',
        authority: 'https://login.microsoftonline.com/dcohdbgmail.onmicrosoft.com',
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
