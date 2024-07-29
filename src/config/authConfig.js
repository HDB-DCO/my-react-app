import { LogLevel } from "@azure/msal-browser";


export const msalConfig = {
    auth: {
        clientId: "b11b9455-88ff-4f2f-92fa-0caf915e91d8",
        authority: "https://login.microsoftonline.com/common",
        redirectUri: process.env.REACT_APP_REDIRECT_URI
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }	
            }	
        }	
    }
};


export const loginRequest = {
    scopes: ["User.Read"]
};


export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me" //e.g. https://graph.microsoft.com/v1.0/me
};
