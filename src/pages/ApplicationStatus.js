import React, { useState, useEffect } from 'react';
import ApplicationStatusTable from '../components/ApplicationStatusTable';
import { fetchClient } from '../js/fetchClient';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getIsAuthenticated, getStaffId, getToken, getRoles } from '../js/stateUtils';
import { TextField, MenuItem, Grid } from '@mui/material';
import BasicExampleDataGridPro from '../components/BasicExampleDataGridPro';
import  BasicExampleDataGrid from '../components/BasicExampleDataGridPro';
import { Checkbox, FormControlLabel, Button } from '@mui/material';

const ApplicationStatus = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [columns, setColumns] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const role = getRoles()[0];
    const staffId = getStaffId();
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const months = [
        { name: 'January', value: 1 },
        { name: 'February', value: 2 },
        { name: 'March', value: 3 },
        { name: 'April', value: 4 },
        { name: 'May', value: 5 },
        { name: 'June', value: 6 },
        { name: 'July', value: 7 },
        { name: 'August', value: 8 },
        { name: 'September', value: 9 },
        { name: 'October', value: 10 },
        { name: 'November', value: 11 },
        { name: 'December', value: 12 }
      ];
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');


  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i);
  let allColumns =[];
  if(role==='ADMIN'){
    allColumns = ['id', 'username', 'leaveType', 'applicationType', 'applicationDate', 'appliedStartDate', 'appliedEndDate', 'uploadedFileName', 'isApplicationApproved', 'isPlApproved', 'isVendorApproved', 'fileUrl', 'isValidDates'];
}
else if(role==='CP'){
    allColumns = [ 'username', 'leaveType', 'applicationType', 'applicationDate', 'appliedStartDate', 'appliedEndDate', 'uploadedFileName', 'isApplicationApproved', 'isPlApproved', 'isVendorApproved', 'isValidDates', 'revoke'];

}
    // State for visible columns
    const [visibleColumns, setVisibleColumns] = useState(allColumns);


  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  // useEffect(() => {
  //   if (month && year) {
  //     //setLoading(true);
  //     const fetchData = async () => {
  //       try {
  //         const response = await fetchClient(`getAllAbsenceRequests/monthly?page=${page}&size=${rowsPerPage}&month=${month}&year=${year}`,{},null);
  //         if (!response.ok) throw new Error('Network response was not ok');
  //           const result = await response.json();
  //           ////console.log("result :: ",result);
  //           ////console.log("result.columns :: ",result.columns);
  //           const data = transformData(result.content);
  //           setData(data);
  //           setTotalCount(result.totalPages);
  //           if (data.length > 0) {
  //           setColumns(Object.keys(data[0]));
  //           //setColumns(extractedColumns);
  //           }
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //       }
  //     };
  //     fetchData();
  //     //setLoading(false);
  //   }
  // }, [month, year]);



    const transformData = (data) => {
        return data.map(({ id, username, leaveType, applicationType, applicationDate, appliedStartDate, appliedEndDate, uploadedFileName, isApplicationApproved, isPlApproved, isVendorApproved, fileUrl, isValidDates }) => ({
          id,
          username,
          leaveType,
          applicationType,
          applicationDate,
          appliedStartDate,
          appliedEndDate,
          uploadedFileName,
          isApplicationApproved,
          isPlApproved,
          isVendorApproved,
          fileUrl,
          isValidDates: isValidDates === true ? "Yes" : leaveType==="annual"?"":"No",
        }));
      };

      const calculateNewField = (item) => {
        // Get today's date and format it as 'YYYY-MM-DD'
        console.log("calculateNewField-----------");
        console.log("item :: ",item);
        const today = new Date().toISOString().split('T')[0];
      
        const appliedStartDate = item.appliedStartDate.split(' ')[0];
        const appliedEndDate = item.appliedEndDate.split(' ')[0];
      
        if((appliedStartDate >= today && appliedEndDate >= today) && item.applicationType==='Applying' && (item.isApplicationApproved ==='pending' || item.isApplicationApproved ==='approved')){
          return 'can';
        } else {
          return 'cannot';
        }
        // if ((appliedStartDate < today && appliedEndDate < today) || item.applicationType==='Revoking' || item.isApplicationApproved ==='revoked' || item.isApplicationApproved ==='rejected' || item.isApplicationApproved ==='Admin Rejected') {
        //   return 'cannot';
        // } 
        // else {
        //  return 'can';
        // }
        // else if ((appliedStartDate > today && appliedEndDate > today) || (item.isPlApproved==='pending' && item.isVendorApproved==='pending')) {
        //   return 'can';
        // } else if ((appliedStartDate < today && appliedEndDate > today) || (item.isPlApproved==='approved' && item.isVendorApproved==='approved')) {
        //   return 'canwithcaution';
        // }
      };
      
      
      const transformDataCP = (data) => {
        console.log("transformDataCP--------");
        return data.map(({ id, username, leaveType, applicationType, applicationDate, appliedStartDate, appliedEndDate, uploadedFileName, isApplicationApproved, isPlApproved, isVendorApproved, fileUrl, isValidDates }) => {
          const revoke = calculateNewField({ appliedStartDate, appliedEndDate, applicationType, isApplicationApproved, isPlApproved, isVendorApproved });
          return {
            id,
            username,
            leaveType,
            applicationType,
            applicationDate,
            appliedStartDate,
            appliedEndDate,
            uploadedFileName,
            isApplicationApproved,
            isPlApproved,
            isVendorApproved,
            fileUrl,
            isValidDates: isValidDates === true ? "Yes" : leaveType==="annual"?"":"No",
            revoke // Adding the calculated new field here
          };
        });
      };

      useEffect(() => {
        fetchData(page, rowsPerPage);
    }, []);

    useEffect(() => {
      //alert("Hi");
        fetchData(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const onSearchButtonClick = async (payload) => {
      

  // Construct the API URL with query parameters
  const apiUrl = `filterAbsenceRequests/${staffId}?page=${page}&size=${rowsPerPage}&role=${role}`;
  console.log('apiUrl :: ',apiUrl);
  try {
        setLoading(true);
        const response = await fetchClient(apiUrl,{ 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)},null);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        console.log("result :: ",result);
        ////console.log("result.columns :: ",result.columns);
        const data = role==='ADMIN'?transformData(result.content):transformDataCP(result.content);
        //console.log("data :: ",data);
        setData(data);
        setTotalCount(result.totalPages);
        //console.log("result.totalPages :: ",result.totalPages);
        if (data.length > 0) {
        setColumns(Object.keys(data[0]));
        //setColumns(extractedColumns);
        }
       
      } catch (error) {
        console.error('Error fetching data:', error);
      }finally {
        setLoading(false);
      }
    
    };
    const fetchData = async (page, rowsPerPage) => {
        try {
      //console.log("fetchData is being called.......");
      //console.log("page :: ",page);
      //console.log("rowsPerPage :: ",rowsPerPage);
      
            setLoading(true);
            const response = await fetchClient(`getAbsenceRequests/${staffId}?page=${page}&size=${rowsPerPage}&role=${role}`,{},null);
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            //console.log("result :: ",result);
            ////console.log("result.columns :: ",result.columns);
            const data = role==='ADMIN'?transformData(result.content):transformDataCP(result.content);
            //console.log("data :: ",data);
            setData(data);
            setTotalCount(result.totalPages);
            //console.log("result.totalPages :: ",result.totalPages);
            if (data.length > 0) {
            setColumns(Object.keys(data[0]));
            //setColumns(extractedColumns);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }finally {
            setLoading(false);
        }

    };

    const handleColumnToggle = (column) => {
      setVisibleColumns(prevVisibleColumns =>
          prevVisibleColumns.includes(column)
              ? prevVisibleColumns.filter(col => col !== column)
              : [...prevVisibleColumns, column]
      );
  };

  const handleRevoke = async (parms) => {
    console.log("handleRevoke------");
    console.log("parms :: ",parms);
    setLoading(true);
    const response = await fetchClient(`requestRevokeEmployeeLeave/${parms.row.id}`,{ method: 'PUT',},null);
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.text();
    console.log('result :: ',result);
    fetchData(page, rowsPerPage);
    setLoading(false);
  }

  const handleAmendParent = async (row,fromDate,toDate) => {
    console.log("handleAmendParent------");
    setLoading(true);
    //console.log("row :: ",row);
    const response = await fetchClient(`requestAmendEmployeeLeave/${row.id}?appliedStartDateAmended=${fromDate}&appliedEndDateAmended=${toDate}`,{ method: 'PUT',},null); 
    const result = await response.text();
    if (!response.ok){
      if(response.status === 409){
        setMessage(result);
        setMessageType('error');
      }
    } else{
    setMessage(result);
    setMessageType('success');
    }
    console.log('result :: ',result);
    fetchData(page, rowsPerPage);
    setLoading(false);
  }

  const handleAdminMCCheck = async (params,action) => {
    console.log("handleAdminMCCheck------");
    setLoading(true);
    //console.log("row :: ",row);
    const response = await fetchClient(`handleAdminMCCheck/${params.row.id}?action=${action}`,{ method: 'PUT',},null); 
    const result = await response.text();
    if (!response.ok){
      if(response.status === 409){
        setMessage(result);
        setMessageType('error');
      }
    } else{
    setMessage(result);
    setMessageType('success');
    }
    console.log('result :: ',result);
    fetchData(page, rowsPerPage);
    setLoading(false);
  }


    const handleApproval = async (id, stage) => {
        try {
            const response = await fetch(`/api/approve/${id}?stage=${stage}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            // Handle success or update state if needed
        } catch (error) {
            console.error('Error approving:', error);
        }
    };

    return (
        <>
        <div>
        { loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
        ) : (
        <div>
          {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}

            {/* {
                role==='ADMIN' && (<div>
                    <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="Month"
                        value={month}
                        onChange={handleMonthChange}
                        fullWidth
                      >
                        {months.map((monthObj) => (
                            <MenuItem key={monthObj.value} value={monthObj.value}>
                            {monthObj.name}
                            </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="Year"
                        value={year}
                        onChange={handleYearChange}
                        fullWidth
                      >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                            {year}
                            </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid></div> )

            } */}
            {/* <div>
            <ApplicationStatusTable
            data={data}
            fields={columns}
            currentPage={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            //onApprove={handleApproval}
            totalPages={totalCount} // Pass total count to the table
        /> 
        </div> */}
        <div>
        {/* {console.log("data :: ",data)}
        {console.log("columns :: ",columns)} */}
        {
                role==='ADMIN' && (
        <Grid container spacing={2} style={{ marginBottom: 16 }}>
                {allColumns.map((column) => (
                    <Grid item key={column}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={visibleColumns.includes(column)}
                                    onChange={() => handleColumnToggle(column)}
                                    name={column}
                                    color="primary"
                                />
                            }
                            label={column.charAt(0).toUpperCase() + column.slice(1)}
                        />
                    </Grid>
                ))}
            </Grid> ) }
            {/* {console.log("totalCount :: ",totalCount)} */}
        <BasicExampleDataGrid
                rows={data}
                columns={visibleColumns}
                loading={loading}
                totalPages={totalCount}
                page={page}
                pageSize={rowsPerPage}
                onPageChange={setPage}
                onPageSizeChange={setRowsPerPage}
                specificColumn='uploadedFileName' // The column to have a button
                onSearchButtonClick={onSearchButtonClick}
                handleRevokeParent={handleRevoke}
                handleAmendParent={handleAmendParent}
                handleAdminMCCheck={handleAdminMCCheck}
            />

        </div>
        </div>
        
    ) }
    </div>
    </>
    );
};

export default ApplicationStatus;
