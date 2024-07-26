import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import AbsenceRequest from "./pages/AbsenceRequest";
import AddEmployee from './pages/AddEmployee';
import AbsenceRequestCopy from "./pages/AbsenceRequestCopy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/absence_request" element={<AbsenceRequest />} />
          <Route path="/absence_request_copy" element={<AbsenceRequestCopy />} />
          <Route path="/add_employee" element={<AddEmployee />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
