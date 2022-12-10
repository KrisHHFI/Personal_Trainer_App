import React, { useState, useEffect, useRef } from 'react';
// AgGrid imports
import { AgGridReact } from'ag-grid-react'
import'ag-grid-community/dist/styles/ag-grid.css'
import'ag-grid-community/dist/styles/ag-theme-material.css';
// Imports regarding the date picker and date handling
import 'date-fns'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from'@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { formatISO } from 'date-fns';
/*
Called via  <TrainingList />
The succcess of the api request can be checked in browser console > network > and if "trains" is visible
*/
export default function TrainingList(props) {
    // Training array created
    const [trains, setTrains] = useState([]);
    // Training object
    const [train, setTrain] = useState({});
    // Date declared as seperate variable due to date picker
    // Grid ref required by AgGrid
    const gridRef = useRef();
    //API data fetched
    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
        .then(response => response.json())
        .then(data => setTrains(data))  
    }
    // inputChanged
    const inputChanged = (event) => {
        setTrain({...train, [event.target.name]: event.target.value});
    }

    // Called whenever a new date is set. Formats and sets a new date
    const changeDate = (newDate) => {
        // Needed for the picker to function
        newDate = new Date(newDate);
        setTrain({...train, date: formatISO(newDate)})
    };

    // The API is called.
    useEffect(() => fetchData, []);

    // POST's the training session to the "trainings" API
    const addTraining = (event) => {
        fetch('https://customerrest.herokuapp.com/api/trainings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: train.date,
                duration: train.duration,
                activity: train.activity,
                customer: 'https://customerrest.herokuapp.com/api/customers/' + train.customer
            })
        // If POST successful/or not
        }).then((response) => {
            if (response.ok) {
                alert("Training added");
                fetchData();
            } else {
                alert("Error: check input format.");
            }
        })
    }

    // Delete Customer 
    const deleteTraining = (rowData) => {
        // Identified the selected row, by grid ref number
        if (gridRef.current.getSelectedNodes().length > 0) {
            let text = 'Delete training session?';
            // User must click ok to proceed
            if (window.confirm(text) == false) {
                return;
            } 
            // Gets the customer data from the selected row
            let selectedRow = gridRef.current.getSelectedRows();
            // Gets the unique customer url
            let trainingURL = selectedRow[0].id;
            // The delete method, which uses the customer url
            fetch('https://customerrest.herokuapp.com/api/trainings/' + trainingURL, {
                method:'DELETE'
            })
            // Refreshes the table
            .then(res => fetchData())
            // If a row isn't selected then show alert message
        } else {   
            alert('Select row first'); 
        }
    }

    // Formats the AgGrid dates
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

    // Formats the AgGrid date time
    function timeValueGetter(params) {
        if (params.data.date == null) {
            return 'null';
        }
        let date = params.data.date;
        let time = date.substring(11, 16);
        return time;
    }

    // Formats the AgGrid duration
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
    if (duration > 0 && duration < 10) {
        duration = '0'+ duration;
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
        { headerName: 'Time', valueGetter: timeValueGetter, sortable: true, filter: true, floatingFilter: true },
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
            <fieldset>
                <legend>Add/Delete Training Session</legend>
                {/* The date and time picker input box */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        value={train.date}
                        onChange={selectedDate => changeDate(selectedDate)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                {/* The text input boxes*/}
                <input type="text" onChange={inputChanged} placeholder="Duration (in minutes)" name="duration" value={train.duration}/>
                <input type="text" onChange={inputChanged} placeholder="Activity" name="activity" value={train.activity}/>
                <input type="text" onChange={inputChanged} placeholder="Customer ID (E.G: 699)" name="customer" value={train.customer}/>
                {/* Add button at top of screen */}
                <button onClick={addTraining}>Add</button>
                <button onClick={deleteTraining}>Delete</button>
            </fieldset>
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