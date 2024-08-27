import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUserRoles, selectIsAuthenticated } from '../../redux/selectors';
import { setCurrentPage } from '../../redux/globalValuesSlice';
import { useDispatch } from 'react-redux';
import { removeCurrentPage } from '../../redux/globalValuesSlice';
import { getCurrentPage } from '../../js/stateUtils';

const ProtectedRoute = ({ path, children, roles }) => {
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRoles = useSelector(selectUserRoles);
  const dispatch = useDispatch();

  // //console.log("Inside ProtectedROute---------");
  // //console.log("path :: ",path);
  // //console.log("roles :: ",roles);
  // //console.log("userRoles :: ",userRoles);

  const hasAccess = useMemo(() => {
    ////console.log("!isAuthenticated && path!==/login && path!==/register :: ",(!isAuthenticated && path!=="/login"));
    //dispatch(removeCurrentPage());
    dispatch(setCurrentPage({path}));
    console.log("getCurrentPage() :: ",getCurrentPage());
    if (!isAuthenticated && path!=="/") return false;
    return roles.some(role => userRoles.includes(role));
    if(roles.some(role => userRoles.includes(role))){
      return true;
    }
    else{
      path='/';
      dispatch(setCurrentPage({path}));
      return false;
    }
  }, [isAuthenticated, userRoles, roles]);

  return hasAccess ? children : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
