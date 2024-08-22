import React, { useState, useEffect } from 'react';
import '../css/UserForm.css';
import { getIsAuthenticated, getStaffId, getToken, getRoles } from '../js/stateUtils';
import { fetchClient } from '../js/fetchClient';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [staffId, setStaffId] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [plName, setPlName] = useState({});
  const [vendorName, setvendorName] = useState({});
  const [dropdownValue, setDropdownValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [vendorSuggestions, setVendorSuggestions] = useState([]);
  const [suggestionSelected, setSuggestionSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);


  useEffect(() => {
  //console.log('Is Authenticated:', getIsAuthenticated());
  //console.log('Username:', getStaffId());
  //console.log('Token:', getToken());
  //console.log('Roles:', getRoles().join(', '));
  }, []);
  
  useEffect(() => {
    //console.log("searchTerm :: ",searchTerm);
    //console.log("suggestionSelected :: ",suggestionSelected);
    //console.log("plName :: ",plName);
    const fetchSuggestions = async () => {
      if (searchTerm.length > 0 && !suggestionSelected) {
        const suggestions = await searchUserByRole('getPls');
        setSuggestions(suggestions);
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
    
    setSuggestionSelected(false); 
  }, [plName]);

  useEffect(() => {
    
    const fetchSuggestions = async () => {
      if (searchTerm.length > 0 && !suggestionSelected) {
        const suggestions = await searchUserByRole('getVendors');
        setVendorSuggestions(suggestions);
      } else {
        setVendorSuggestions([]);
      }
    };

    fetchSuggestions();
    
    setSuggestionSelected(false); 
  }, [vendorName]);


  // const isFormValid = () => {
  //   let isValid = username !== '' && staffId !== '' && email !== '' && mobile !== '' && role !== '' && password !== '';
  //   if(role==='CP'){
  //     const plId = plName.staffId;
  //     const vendorId = vendorName.staffId;
  //     isValid = plId !== '' && vendorId !== '';
  //   } 
  //   return isValid;
  //   // Add more validation checks for other required fields
  // };

  const searchUserByRole = async (url) => {
    ////console.log("searchUserByname --------");
    ////console.log(url+`${searchTerm}`);
    const response = await fetchClient(url,{},{query:searchTerm}); 
    if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  //console.log("response :: ",response);
  const data = await response.json();
    //console.log("data :: ",data);
    //const names = data.map((item) => `${item.name} (${item.username})`);
    return data;
  };


  const selectPlfromList = (suggestion) => {
    setSelectedValue(suggestion.username);
    setSearchTerm(suggestion.username);
    setSuggestions([]);
    setPlName(suggestion);
    setSuggestionSelected(true); 
    ////console.log("suggestions :: ",suggestions);
  };

  const selectVendorfromList = (suggestion) => {
    setSelectedValue(suggestion);
    setSearchTerm(suggestion);
    setVendorSuggestions([]);
    setvendorName(suggestion);
    setSuggestionSelected(true); 
    ////console.log("suggestions :: ",suggestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {const currentUrl = window.location.href;
      ////console.log("currentUrl :: ");
      ////console.log(currentUrl);
      let BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL_DEV;
      ////console.log("BASE_URL :: ",BASE_URL);
      const isLocalhost = currentUrl.includes('http://localhost:3000');
      ////console.log("isLocalhost :: ",isLocalhost);
      if(isLocalhost === false){
          ////console.log("inside if");
          BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL_PROD;
          ////console.log("BASE_URL :: ",BASE_URL);
      }
    const plId = plName.staffId;
    const vendorId = vendorName.staffId;
    //console.log(JSON.stringify({ username, staffId, email, mobile, role, password, plId, vendorId }));
      const response = await fetchClient(`register/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, staffId, email, mobile, role, password, plId, vendorId }),
      },null);
      if (response.ok) {
        const data = await response.text();
        setMessage(data);
        setUsername('');
        setStaffId('');
        setEmail('');
        setMobile('');
        setRole('');
        setPassword('');
        setPlName({});
        setvendorName({});
        setSearchTerm('');
      } else {
        console.error('Failed to add user');
        setMessage('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setMessage('Failed to add user');
    }
  };
  const handleDropdownChange = (value) => {
    setDropdownValue(value);
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
        <select value={role} onChange={(e) => {setRole(e.target.value); handleDropdownChange(e.target.value);}} required>
          <option value="">Select Role</option>
          <option value="ADMIN">Admin</option>
          <option value="PL">Project Leader</option>
          <option value="CP">Contract Programmer</option>
          <option value="VENDOR">Vendor</option>
        </select>
      </label>
      {dropdownValue === 'CP' && (
        <>
          <label>
            Project Leader:
            <input
              type="text"
              id="plName"
              name="plName"
              value={plName.username}
              onChange={(e) => { setPlName(e.target.value); setSearchTerm(e.target.value); } } required
            />
          </label>
          {suggestions.length > 0 &&
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
                    <li className="suggestions"
                        key={index} 
                        onClick={() => suggestion.username !== "No PL found with the name" && selectPlfromList(suggestion)}
                        style={{ cursor: suggestion.username === "No PL found with the name" ? 'default' : 'pointer' }}
                    >
                        {suggestion.username}
                    </li>
                ))}
          </ul>


          }
          <label>
            Vendor:
            <input
              type="text"
              id="vendorName"
              name="vendorName"
              value={vendorName.username}
              onChange={(e) => { setvendorName(e.target.value); setSearchTerm(e.target.value); }} required
            />
          </label>
          {vendorSuggestions.length > 0 &&
          <ul className="suggestions">
            {vendorSuggestions.map((suggestion, index) => (
                <li className="suggestions"
                    key={index} 
                    onClick={() => suggestion.username !== "No Vendor found with the name" && selectVendorfromList(suggestion)}
                    style={{ cursor: suggestion.username === "No Vendor found with the name" ? 'default' : 'pointer' }}
                >
                    {suggestion.username}
                </li>
            ))}
          </ul>
          }
        </>
      )}
      <label>
        Temporary Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {message && <p>{message}</p>}
      <button type="submit">Add User</button>
      {/* <button disabled={!isFormValid()} type="submit"  style={{
          backgroundColor: isFormValid() ? 'blue' : 'gray',
          cursor: isFormValid() ? 'pointer' : 'not-allowed',
        }}>Add User</button> */}
    </form>
  );
};

export default AddUser;
