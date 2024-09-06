import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Typography, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import FileModal from './FileModal';
import CustomPagination from './CustomPagination';
import { getRoles } from '../js/stateUtils';
import { Dialog, DialogActions, DialogContent, DialogTitle, Box  } from '@mui/material';
import { fetchClient } from '../js/fetchClient';

const BasicExampleDataGridPro = ({
  rows,
  columns,
  page,
  loading,
  totalPages,
  onPageChange,
  onPageSizeChange,
  specificColumn,
  onSearchButtonClick,
  handleRevokeParent,
  handleAmendParent,
  handleAdminMCCheck,
}) => {
  page = page + 1;
  const [filters, setFilters] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [fileType, setFileType] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [pageSize, setPageSize] = useState();
  const role = getRoles()[0];


const [dialogOpen, setDialogOpen] = useState(false);
const [initialFromDate, setInitialFromDate] = useState(null);
const [selectedFromDate, setSelectedFromDate] = useState(null);
const [selectedToDate, setSelectedToDate] = useState(null);
const [selectedParams, setSelectedParams] = useState(null);



const formatDate = (dateString) => {
  return new Date(dateString.split('T')[0]); // Convert to Date object, ignoring time if present
};

const handleOpenDialog = (params) => {
  setSelectedFromDate(formatDate(params.row.appliedStartDate));
  setInitialFromDate(formatDate(params.row.appliedStartDate));
  setSelectedToDate(formatDate(params.row.appliedEndDate));
  setSelectedParams(params);  // Store the entire params object in state
  setDialogOpen(true);
};

const handleCloseDialog = () => {
  setDialogOpen(false);
};


const handleAmendSubmit = () => {
  // Use the stored params and selected dates
  
  console.log("handleAmendSubmit------");
  const { row } = selectedParams;
  console.log(`Revoke action for ${row.id} with From: ${selectedFromDate.toISOString().split('T')[0]} and To: ${selectedToDate.toISOString().split('T')[0]}`);
  
  handleAmend(row, selectedFromDate, selectedToDate);
  setDialogOpen(false);
};


  console.log("rows :: ", rows);

  useEffect(() => {
    // Fetch data based on current page and page size when they change
  }, [page, pageSize]);

  const handleFilterChange = (event, column) => {
    setFilters({
      ...filters,
      [column]: event.target.value,
    });
  };

  const handleOpenModal = (url) => {
    setFileUrl(url);
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

  const handlePageclick = (newPage) => {
    console.log("newPage:", newPage);
    onPageChange(newPage - 1);
  };

  const handleRevoke = async (parms) => {
    handleRevokeParent(parms);
  }

  // const filteredRows = rows.filter((row) => {
  //   return columns.every((column) => {
  //     const filterValue = filters[column] || '';
  //     return (
  //       filterValue === '' ||
  //       String(row[column]).toLowerCase().includes(filterValue.toLowerCase())
  //     );
  //   });
  // });

  const gridColumns = columns.map((column) => {
    if (column === 'isValidDates' && role === 'ADMIN') {
      return {
        field: column,
        headerName: 'Is Valid Dates',
        width: 200, // Customize the width as needed
        renderCell: (params) => (
          <>
            {params.row.isValidDates === 'No' && params.row.isApplicationApproved != 'Admin Rejected'? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => handleAdminMCCheck(params,'accept')}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={() => handleAdminMCCheck(params,'reject')}
                >
                  Reject
                </Button>
              </Box>
            ) : null}
          </>
        ),
      };
    }

    if (column === 'revoke') {
      return {
        field: column,
        headerName: column.charAt(0).toUpperCase() + column.slice(1),
        width: 200,  // Increased width for 'Revoke' column
        renderHeader: () => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: '40px',
              padding: '8px',
              boxSizing: 'border-box',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 'bold', textAlign: 'center', overflow: 'hidden' }}
              noWrap
            >
              {column.charAt(0).toUpperCase() + column.slice(1)}
            </Typography>
          </div>
        ),
        renderCell: (params) => (
          <>
                { params.value === 'can' ? (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleRevoke(params)}
                  >
                    Revoke
                  </Button>
                ) : null}
                {/* {
                  (params.value === 'canwithcaution' || params.value === 'can') ? (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ ml: 2 }} // Adds left margin (padding) of 2 units
                      onClick={() => handleOpenDialog(params)}
                    >
                      Amend
                    </Button>
                  ) : null
                }   */}
      

  
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
              <DialogTitle>Revoke Dates</DialogTitle>
              <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* <TextField
                      label="From"
                      type="date"
                      value={selectedFromDate ? selectedFromDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setSelectedFromDate(new Date(e.target.value))}
                      InputProps={{
                        min: (selectedFromDate && new Date(selectedFromDate) > new Date())
                          ? selectedFromDate.toISOString().split('T')[0]
                          : new Date().toISOString().split('T')[0],
                        max: selectedParams ? formatDate(selectedParams.row.appliedEndDate).toISOString().split('T')[0] : ''
                      }}
                      fullWidth
                    /> */}
                    <TextField
                      label="From"
                      type="date"
                      value={selectedFromDate ? selectedFromDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setSelectedFromDate(new Date(e.target.value))}
                      inputProps={{
                        min: (initialFromDate && new Date(initialFromDate) > new Date())
                          ? initialFromDate.toISOString().split('T')[0]
                          : new Date().toISOString().split('T')[0],
                        max: selectedParams ? formatDate(selectedParams.row.appliedEndDate).toISOString().split('T')[0] : ''
                      }}
                      fullWidth
                      disabled={initialFromDate && new Date(initialFromDate) < new Date()}
                    />
                    <TextField
                      label="To"
                      type="date"
                      value={selectedToDate ? selectedToDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setSelectedToDate(new Date(e.target.value))}
                      inputProps={{
                        min: (selectedFromDate && new Date(selectedFromDate) > new Date())
                          ? selectedFromDate.toISOString().split('T')[0]
                          : new Date().toISOString().split('T')[0],
                        max: selectedParams ? formatDate(selectedParams.row.appliedEndDate).toISOString().split('T')[0] : ''
                      }}
                      fullWidth
                    />

                  </Box>
                </LocalizationProvider>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleAmendSubmit} variant="contained" color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ),
      };
    }
  
    // Default behavior for other columns
    return {
      field: column,
      headerName: column.charAt(0).toUpperCase() + column.slice(1),
      width: 120, // Default width
      renderCell: (params) =>
        column === specificColumn ? (
          params.row.uploadedFileName && (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenModal(params.row.fileUrl)}
            >
              {params.row.uploadedFileName}
            </Button>
          )
        ) : (
          params.value
        ),
    };
  });
  
  
  // Define the handleAmend function
  const handleAmend = (row, fromDate, toDate) => {
    // Perform the necessary action with the row data and the fromDate and toDate
    handleAmendParent(row,`${fromDate.toISOString().split('T')[0]}`, `${toDate.toISOString().split('T')[0]}`);
    console.log(`Revoke action for ID: ${row.id} (${row.username})`);
    console.log(`From: ${fromDate.toISOString().split('T')[0]}, To: ${toDate.toISOString().split('T')[0]}`);
  };
  

  const rowCount = totalPages * pageSize;

  const handleSearch = async () => {
    //onSearch(filters);
    // Construct query parameters from the filters
    const payload = Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) => value !== null && (key.toLowerCase().includes('date')? true : value.trim() !== "")
      )
    );
    console.log("payload :: ",payload);
    const formattedList = Object.keys(payload).map(key => ({
      columnName: key,
      columnValue: payload[key]
    }));
    
    console.log(formattedList);
    onSearchButtonClick(formattedList);

  };

  const handleChange = (field, value) => {
    // setFilters(prevFilters => ({ ...prevFilters, [field]: value }));

    //alert(field.toLowerCase().includes('date'));
    let formattedValue = value;

    if (field.toLowerCase().includes('date') && value) {
      // Parse the date string and check if it's valid
      const dateValue = dayjs(value);
      formattedValue = dateValue.isValid() ? dateValue.format('YYYY-MM-DD') : '';
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: formattedValue,
    }));
  };

  return (
    
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      { 
                role==='ADMIN' && (
      <div>

      <Grid container spacing={2}>
          {columns.map(column => (
            <Grid item xs={12} sm={6} md={4} key={column}>
              {(column.toLowerCase().includes('date') && !column.includes('isValidDates')  )? (
                <DatePicker
                label={column}
                value={filters[column] || null}
                onChange={(date) => handleChange(column, date)}
                slots={{ textField: TextField }}
                slotProps={{ textField: { fullWidth: true } }}
              />
              
              
              ) : (
                <TextField
                  label={column}
                  value={filters[column] || ''}
                  onChange={(e) => handleChange(column, e.target.value)}
                  fullWidth
                />
              )}
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>

      </div> )}
      <div style={{  overflowX: 'auto' }}>
        <FileModal
          open={modalOpen}
          onClose={handleCloseModal}
          fileUrl={fileUrl}
          fileType={fileType}
        />
        <div style={{ overflowX: 'auto', width: '100%', minWidth: 800 }}>
          <DataGrid
            rows={rows}
            // rows={filteredRows}
            columns={gridColumns.map((col) => ({
              ...col,
              filterable: false,
              disableColumnMenu: true,
              height: 300
            }))}
            disableSelectionOnClick
            loading={loading}
            hideFooter
          />
          <CustomPagination
            count={totalPages}
            initialPage={page}
            onPageChange={handlePageclick}
          />
        </div>
      </div>
    </LocalizationProvider>
  
    );
};

export default BasicExampleDataGridPro;
