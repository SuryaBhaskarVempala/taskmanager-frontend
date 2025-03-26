import { StrictMode, useState, useEffect, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';  // Import Navigate
import App from './App.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import axios from 'axios';
import { userContext, UserContextProvider } from './context/userContext.jsx';
import DeviceCheckBox from './components/DeviceCheckBox.jsx';


const PrivateRoute = ({ children }) => {

  const [isValidToken, setIsValidToken] = useState(null);
  const { setUser } = useContext(userContext);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.post('http://localhost:3000/auth/', { token });
          setUser(response.data.user);
          setIsValidToken(response.data.valid);
        } catch (err) {
          console.log(err);
          setUser(null);
          setIsValidToken(false);
        }
      } else {
        setUser(null);
        setIsValidToken(false);
      }
    };

    checkToken();
  }, [setUser]); 

  if (isValidToken === null) {
    return <div>Loading...</div>; 
  }

  if (!isValidToken) {
    return <Navigate to="/login" />; 
  }

  return children; 
};


const router = createBrowserRouter([

  {
    path: '/',
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
  },
  {
    path: '/login',
    element: <><DeviceCheckBox /><Login /></>,
  },
  {
    path: '/signup',
    element: <><DeviceCheckBox /><Signup /></>,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </StrictMode>
);
