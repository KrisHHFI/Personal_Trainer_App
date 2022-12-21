import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import 'date-fns'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { formatISO } from 'date-fns';

export default function TrainingList(props) {
    const [trains, setTrains] = useState([]);
    const [train, setTrain] = useState({});
    const gridRef = useRef();
    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
            .then(response => response.json())
            .then(data => setTrains(data))
    }
    const inputChanged = (event) => {
        setTrain({ ...train, [event.target.name]: event.target.value });
    }
    const changeDate = (newDate) => {
        newDate = new Date(newDate);
        setTrain({ ...train, date: formatISO(newDate) })
    };

    useEffect(() => fetchData, []);

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
        }).then((response) => {
            if (response.ok) {
                alert("Training added");
                fetchData();
            } else {
                alert("Error: check input format.");
            }
        })
    }

    const deleteTraining = (rowData) => {
        if (gridRef.current.getSelectedNodes().length > 0) {
            let text = 'Delete training session?';
            if (window.confirm(text) == false) {
                return;
            }
            let selectedRow = gridRef.current.getSelectedRows();
            let trainingURL = selectedRow[0].id;
            fetch('https://customerrest.herokuapp.com/api/trainings/' + trainingURL, {
                method: 'DELETE'
            })
                .then(res => fetchData())
        } else {
            alert('Select row first');
        }
    }

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

    function timeValueGetter(params) {
        if (params.data.date == null) {
            return 'null';
        }
        let date = params.data.date;
        let time = date.substring(11, 16);
        return time;
    }

    function durationValueGetter(params) {
        if (params.data.duration == null) {
            return 'null';
        }
        let duration = params.data.duration + 0;
        let hours = 0;
        while (duration >= 60) {
            duration = duration - 60;
            hours++;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (duration == 0) {
            duration = '00';
        }
        if (duration > 0 && duration < 10) {
            duration = '0' + duration;
        }
        hours = hours + '';
        duration = duration + '';
        return hours + ':' + duration;
    }

    function fullNameValueGetter(params) {
        if (params.data.customer == null) {
            return 'null';
        }
        return params.data.customer.firstname + ' ' + params.data.customer.lastname;
    }

    const columns = [
        { headerName: 'Date', valueGetter: dateValueGetter, sortable: true, filter: true, floatingFilter: true },
        { headerName: 'Time', valueGetter: timeValueGetter, sortable: true, filter: true, floatingFilter: true },
        { headerName: 'Duration', field: "duration", valueGetter: durationValueGetter, sortable: true, filter: true, floatingFilter: true },
        { field: "activity", sortable: true, filter: true, floatingFilter: true },
        {
            headerName: 'Full Name',
            valueGetter: fullNameValueGetter,
            sortable: true, filter: true, floatingFilter: true
        }
    ]

    return (
        <div>
            <fieldset>
                <legend>Add/Delete Training Session</legend>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        value={train.date}
                        onChange={selectedDate => changeDate(selectedDate)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <input type="text" onChange={inputChanged} placeholder="Duration (in minutes)" name="duration" value={train.duration} />
                <input type="text" onChange={inputChanged} placeholder="Activity" name="activity" value={train.activity} />
                <input type="text" onChange={inputChanged} placeholder="Customer ID (E.G: 699)" name="customer" value={train.customer} />
                <button onClick={addTraining}>Add</button>
                <button onClick={deleteTraining}>Delete</button>
            </fieldset>
            <div className="ag-theme-material"
                style={{ height: '700px', width: '70%', margin: 'auto' }} >
                <AgGridReact
                    ref={gridRef}
                    onGridReady={params => gridRef.current = params.api}
                    rowSelection="single"
                    columnDefs={columns}
                    animateRows={true}
                    rowData={trains}>
                </AgGridReact>
            </div>
        </div>
    );
}