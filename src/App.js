import './App.css';
// The components in use
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
// Navigation bar imports
import React, { useState } from'react';
import Tabs from'@mui/material/Tabs';
import Tab from'@mui/material/Tab';
/*
---- App created ----
cd C:\Users\krist>cd C:\Users\krist\Desktop\Haaga-Helia\Front End Programming
npx create-react-app personal_trainer_app_t1

---- App launched ----
cd "C:\Users\krist\Desktop\Haaga-Helia\Front End Programming\personal_trainer_app_t1"
npm start

---- Installs ---- App bar, ag-grid, App Bar (NavigationBar)
cd "C:\Users\krist\Desktop\Haaga-Helia\Front End Programming\personal_trainer_app_t1"
npm install @mui/material @emotion/react @emotion/styled
npm install ag-grid-community ag-grid-react
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-router-dom@6
*/
function App() {
  // Navigation bar variables
  const [value, setValue] = useState('one');
  const handleChange = (event, value) => {  
      setValue(value);
  };

  return (
    <div className="App">
      {/* Navigation bar. CustomerList and TrainingLists called to screen */}
      <div>
        <Tabs value={value}onChange={handleChange}>
          <Tab style={{background: '#326ba8', color: 'white'}} value="three" label="Personal Trainer App" disabled />
          <Tab value="one"label="Customer List" />
          <Tab value="two"label="Training List" />
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