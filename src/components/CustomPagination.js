import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';

const CustomPagination = ({ count, initialPage = 1, onPageChange }) => {
  const [page, setPage] = useState(initialPage);

  const handlePageChange = (event, value) => {
    //console.log('Event:', event); // Debugging: Log the event
    //console.log('New Page Value:', value); // Debugging: Log the new page value
    setPage(value); // Update the page state
    onPageChange(value); // Call the parent component's onPageChange function
  };

  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
      <Pagination
        count={count}
        page={page}
        onChange={handlePageChange} // Handle page change
        color="primary"
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                border: '2px solid',
                borderColor: 'primary.main',
                boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
              },
            }}
          />
        )}
      />
    </Stack>
  );
};

export default CustomPagination;
