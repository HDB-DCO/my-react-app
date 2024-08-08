import React, { useState, useEffect } from 'react';
import ApplicationStatusTable from '../components/ApplicationStatusTable';
import { fetchClient } from '../js/fetchClient';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getIsAuthenticated, getStaffId, getToken, getRoles } from '../js/stateUtils';
import { TextField, MenuItem, Grid } from '@mui/material';

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


  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i);


  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  useEffect(() => {
    if (month && year) {
      //setLoading(true);
      const fetchData = async () => {
        try {
          const response = await fetchClient(`getAllAbsenceRequests/monthly?page=${page}&size=${rowsPerPage}&month=${month}&year=${year}`,{},null);
          if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            //console.log("result :: ",result);
            //console.log("result.columns :: ",result.columns);
            const data = transformData(result.content);
            setData(data);
            setTotalCount(result.totalPages);
            if (data.length > 0) {
            setColumns(Object.keys(data[0]));
            //setColumns(extractedColumns);
            }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
      //setLoading(false);
    }
  }, [month, year]);



    const transformData = (data) => {
        return data.map(({ id, username, leaveType, appliedStartDate, appliedEndDate, uploadedFileName, isPlApproved, isVendorApproved, fileUrl }) => ({
          id,
          username,
          leaveType,
          appliedStartDate,
          appliedEndDate,
          uploadedFileName,
          isPlApproved,
          isVendorApproved,
          fileUrl,
        }));
      };

      useEffect(() => {
        fetchData(page, rowsPerPage);
    }, []);

    useEffect(() => {
        fetchData(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const fetchData = async (page, rowsPerPage) => {
        try {
            setLoading(true);
            const response = await fetchClient(`getAbsenceRequests/${staffId}?page=${page}&size=${rowsPerPage}&role=${role}`,{},null);
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            console.log("result :: ",result);
            //console.log("result.columns :: ",result.columns);
            const data = transformData(result.content);
            setData(data);
            setTotalCount(result.totalPages);
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
            {
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

            }
            <div>
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
        </div>
        </div>
        
    ) }
         {/* <ApplicationStatusTable
            data={data}
            columns={columns}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            //onApprove={handleApproval}
            totalCount={totalCount} // Pass total count to the table
        /> */}
    </div>
    </>
    );
};

export default ApplicationStatus;
