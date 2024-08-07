import React, { useState } from 'react';
import { fetchClient } from '../js/fetchClient';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [appliedStartDate, setAppliedStartDate] = useState('');
    const [appliedEndDate, setAppliedEndDate] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("employeeId :: ",employeeId);
        console.log("leaveType :: ",leaveType);
        console.log("appliedStartDate :: ",appliedStartDate);
        console.log("appliedEndDate :: ",appliedEndDate);
        console.log("file :: ",file);
        const formData = new FormData();
        formData.append('employeeId', employeeId);
        formData.append('leaveType', leaveType);
        formData.append('appliedStartDate', appliedStartDate);
        formData.append('appliedEndDate', appliedEndDate);
        formData.append('file', file);
        console.log("formData :: ",formData);
        console.log("JSON.stringify({ employeeId, leaveType, appliedStartDate, appliedEndDate, file }) :: ",JSON.stringify({ employeeId, leaveType, appliedStartDate, appliedEndDate }));

        try {
            const response = await fetchClient('api/upload', {
                method: 'POST',        
                 body: formData,
            },null);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.text();
            console.log(result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} required />
            <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Employee ID"
                
            />
            <input
                type="text"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                placeholder="Leave Type"
                
            />
            <input
                type="date"
                value={appliedStartDate}
                onChange={(e) => setAppliedStartDate(e.target.value)}
                placeholder="Applied Start Date"
                
            />
            <input
                type="date"
                value={appliedEndDate}
                onChange={(e) => setAppliedEndDate(e.target.value)}
                placeholder="Applied End Date"
                
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default FileUpload;
