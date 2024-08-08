import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchClient } from '../js/fetchClient';
import { selectToken,selectUserRoles } from '../redux/selectors';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Accordion, AccordionSummary, AccordionDetails, Button,
  TextField, Typography, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { getIsAuthenticated, getStaffId, getToken, getRoles } from '../js/stateUtils';
import FileModal from './FileModal';

const ApplicationStatusTable = ({ data, fields, currentPage, rowsPerPage, onPageChange, onRowsPerPageChange, onApprove, totalPages }) => {
  //const [data, setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [additionalData, setAdditionalData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const role = getRoles()[0];
  const [fileType, setFileType] = useState(''); // 'image' or 'pdf'
  const [modalOpen, setModalOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  
  const handleOpenModal = (url) => {
    setFileUrl(url);

    // Set file type based on URL extension or content type
    if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) {
      setFileType('image');
    } else if (url.endsWith('.pdf')) {
      setFileType('pdf');
    } else {
      setFileType('');
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  let filteredFields = fields.filter(field => (field !== 'id' && field !== 'fileUrl')); 
  // filteredFields = filteredFields.filter(field => (field !== 'fileUrl')); 
  // filteredFields = filteredFields.filter(field => (field !== 'fileType'));
  //console.log("role :: ",role);
  if(role ==='PL')
  {
    filteredFields = filteredFields.filter(field => field !== 'isVendorApproved');
  } else if(role ==='VENDOR')
    {
      filteredFields = filteredFields.filter(field => field !== 'isPlApproved');
    }
  //const [currentPage, setCurrentPage] = useState(0);
  //const [totalPages, setTotalPages] = useState(0);
  //const [fields, setFields] = useState([]);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const userToken = useSelector(selectToken);
  const userRoles = useSelector(selectUserRoles);
  const hasAdminRole = userRoles.includes('ADMIN');
  //console.log("fields :: ",fields);
  const transformData = (data) => {
    return data.map(({ id, leaveType, appliedStartDate, appliedEndDate, uploadedFileName, isPlApproved, isVendorApproved, }) => ({
      id,
      leaveType,
      appliedStartDate,
      appliedEndDate,
      uploadedFileName,
      isPlApproved,
      isVendorApproved,
    }));
  };


//   useEffect(() => {
//     fetchClient(`getAbsenceRequests?page=${currentPage}&size=10`, {
//       method: 'GET',
//     },null)
//       .then(response => response.json())
//       .then(data => {
//         data.content = transformData(data.content);
//         //setData(data.content);
//         //setTotalPages(data.totalPages);

//         if (data.content.length > 0) {
//           //setFields(Object.keys(data.content[0]));
//         }
//       })
//       .catch(error => console.error('Error fetching data:', error));
//   }, [currentPage, userToken]);

  const handleRowClick = (location, id) => {
    if (expandedRow === id) {
      //setExpandedRow(null);
      setIsAccordionExpanded(false);
    } else {
      fetchClient(`http://localhost:8080/student`, {
        method: 'GET',
      }, { location: location, id: id }, userToken)
        .then(response => response.json())
        .then(data => {
          setAdditionalData(data);
          setExpandedRow(id);
          setIsAccordionExpanded(true);
        })
        .catch(error => console.error('Error fetching additional data:', error));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsAccordionExpanded(true);
  };

  const handleSaveClick = (id) => {
    //console.log("JSON.stringify(additionalData) :: ",JSON.stringify(additionalData[0]));
    fetchClient(`http://localhost:8080/student`, {
        method: 'PUT',
        body: JSON.stringify(additionalData[0]), // Ensure additionalData contains the updated data
    },null,userToken)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update data');
        }
        return response.json();
    })
    .then(updatedData => {
        //setData(data.map(item => item.id === id ? updatedData : item));
        // Optionally, reset editing state
        setIsEditing(false);
        setIsAccordionExpanded(true);
    })
    .catch(error => console.error('Error saving data:', error));
};


  const handleDeleteClick = (id) => {
    fetchClient(`http://localhost:8080/students/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        //setData(data.filter(item => item.id !== id));
        setExpandedRow(null);
        setIsAccordionExpanded(false);
      })
      .catch(error => console.error('Error deleting data:', error));
  };

  const handlePageChange = (page) => {
    //setCurrentPage(page);
  };

  function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
       var ascii = binaryString.charCodeAt(i);
       bytes[i] = ascii;
    }
    return bytes;
 }

 function saveByteArray(reportName, byte, fileType) {
  var blob = new Blob([byte], {type: fileType});
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  var fileName = reportName;
  link.download = fileName;
  link.click();
};

  const handleOpenFile = (fileData, fileName, fileType) => {
    console.log("handleOpenFile---------")
    if(fileType==='pdf'){
      fileType = 'application/pdf';
    } else if(fileType==='jpg'){
      fileType = 'image/jpeg';
    } else if(fileType==='jpeg'){
      fileType = 'image/jpeg';
    }
    
    console.log(fileData, fileName, fileType);


    const url = window.URL.createObjectURL(new Blob([fileData], { type: 'application/octet-stream' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

    //var sampleArr = base64ToArrayBuffer(fileData);
    //saveByteArray("Sample Report", sampleArr, fileType);  
    
  };

const handleDownload = async (imageId, imageName) => {
  console.log("handleDownload----------");
        try {
            const response = await fetchClient(`downloadImage/${imageId}`, { method: 'GET' });
            const blob = await response.blob();
            console.log("after network call handleDownload----------");
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', imageName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                console.log("at the end handleDownload----------");
        } catch (error) {
            console.error('Error downloading file', error);
            alert('Error downloading file');
        }
    };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {filteredFields.map(field => (
                <TableCell key={field}>{field}</TableCell>
              ))}
              {/* {(false ) && (<TableCell>Actions</TableCell>)} */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(item => (
              <React.Fragment key={item.id}>
                <TableRow> 
                {/*  onClick={() => handleRowClick(item.id)}> */}
                  {filteredFields.map(field => (
                    <TableCell key={field}>{
                        field === 'uploadedFileName' ? (<>
                        { item[field] && (
                          <div>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={()=>handleOpenModal(item.fileUrl)}
                            style={{ marginTop: '20px' }}
                          >
                            {item[field]}
                          </Button>
                          <FileModal
                            open={modalOpen}
                            onClose={handleCloseModal}
                            fileUrl={item.fileUrl}
                            fileType={fileType}
                          />
                          {/* <Button onClick={() => handleDownload(item.id,item.uploadedFileName)}>
                                {item[field]}
                          </Button> */}
                        </div>
                        )}</>
                        ) :
                        ( field === 'isPlApproved' && role=='PL' ? (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onApprove(item.id, 'approve')}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => onApprove(item.id, 'reject')}
                                >
                                    Reject
                                </Button>
                            </>
                        ) : (

                            field === 'isVendorApproved' && role=='VENDOR' ? (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onApprove(item.id, 'approve')}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => onApprove(item.id, 'reject')}
                                >
                                    Reject
                                </Button>
                            </>
                        ) : (
                            item[field]
                        )
                        )
                      )
                        
                        
                        }
                        
                        </TableCell>
                  ))}
                  <TableCell>
                    {expandedRow === item.id && (
                      <>
                        {isEditing ? (
                          <>
                            <IconButton onClick={() => handleSaveClick(item.id)}>
                              <SaveIcon />
                            </IconButton>
                            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                          </>
                        ) : (
                          <IconButton onClick={handleEditClick}>
                            <EditIcon />
                          </IconButton>
                        )}
                        {hasAdminRole && (
                        <IconButton onClick={() => handleDeleteClick(item.id)}>
                          <DeleteIcon />
                        </IconButton>)}
                      </>
                    )}
                  </TableCell>
                </TableRow>
                {expandedRow === item.id && (
                  <TableRow>
                    <TableCell colSpan={fields.length + 1}>
                      <Accordion expanded={isAccordionExpanded || isEditing} onChange={() => setIsAccordionExpanded(!isAccordionExpanded)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Additional Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {isEditing ? (
                            <div>
                              {additionalData.length > 0 ? (
                                <ul>
                                  {additionalData.map((item, index) => (
                                    <li key={index}>
                                      {Object.keys(item).map(key => (
                                        <div key={key}>
                                          <TextField
                                            label={key}
                                            value={item[key] || ''}
                                            onChange={(e) =>
                                              setAdditionalData(prevData => [
                                                ...prevData.slice(0, index),
                                                { ...prevData[index], [key]: e.target.value },
                                                ...prevData.slice(index + 1)
                                              ])
                                            }
                                            fullWidth
                                            margin="normal"
                                            disabled={key === 'id'}
                                          />
                                        </div>
                                      ))}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No additional data available.</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              {additionalData.length > 0 ? (
                                <ul>
                                  {additionalData.map((item, index) => (
                                    <li key={index}>
                                      {Object.keys(item).map(key => (
                                        <div key={key}>
                                          <strong>{key}: </strong>
                                          {item[key]}
                                        </div>
                                      ))}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No additional data available.</p>
                              )}
                            </div>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <span>Page {currentPage+1} of {totalPages}</span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages-1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ApplicationStatusTable;
