import React, { useState, useEffect, useRef } from 'react';
// AgGrid imports
import { AgGridReact } from'ag-grid-react'
import'ag-grid-community/dist/styles/ag-grid.css'
import'ag-grid-community/dist/styles/ag-theme-material.css';
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
    // The API function is called
    useEffect(() => fetchData, []);
    // Grid ref required by AgGrid
    const gridRef = useRef();
    // AdGrid columns
    const columns = [  
        { field: "firstname", sortable: true, filter: true, floatingFilter: true },
        { field: "lastname", sortable: true, filter: true, floatingFilter: true },
        { field: "email", sortable: true, filter: true, floatingFilter: true },
        { field: "phone", sortable: true, filter: true, floatingFilter: true },
        { field: "streetaddress", sortable: true, filter: true, floatingFilter: true },
        { field: "city", sortable: true, filter: true, floatingFilter: true },
        { field: "postcode", sortable: true, filter: true, floatingFilter: true }
    ]

    // Input box values saved to object
    const inputChanged = (event) => {
        setCustomer({...customer, [event.target.name]: event.target.value});
    }

    // Adds a customer to API
    const addCustomer = (event) => {
    // POST's the customer to the "customers" API
        fetch('https://customerrest.herokuapp.com/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify(customer)
        // If POST successful/or not
        }).then((response) => {
            if (response.ok) {
                alert("Customer added");
                fetchData();
            } else {
                alert("Error: check input format.");
            }
        })
    }

    // Edit Customer within API
    const editCustomer = (rowData, event) => {
        // Identified the selected row, by grid ref number
        if (gridRef.current.getSelectedNodes().length > 0) {
            let text = 'Edit customer?';
            // User must click ok to proceed
            if (window.confirm(text) == false) {
                return;
            } 
            // Gets the customer data from the selected row
            let selectedRow = gridRef.current.getSelectedRows();
            // Gets the unique customer url
            let customerURL = selectedRow[0].links[0].href;
            // The PUT method, which uses the customer url
            fetch(customerURL,{
                method: 'PUT',
                headers: {'content-type': 'application/json'},
                body:  JSON.stringify(customer)
            }).then((response) => {
                if (response.ok) {
                    alert("Customer edited");
                    fetchData();
                } else {
                    alert("Error: check input format.");
                }
            })
        } else {   
            alert('Select row first'); 
        }
    }

    // Delete Customer 
    const deleteCustomer = (rowData) => {
        // Identified the selected row, by grid ref number
        if (gridRef.current.getSelectedNodes().length > 0) {
            let text = 'Delete customer?';
            // User must click ok to proceed
            if (window.confirm(text) == false) {
                return;
            } 
            // Gets the customer data from the selected row
            let selectedRow = gridRef.current.getSelectedRows();
            // Gets the unique customer url
            let customerURL = selectedRow[0].links[0].href;
            // The delete method, which uses the customer url
            fetch(customerURL, {
                method:'DELETE'
            })
            // Refreshes the table
            .then(res => fetchData())
            // If a row isn't selected then show alert message
        } else {   
            alert('Select row first'); 
        }
    }

    return (
        <div>
            <fieldset>
                <legend>Add/Edit/Delete Customer</legend>
                 {/* The input boxes for the car values */}
                <input type="text" onChange={inputChanged} placeholder="First Name" name="firstname" value={customer.firstname}/>
                <input type="text" onChange={inputChanged} placeholder="Last Name" name="lastname" value={customer.lastname}/>
                <input type="text" onChange={inputChanged} placeholder="Email" name="email" value={customer.email}/>
                <input type="text" onChange={inputChanged} placeholder="Phone" name="phone" value={customer.phone}/>
                <input type="text" onChange={inputChanged} placeholder="Street Address" name="streetaddress" value={customer.streetaddress}/>
                <input type="text" onChange={inputChanged} placeholder="City" name="city" value={customer.city}/>
                <input type="text" onChange={inputChanged} placeholder="Post Code" name="postcode" value={customer.postcode}/>
                {/* Add button at top of screen */}
                <button onClick={addCustomer}>Add</button>
                <button onClick={editCustomer}>Edit</button>
                <button onClick={deleteCustomer}>Delete</button>
            </fieldset>
            {/* The Aggrid table is returned to screen */}
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