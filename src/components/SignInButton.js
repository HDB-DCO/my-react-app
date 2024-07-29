import React from 'react';
import { useMsal, useMsalAuthentication } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';
import {handleLogin, handleTokenAcquisition  } from '../config/authConfig';

const SignInButton = () => {
    const { instance } = useMsal();
    const { login } = useMsalAuthentication('redirect', loginRequest);

    

    return (
    <>
        <div>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleTokenAcquisition}>Acquire Token</button>
        </div>
        <button type="button" onClick={() => login()}>
            Sign in with Microsoft
        </button>
        </>
    );
};

export default SignInButton;
