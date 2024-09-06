import React, { useState, useEffect } from 'react';
import ApplicationStatusTable from '../components/ApplicationStatusTable';
import { fetchClient } from '../js/fetchClient';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getIsAuthenticated, getStaffId, getToken, getRoles } from '../js/stateUtils';

const ApprovedRequests = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [columns, setColumns] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const role = getRoles()[0];
    const staffId = getStaffId();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const transformData = (data) => {
        return data.map(({ id, username, leaveType, applicationType, applicationDate, appliedStartDate, appliedEndDate, uploadedFileName, isPlApproved, isVendorApproved, fileUrl, }) => ({
          id,
          username,
          leaveType,
          applicationType,
          applicationDate,
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
            const response = await fetchClient(`getAbsenceRequests/status/${staffId}?page=${page}&size=${rowsPerPage}&role=${role}`,{},null);
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            ////console.log("result :: ",result);
            ////console.log("result.columns :: ",result.columns);
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

    const handleApproval = async (id, action) => {
        
        const response = await fetchClient(`approveLeaveRequest/${id}?approverStaffId=${staffId}&approverRole=${role}&action=${action}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.text();
            if (!response.ok){
                if(response.status === 409){
                    setMessage(result);
                    setMessageType('error');
                  }
            } else {
                setMessage(result);
                setMessageType('success');
            }
            // Handle success or update state if needed
        
        console.log("")
        fetchData(page, rowsPerPage);
        
    setTimeout(() => {
        console.log("Waited 5 seconds");
        setMessage("");
        setMessageType("");
      }, 5000);
      
    };

    return (
        <>
        <div>
        { loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
        ) : (
        <>
           <> {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )} </>
            <div>
                <ApplicationStatusTable
                data={data}
                fields={columns}
                currentPage={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                onApprove={handleApproval}
                totalPages={totalCount} // Pass total count to the table
            /> 
            </div>
        </>
        
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

export default ApprovedRequests;
