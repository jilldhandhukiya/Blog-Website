import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ErrorPage = () => {
  const [time, setTime] = useState(5);
  const [redirect, Doredirect] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 1) {
          clearInterval(interval);
          Doredirect(true)
        }
        return prevTime - 1;
      });
    }, 1000); // 1 second interval

    return () => clearInterval(interval); 
  }, [redirect]);


  if(redirect) return <Navigate to={"/"} />
  
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>You will be redirected to the home page in {time} seconds.</p>
    </div>
  );
};

export default ErrorPage;
