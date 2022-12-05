import React, { useState, useEffect, useRef } from 'react';
// AgGrid imports
import { AgGridReact } from'ag-grid-react'
import'ag-grid-community/dist/styles/ag-grid.css'
import'ag-grid-community/dist/styles/ag-theme-material.css';
import { PropertyKeys } from 'ag-grid-community';
/*
Called via  <CustomerList />
The succcess of the api request can be checked in browser console > network > and if "customers" is visible
*/
export default function CustomerList(props) {

    // Customer array
    const [customers, setCustomers] = useState([]);
    // Customer object
    const [customer, setCustomer] = useState({firstname: ''});

    //API data fetched
    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
        .then(response => response.json())
        .then(data => setCustomers(data.content))
    }
    // The API is called
    useEffect(() => fetchData, []);

    // Grid ref required by AgGrid
    const gridRef = useRef();
    // Adgrid columns
    const columns = [  
        { field: "firstname", sortable: true, filter: true, floatingFilter: true },
        { field: "lastname", sortable: true, filter: true, floatingFilter: true },
        { field: "email", sortable: true, filter: true, floatingFilter: true },
        { field: "phone", sortable: true, filter: true, floatingFilter: true },
        { field: "streetaddress", sortable: true, filter: true, floatingFilter: true },
        { field: "city", sortable: true, filter: true, floatingFilter: true },
        { field: "postcode", sortable: true, filter: true, floatingFilter: true }
    ]

    return (
        <div>
            {/* The table is returned to screen */}
            <div className="ag-theme-material"
                style={{height: '700px', width: '70%', margin: 'auto'}} >
                <AgGridReact 
                    ref={gridRef}
                    onGridReady={ params => gridRef.current = params.api }
                    rowSelection="single"
                    columnDefs={columns}
                    animateRows={true}
                    rowData={customers}>
                </AgGridReact>
            </div>
        </div>
    );
}