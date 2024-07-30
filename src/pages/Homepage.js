import React, { useState, useEffect } from 'react';
import SignInButton from '../components/SignInButton';

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';
import { callMsGraph } from '../graph';
import { ProfileData } from '../components/ProfileData';
import { PageLayout } from '../components/PageLayout';
import Button from 'react-bootstrap/Button';

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken).then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="card-title">Welcome {accounts[0].name}</h5>
            {graphData ? (
                <ProfileData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestProfileData}>
                    Request Profile Information
                </Button>
            )}
        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};


const Homepage = () => {

    // State to store the fetched data
    const [data, setData] = useState(null);
    // State to handle loading state
    const [loading, setLoading] = useState(true);
    // State to handle errors
    const [error, setError] = useState(null);

    useEffect(() => {
        // Define the async function to fetch data
        const fetchData = async () => {
          try {
            const currentUrl = window.location.href;
            console.log("currentUrl :: ");
            console.log(currentUrl);
            const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL_DEV;
            console.log("BASE_URL :: ",BASE_URL);
            const isLocalhost = currentUrl.includes('http://localhost:3000');
            console.log("isLocalhost :: ",isLocalhost);
            if(isLocalhost === false){
                BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL_PROD;
                console.log("BASE_URL :: ",BASE_URL);
            }
            const response = await fetch(`${BASE_URL}/employee`);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log("response :: ",response);
            console.log("result :: ",result);
            setData(result); // Update state with fetched data
          } catch (error) {
            setError(error); // Update state with error
          } finally {
            setLoading(false); // Update loading state
          }
        };
    
        fetchData(); // Call the fetch function
      }, []); // Empty dependency array ensures this runs once on mount

    // Handle loading state
    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // Handle error state
    // if (error) {
    //     return <div>Error: {error.message}</div>;
    // }

    // Render the data once it's loaded
    return (
        <div>
        <h3>Fetched Data:</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <PageLayout>
            <MainContent />
        </PageLayout>
        </div>
    );    
};

export default Homepage;