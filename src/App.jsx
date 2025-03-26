import React from 'react'
import './css/App.css';
import Form from './components/Form';
import { FormContextProvider } from './context/FormContext';
import Home from './components/Home';
import Signup from './components/Signup';
import DeviceCheckBox from './components/DeviceCheckBox';

function App() {
  return (
    <>
      <FormContextProvider>
        <Home />
        <Form />
        <DeviceCheckBox />
      </FormContextProvider>
    </>
  );
}

export default App;