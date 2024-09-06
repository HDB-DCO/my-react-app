import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/authSlice';
import { getCurrentPage } from '../js/stateUtils';
import { fetchClient } from '../js/fetchClient';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import '../css/Login.css';

const Login = () => {

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLogin();
    }
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const usernameRef = useRef(null);
  const currentPage = getCurrentPage();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetchClient('authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        const { staffId, token, role: roles } = data;
        dispatch(login({ staffId, token, roles }));
        if (roles.includes('ADMIN')) {
          navigate('/admin_home');
        } else if (roles.includes('CP')) {
          navigate('/cp_home');
        } else if (roles.includes('PL')) {
          navigate('/pl_home');
        } else if (roles.includes('VENDOR')) {
          navigate('/vendor_home');
        }
      } else {
        console.error('Failed to login');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <div className="login-container">
          <h2>Login</h2>
          <form className="login-form" onKeyDown={handleKeyDown}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              ref={usernameRef}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
