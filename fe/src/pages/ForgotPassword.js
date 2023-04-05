import React, { useState } from 'react';
import { apiRequest } from '../utils/apiRequest';

export const ForgotPassword = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    new_password: '',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest.post('/forgot-password', user).then((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else if (res.data.user.role === 'instructor') {
        window.location.href = '/instructor/dashboard';
      } else {
      }
    });
  };

  return (
    <div
      className='min-vh-100 d-flex justify-content-center py-5'
      style={{ backgroundImage: `url('/bg.png')`, backgroundSize: 'cover' }}
    >
      <div className='card w-25 border-0 shadow' style={{ backgroundColor: '#e9f2f9' }}>
        <div className='card-header p-0'>
          <img src='/forgot.webp' className='card-img-top' alt='' />
        </div>
        <div className='card-body'>
          <form onSubmit={onSubmit}>
            <h4 className='card-title text-center my-2'>Buenavista Community College</h4>
            <h5 className='card-title text-center my-2'>Online Grading System</h5>
            <h5 className='card-title text-center my-2'>Forgot Password</h5>
            <div className='mb-3'>
              <h6>Email</h6>
              <input
                type='email'
                className='form-control'
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>Old Password</h6>
              <input
                type='password'
                className='form-control'
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>New Password</h6>
              <input
                type='password'
                className='form-control'
                onChange={(e) => setUser({ ...user, new_password: e.target.value })}
              />
            </div>
            <button type='submit' className='btn btn-primary'>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
