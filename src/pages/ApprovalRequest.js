import React, { useState, useEffect } from 'react';
import ApplicationStatusTable from '../components/ApplicationStatusTable';
import { fetchClient } from '../js/fetchClient';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getIsAuthenticated, getStaffId, getToken, getRoles } from '../js/stateUtils';

const ApprovalRequest = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [columns, setColumns] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const role = getRoles()[0];
    const staffId = getStaffId();

    const transformData = (data) => {
        return data.map(({ id, username, leaveType, appliedStartDate, appliedEndDate, uploadedFileName, isPlApproved, isVendorApproved, }) => ({
          id,
          username,
          leaveType,
          appliedStartDate,
          appliedEndDate,
          uploadedFileName,
          isPlApproved,
          isVendorApproved,
        }));
      };

      useEffect(() => {
        console.log("[page, rowsPerPage]-----------------------");
        fetchData(page, rowsPerPage);
    }, []);

    useEffect(() => {
        console.log("[page, rowsPerPage]-----------------------");
        console.log("page :: ",page);
        console.log("rowsPerPage :: ",rowsPerPage);
        fetchData(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const fetchData = async (page, rowsPerPage) => {
        try {
            setLoading(true);
            const response = await fetchClient(`getAbsenceRequests/${staffId}?page=${page}&size=${rowsPerPage}&role=${role}`,{},null);
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            console.log("result :: ",result);
            console.log("result.columns :: ",result.columns);
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
        try {

            const response = await fetchClient(`approveLeaveRequest/${id}?approverStaffId=${staffId}&approverRole=${role}&action=${action}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            // Handle success or update state if needed
        } catch (error) {
            console.error('Error approving:', error);
        }
        fetchData(page, rowsPerPage);
    };

    return (
        <>
        {console.log("loading :: ",loading)}
        <div>
        { loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
        ) : (
        <div>
            {console.log("loading :: ",loading)}
            {console.log("hii----------------------")}
            {console.log("columns :: ",columns)}
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

export default ApprovalRequest;
