import React, { useState } from 'react';
import { apiRequest } from '../utils/apiRequest';

export const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest
      .post('/login', {
        email: user.email,
        password: user.password,
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.user.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else if (res.data.user.role === 'instructor') {
          window.location.href = '/instructor/subjects';
        } else {
          window.location.href = '/student/subjects';
        }
      })
      .catch((e) => alert('Invalid credentials'));
  };

  return (
    <div className='min-vh-100 d-flex justify-content-center py-5 bg-primary'>
      <div className='card w-25 border-0'>
        <div className='card-header p-0'>
          <img
            src='https://www.studysphere.com.au/wp-content/uploads/2017/04/school-79-1024x805.jpg'
            className='card-img-top'
            alt=''
          />
        </div>
        <div className='card-body'>
          <form onSubmit={onSubmit}>
            <h5 className='card-title text-center my-2'>Login</h5>
            <div className='mb-3'>
              <h6>Email</h6>
              <input
                type='email'
                className='form-control'
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>Password</h6>
              <input
                type='password'
                className='form-control'
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            <div className='text-center'>
              <button type='submit' className='btn btn-primary '>
                Login
              </button>
              <br />
              <a href='/forgot-password'>Forgot Password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
