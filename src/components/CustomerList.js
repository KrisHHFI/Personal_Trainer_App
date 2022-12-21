import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css';

export default function CustomerList(props) {
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState({ firstname: '' });
    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
            .then(response => response.json())
            .then(data => setCustomers(data.content))
    }

    useEffect(() => fetchData, []);

    const gridRef = useRef();

    const columns = [
        { field: "firstname", sortable: true, filter: true, floatingFilter: true },
        { field: "lastname", sortable: true, filter: true, floatingFilter: true },
        { field: "email", sortable: true, filter: true, floatingFilter: true },
        { field: "phone", sortable: true, filter: true, floatingFilter: true },
        { field: "streetaddress", sortable: true, filter: true, floatingFilter: true },
        { field: "city", sortable: true, filter: true, floatingFilter: true },
        { field: "postcode", sortable: true, filter: true, floatingFilter: true }
    ]

    const inputChanged = (event) => {
        setCustomer({ ...customer, [event.target.name]: event.target.value });
    }

    const addCustomer = (event) => {
        fetch('https://customerrest.herokuapp.com/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        }).then((response) => {
            if (response.ok) {
                alert("Customer added");
                fetchData();
            } else {
                alert("Error: check input format.");
            }
        })
    }

    const editCustomer = (rowData, event) => {
        if (gridRef.current.getSelectedNodes().length > 0) {
            let text = 'Edit customer?';
            if (window.confirm(text) == false) {
                return;
            }

            let selectedRow = gridRef.current.getSelectedRows();
            let customerURL = selectedRow[0].links[0].href;
            fetch(customerURL, {
                method: 'PUT',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(customer)
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

    const deleteCustomer = (rowData) => {
        if (gridRef.current.getSelectedNodes().length > 0) {
            let text = 'Delete customer?';
            if (window.confirm(text) == false) {
                return;
            }
            let selectedRow = gridRef.current.getSelectedRows();
            let customerURL = selectedRow[0].links[0].href;
            fetch(customerURL, {
                method: 'DELETE'
            })
                .then(res => fetchData())
        } else {
            alert('Select row first');
        }
    }

    return (
        <div>
            <fieldset>
                <legend>Add/Edit/Delete Customer</legend>
                <input type="text" onChange={inputChanged} placeholder="First Name" name="firstname" value={customer.firstname} />
                <input type="text" onChange={inputChanged} placeholder="Last Name" name="lastname" value={customer.lastname} />
                <input type="text" onChange={inputChanged} placeholder="Email" name="email" value={customer.email} />
                <input type="text" onChange={inputChanged} placeholder="Phone" name="phone" value={customer.phone} />
                <input type="text" onChange={inputChanged} placeholder="Street Address" name="streetaddress" value={customer.streetaddress} />
                <input type="text" onChange={inputChanged} placeholder="City" name="city" value={customer.city} />
                <input type="text" onChange={inputChanged} placeholder="Post Code" name="postcode" value={customer.postcode} />
                <button onClick={addCustomer}>Add</button>
                <button onClick={editCustomer}>Edit</button>
                <button onClick={deleteCustomer}>Delete</button>
            </fieldset>
            <div className="ag-theme-material"
                style={{ height: '700px', width: '70%', margin: 'auto' }} >
                <AgGridReact
                    ref={gridRef}
                    onGridReady={params => gridRef.current = params.api}
                    rowSelection="single"
                    columnDefs={columns}
                    animateRows={true}
                    rowData={customers}>
                </AgGridReact>
            </div>
        </div>
    );
}