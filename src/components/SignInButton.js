import React from 'react';
import { useMsal, useMsalAuthentication } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';

const SignInButton = () => {
    const { instance } = useMsal();
    const { login } = useMsalAuthentication('redirect', loginRequest);

    return (
        <button onClick={() => login()}>
            Sign in with Microsoft
        </button>
    );
};

export default SignInButton;
