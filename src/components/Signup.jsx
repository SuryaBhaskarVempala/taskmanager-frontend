import React, { useState } from 'react';
import '../css/signup.css'; // Import the CSS file for styling
import { Link,useNavigate } from 'react-router';
import axios from 'axios';


const Signup = () => {
  const [signupData, setSignUpData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate(); 
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({
      ...signupData,
      [name]: value,
    });
    setErrorMessage('')
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form input fields
    if (!signupData.username || !signupData.password) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/signup/',
        signupData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log(response);
      console.log('User data:', signupData);

      if (response.status === 201) {
        localStorage.setItem('token',response.data.token)
        alert('Sucessfully Registered');

        setSignUpData({
          username: '',
          password: '',
        });
        
        navigate('/');
        setErrorMessage('');
      } 
      else {
        setErrorMessage(response.data.message);  // Show the error message sent by the backend
      }
    }
    catch (err) {
      if (err.response && err.response.status === 409) {
        setErrorMessage('Username already exists');
      } else {
        setErrorMessage('Server Error. Please try again later.');
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Signup</h2>
        {errorMessage && <p className="error-box">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Email (Username)</label>
            <input
              type="email"
              id="email"
              name="username"
              value={signupData.username}
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
              value={signupData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
          <div className='signup-footer-data'>
            <h4>You Already Have An Account? <Link to={'/login'}>Login</Link></h4>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
