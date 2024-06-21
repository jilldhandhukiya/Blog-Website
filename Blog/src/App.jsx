import React, { useContext } from 'react';
import {Route, Navigate, Routes } from 'react-router-dom';
import { AuthContext } from './Components/Routes/AuthContext';
import BlogHome from './Components/BlogHome/BlogHome';
import BlogLogin from './Components/BlogLogin/BlogLogin';
import ErrorPage from './Components/ErrorPage/Error';
import ProtectedRoute from './Components/Routes/ProtectedRoute';
import BlogEdit from "./Components/BlogEdit/BlogEdit"

const App = () => {
    const { auth } = useContext(AuthContext);
    
    return (
      <div className="App">
        <Routes>
          <Route path="/login" element={auth ? <Navigate to="/" /> : <BlogLogin />} />
          <Route path="/" element={<ProtectedRoute component={BlogHome} />} />
          <Route path="/UploadBlog" element={<ProtectedRoute component={BlogEdit} />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    );
  };
  
  export default App;