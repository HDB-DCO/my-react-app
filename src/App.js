import React from "react";
import { Suspense, lazy, startTransition } from 'react';
import { Route, Routes } from "react-router-dom";
import { Navigate} from 'react-router-dom';
import rolesConfig from './pages/manage_role/rolesConfig';
import ProtectedRoute from './pages/manage_role/ProtectedRoute';
import dynamicImport from './pages/manage_role/dynamicImport';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { useLocation } from 'react-router-dom';
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import AbsenceRequest from "./pages/AbsenceRequest";
import AddEmployee from './pages/AddEmployee';
import AbsenceRequestCopy from "./pages/AbsenceRequestCopy";
import Homepage from "./pages/Homepage";
import AddUser from "./pages/AddUser";
const NoPage = lazy(() => import('./pages/NoPage'));
const Login = lazy(() => import('./pages/Login'));

function App() {

  return (
    <>
      <>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
           <Route path="/" element={<Layout />}> 
              <Route path="*" element={<NoPage />} />
              <Route path="/" element={<Login />} />
              {/* <Route path="/" element={<Navigate to="/login" />} />  */}
              {Object.keys(rolesConfig).map((path) => {
                const Component = dynamicImport(path);
                return (
                  <Route 
                    key={path}
                    path={path}
                    element={
                      <ProtectedRoute path={path} roles={rolesConfig[path]}>
                        <Component />
                      </ProtectedRoute>
                    }
                  />
                );
              })}
              <Route path="/unauthorized" element={<UnauthorizedPage />} /> 
             </Route> 
          </Routes>
        </Suspense>
      </>




{/* 


    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/absence_request" element={<AbsenceRequest />} />
          <Route path="/" element={<Login />} />
          <Route path="/absence_request_copy" element={<AbsenceRequestCopy />} />
          <Route path="/add_employee" element={<AddEmployee />} /> 
          <Route path="/add_user" element={<AddUser />} /> 
        </Route>
      </Routes>
    </Router> */}
    </>
  );
}

export default App;
