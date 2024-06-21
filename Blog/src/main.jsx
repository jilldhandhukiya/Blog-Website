import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './Components/Routes/AuthContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <Router>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Router>
</React.StrictMode>
);


