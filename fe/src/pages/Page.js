import React, { useState, useEffect } from 'react';
import './css/page.css';
import { Sidebar } from './Sidebar';

export const Page = ({ children, title = '', subTitle = '' }) => {
  const [user, setUser] = useState({});

  const fetchUserData = async () => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    } else {
      setUser(JSON.parse(localStorage.getItem('user') || {}));
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <main className='d-flex flex-nowrap'>
      <Sidebar user={user} />
      <div className='b-example-vr bg-main flex-grow-1 p-5'>
        <div className='d-flex justify-content-between align-items-center'>
          <h4>{title}</h4>
          <h6>{subTitle}</h6>
        </div>
        {children}
      </div>
    </main>
  );
};
