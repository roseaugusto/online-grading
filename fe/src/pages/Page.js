import React, { useState, useEffect } from 'react';
import './css/page.css';
import { Sidebar } from './Sidebar';

export const Page = ({ children }) => {
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
    <main class='d-flex flex-nowrap'>
      <Sidebar role={user.role} />
      <div class='b-example-vr bg-main flex-grow-1 p-5'>{children}</div>
    </main>
  );
};
