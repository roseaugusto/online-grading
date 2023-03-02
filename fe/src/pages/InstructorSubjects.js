import React, { useState, useEffect } from 'react';
import { Page } from './Page';

export const InstructorSubjects = () => {
  const [user, setUser] = useState({});

  const fetchUserData = async () => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return <Page>InstructorSubjects</Page>;
};
