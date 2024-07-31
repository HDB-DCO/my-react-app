import React, { useState } from 'react';
import '../css/UserForm.css';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [staffId, setStaffId] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {const currentUrl = window.location.href;
      //console.log("currentUrl :: ");
      //console.log(currentUrl);
      let BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL_DEV;
      //console.log("BASE_URL :: ",BASE_URL);
      const isLocalhost = currentUrl.includes('http://localhost:3000');
      //console.log("isLocalhost :: ",isLocalhost);
      if(isLocalhost === false){
          //console.log("inside if");
          BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL_PROD;
          //console.log("BASE_URL :: ",BASE_URL);
      }
      const response = await fetch(`${BASE_URL}/register/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, staffId, email, mobile, role, password }),
      });
      if (response.ok) {
        const data = await response.text();
        setMessage(data);
        setUsername('');
        setStaffId('');
        setEmail('');
        setMobile('');
        setRole('');
        setPassword('');
      } else {
        console.error('Failed to add user');
        setMessage('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setMessage('Failed to add user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <label>
        Staff Id:
        <input type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} required />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Mobile:
        <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
      </label>
      <label>
        Role:
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          <option value="ADMIN">Admin</option>
          <option value="PL">Project Leader</option>
          <option value="CP">Contract Programmer</option>
          <option value="VENDOR">Vendor</option>
        </select>
      </label>
      <label>
        Temporary Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {message && <p>{message}</p>}
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUser;
