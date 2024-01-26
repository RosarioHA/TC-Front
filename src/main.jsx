import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthProvider';
import { FormProvider } from './context/FormAlert.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <FormProvider>
        <App/>
      </FormProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
