// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: {
    staffId: '',
    token: '',
    roles: [],
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState, 
  reducers: {
    login(state, action) {
      //console.log('login action received:', action);
      state.isAuthenticated = true;
      state.user = {
        staffId: action.payload.staffId,  
        token: action.payload.token,
        roles: action.payload.roles, //.map(role=>role.authority), // Include roles in user state
      };
    },
    logout(state) {
      //alert("someone's logging out");
      state.isAuthenticated = false;
      state.user = {
        staffId: '',  
        token: '',
        roles: 'PUBLIC', //.map(role=>role.authority), // Include roles in user state
      };
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;