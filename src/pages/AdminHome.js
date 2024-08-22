import React from 'react';
import BasicExampleDataGrid from '../components/BasicExampleDataGridPro';
import SimpleDataGrid from '../sample/SimpleDataGrid';



const AdminHome = () => {

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        { field: 'age', headerName: 'Age', type: 'number', width: 110 },
      ];
    
      const rows = [
        { id: 1, firstName: 'John', lastName: 'Doe', age: 35 },
        { id: 2, firstName: 'Jane', lastName: 'Smith', age: 42 },
        { id: 3, firstName: 'Mike', lastName: 'Johnson', age: 29 },
        // Add more rows as needed
      ];


    return <div>AdminHome

        <div>
        {/* <BasicExampleDataGrid rows={rows} columns={columns} /> */}
        < SimpleDataGrid />
        </div>
    </div>;
};

export default AdminHome;