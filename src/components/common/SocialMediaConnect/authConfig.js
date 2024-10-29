

import { LogLevel } from "@azure/msal-browser";

const API_URL = 'https://graph.microsoft.com/v1.0';
/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
export const msalConfig = {
    auth: {
        clientId: "471de8e4-13c4-498d-a591-b01a002776a7",
        /* authority: "https://login.microsoftonline.com/f8cdef31-a31e-4b4a-93e4-5f571e91255a", */
        redirectUri: "http://localhost:3000/microsoft/code"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
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
                }	
            }	
        }	
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ['https://graph.microsoft.com/Team.Create', 'https://graph.microsoft.com/Directory.ReadWrite.All', 'https://graph.microsoft.com/Group.ReadWrite.All', 'https://graph.microsoft.com/Channel.Create', 'https://graph.microsoft.com/Channel.ReadBasic.All', 'https://graph.microsoft.com/Team.ReadBasic.All', 'https://graph.microsoft.com/TeamMember.ReadWrite.All', 'https://graph.microsoft.com/User.Read', 'https://graph.microsoft.com/offline_access'], 
    forceRefresh: true,
    prompt: 'consent'
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const graphConfig = {
    graphMeEndpoint: `${API_URL}/me`,
    graphMailEndpoint: `${API_URL}/me/messages`
};
