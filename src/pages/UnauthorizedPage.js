import React from 'react';
import { Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';
const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/'); // Replace '/login' with the actual path to your login page
  };
  return (
    <>
      <div>
        <h1>Unauthorized</h1>
        <p>You do not have access to this page.</p>
      </div>
      <div>
        <Button type="button" sx={{
        color: "white",
        backgroundColor: "lightblue",
        '&:hover': { backgroundColor: 'deepskyblue' }
      }} onClick={handleLogin}>Back to Login Page</Button>
      </div>
    </>
  );
};

export default UnauthorizedPage;
