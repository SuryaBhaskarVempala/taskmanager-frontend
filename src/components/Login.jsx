import React, { useState } from 'react';
import '../css/signup.css'; // Import the CSS file for styling
import axios from 'axios';
import { Link, NavLink, useNavigate } from 'react-router';

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
    setErrorMessage('')
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form input fields
    if (!loginData.username || !loginData.password) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/login/',
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log(response);
      console.log('User data:', loginData);

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token)
        alert('Login Sucessfully');
        navigate('/');
        setLoginData({
          username:'',
          password:''
        })
        setErrorMessage('');
      }

      else {
        setErrorMessage(response.data.message);  // Show the error message sent by the backend
      }
    }
    catch (err) {
      console.log(err);
      setErrorMessage('Server Error. Please try again later.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Login</h2>
        {errorMessage && <p className="error-box">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Email (Username)</label>
            <input
              type="email"
              id="email"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="signup-button">
            Login
          </button>
          <div className='signup-footer-data'>
            <h4>You Don't Have An Account? <Link to={"/signup"}>SignUp</Link></h4>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
