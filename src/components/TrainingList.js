import React, { useState, useEffect, useRef } from 'react';
// AgGrid imports
import { AgGridReact } from'ag-grid-react'
import'ag-grid-community/dist/styles/ag-grid.css'
import'ag-grid-community/dist/styles/ag-theme-material.css';
import { PropertyKeys } from 'ag-grid-community';
/*
Called via  <TrainingList />
The succcess of the api request can be checked in browser console > network > and if "trains" is visible
*/
export default function TrainingList(props) {

    // Training array created
    const [trains, setTrains] = useState([]);
    // Training object
    const [train, setTrain] = useState({date: ''});
    // Grid ref required by AgGrid
    const gridRef = useRef();
    //API data fetched
    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
        .then(response => response.json())
        .then(data => setTrains(data))  
    }
        
    // The API is called. Limited error handling
    useEffect(() => fetchData, []);

    function dateValueGetter(params) {
        if (params.data.date == null) {
            return 'null';
        }
        let date = params.data.date;
        let year = date.substring(0, 4);
        let month = date.substring(5, 7);
        let day = date.substring(8, 10);
        return day + '.' + month + '.' + year;
    }

    function durationValueGetter(params) {
    // If the duration is null then return a string
    if (params.data.duration == null) {
        return 'null';
    }
    let duration = params.data.duration + 0;
    let hours = 0;
    // The hours and minutes calculation
    while (duration >= 60) {
        duration = duration - 60;
        hours++;
    }
    // Adds 0 before string
    if (hours < 10) {
        hours = '0' + hours;
    } 
    // If duration is 0 then make it equal '00'
    if (duration == 0) {
        duration = '00';
    } 
    // Returns values to strings
    hours = hours + '';
    duration = duration + '';
    return hours + ':' + duration;
    }

    function fullNameValueGetter(params) {
    // If the customer is null then return a string
    if (params.data.customer == null) {
        return 'null';
    }
    return params.data.customer.firstname + ' ' + params.data.customer.lastname;
    }

    // Adgrid columns
    const columns = [  
        // dateValueGetter called, which converts data to day.month.year
        { headerName: 'Date', valueGetter: dateValueGetter, sortable: true, filter: true, floatingFilter: true },
        // durationValueGetter called, which converts data to HH:MM 
        { headerName: 'Duration', field: "duration", valueGetter: durationValueGetter, sortable: true, filter: true, floatingFilter: true },
        { field: "activity", sortable: true, filter: true, floatingFilter: true },
        // Full name getter function is called
        { headerName: 'Full Name',
        valueGetter: fullNameValueGetter,
        sortable: true, filter: true, floatingFilter: true }
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
                    rowData={trains}>
                </AgGridReact>
            </div>
        </div>
    );
}