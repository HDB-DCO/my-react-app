import React from 'react';
import { useMsalAuthentication } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';

const AuthCallback = () => {
    const { result, error, isAuthenticated } = useMsalAuthentication('redirect', loginRequest);

    if (error) {
        console.error('Authentication error:', error);
        return <div>Error signing in</div>;
    }

    if (isAuthenticated) {
        // Handle successful authentication, e.g., redirect to another page
        return <div>Signed in successfully!</div>;
    }

    return <div>Loading...</div>;
};

export default AuthCallback;
