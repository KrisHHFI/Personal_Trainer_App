import './App.css';
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function App() {
  const [value, setValue] = useState('one');
  const handleChange = (event, value) => {
    setValue(value);
  };

  return (
    <div className="App">
      <div>
        <Tabs value={value} onChange={handleChange}>
          <Tab style={{ background: '#326ba8', color: 'white' }} value="three" label="Personal Trainer App" disabled />
          <Tab value="one" label="Customer List" />
          <Tab value="two" label="Training List" />
        </Tabs>
        {value === 'one' &&
          <div>
            <CustomerList />
          </div>
        }
        {value === 'two' &&
          <div>
            <TrainingList />
          </div>}
      </div>
    </div>
  );
}

export default App;