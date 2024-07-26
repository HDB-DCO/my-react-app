import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';

const Review = () => {
    const location = useLocation();
    const { state } = location;

    return (
        <Box container justifyContent="center" sx={{ padding: 2 }}>
            <Paper elevation={3} sx={{ padding: 4, width: '80%' }}>
                <Typography variant="h5" gutterBottom>Review Your Submission</Typography>
                <Typography variant="h6">Employee Name: {state.employeeName}</Typography>
                <Typography variant="h6">Employee ID: {state.employeeId}</Typography>
                <Typography variant="h6">Leave Type: {state.leaveType}</Typography>
                <Typography variant="h6">Start Date: {state.appliedStartDate}</Typography>
                <Typography variant="h6">End Date: {state.appliedEndDate}</Typography>
                <Typography variant="h6">Metadata ID: {state.uploadedFileName}</Typography>
            </Paper>
        </Box>
    );
};

export default Review;
