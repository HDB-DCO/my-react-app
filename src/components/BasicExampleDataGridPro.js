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
}) => {
  page = page + 1;
  const [filters, setFilters] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [fileType, setFileType] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [pageSize, setPageSize] = useState();
  const role = getRoles()[0];

  //console.log("page from parent :: ", page);

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

  // const filteredRows = rows.filter((row) => {
  //   return columns.every((column) => {
  //     const filterValue = filters[column] || '';
  //     return (
  //       filterValue === '' ||
  //       String(row[column]).toLowerCase().includes(filterValue.toLowerCase())
  //     );
  //   });
  // });

  const gridColumns = columns.map((column) => ({
    field: column,
    headerName: column.charAt(0).toUpperCase() + column.slice(1),
    width: 120,
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
  }));

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
        <div style={{ width: '100%', minWidth: 800 }}>
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
