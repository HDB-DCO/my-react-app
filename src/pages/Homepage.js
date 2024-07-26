import React, { useState, useEffect } from 'react';
import SignInButton from '../components/SignInButton';



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
            const response = await fetch('http://54.209.224.192:8080/home');
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.text();
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
        <h1>Fetched Data:</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <SignInButton />
        </div>
    );    
};

export default Homepage;