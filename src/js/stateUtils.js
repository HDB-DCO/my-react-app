// stateUtils.js
import store from '../redux/store'

export const getIsAuthenticated = () => {
  const state = store.getState();
  return state.auth.isAuthenticated;
};

export const getStaffId = () => {
  const state = store.getState();
  return state.auth.user.staffId;
};

export const getToken = () => {
  const state = store.getState();
  return state.auth.user.token;
};

export const getRoles = () => {
  const state = store.getState();
  return state.auth.user.roles;
};

export const getCurrentPage = () => {
  const state = store.getState();
  return state.global.currentPage;
};
