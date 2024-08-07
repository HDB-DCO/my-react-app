import store from '../redux/store';
import { logout } from '../redux/authSlice';
import { getIsAuthenticated, getUsername, getToken, getRoles } from '../js/stateUtils';

const handleUnauthorized = () => {
    // Dispatch the logout action to clear the token
    store.dispatch(logout());

    // Clear local storage if needed
    // localStorage.removeItem('jwtToken');

    // Redirect to login page
    window.location.href = '/';
};

const getBaseUrl = () => {
    const currentUrl = window.location.href;
    let BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL_DEV;
    const isLocalhost = currentUrl.includes('http://localhost:3000');
    if(isLocalhost === false){
        BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL_PROD;
    }
    return BASE_URL;
}

export const fetchClient = async (url, options = {}, queryParams = null) => {
    console.log("fetchClient---------");
    let fullUrl = getBaseUrl()+url;
    // If queryParams are provided, construct the full URL with query parameters
    if (queryParams) {
        const queryString = new URLSearchParams(queryParams).toString();
        fullUrl += `?${queryString}`;
    }
    
    const defaultHeaders = {
        'Authorization': 'Bearer ' + getToken(),
        // 'Content-Type': 'application/json',
    };

    const headers = {
        ...defaultHeaders,
        ...options.headers,
    };

    const response = await fetch(fullUrl, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Handle 401 Unauthorized response
        handleUnauthorized();
        throw new Error('Unauthorized'); // Throw an error to stop further processing
    }

    return response;
};
