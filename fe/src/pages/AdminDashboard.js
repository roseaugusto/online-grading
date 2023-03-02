import React, { useState, useEffect } from 'react';
import { Page } from '../pages/Page';

export const AdminDashboard = () => {
  const [user, setUser] = useState({});

  const fetchUserData = async () => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return <Page>AdminDashboard</Page>;
};
