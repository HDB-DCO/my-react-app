import React,  { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import CustomPagination from '../components/CustomPagination';

export default function SimpleDataGrid() {
    const [page, setPage] = useState(1);
    const totalPages = 10; // Example total pages
  
    const handlePageChange = (value) => {
      setPage(value);
    };
  
    return (
      <div>
        {/* Your table component here */}
        
        <CustomPagination count={10} initialPage={4} onPageChange={handlePageChange} />
      </div>
  );
}
