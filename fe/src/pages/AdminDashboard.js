import React, { useState, useEffect } from 'react';
import { Page } from '../pages/Page';
import { apiRequest } from '../utils/apiRequest';
import { Breadcrumb } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const AdminDashboard = () => {
  const [user, setUser] = useState({});
  const [sub, setSub] = useState([]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Student Grades Based on Subject',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Grades',
        },
        max: 5.0,
        min: 0,
      },
      x: {
        title: {
          display: true,
          text: 'Subjects',
        },
      },
    },
  };

  const labels = sub.map((item) => item.name);

  const getData = (type = 'midterms') => {
    const midtermData = sub.map((item) => item.students_sum_midterm);
    const finalsData = sub.map((item) => item.students_sum_finals);
    if (type === 'finals') {
      return finalsData;
    }
    return midtermData;
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Midterms',
        data: getData(),
        backgroundColor: '#f74358',
      },
      {
        label: 'Finals',
        data: getData('finals'),
        backgroundColor: '#047bfe',
      },
    ],
  };

  const fetchData = async () => {
    await apiRequest.get(`/show-graph`).then((res) => {
      setSub(res.data);
    });
  };

  const fetchUserData = async () => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
  };

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);
  return (
    <Page title='Dashboard'>
      <Breadcrumb>
        <Breadcrumb.Item href='/admin/dashboard'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <Bar options={options} data={data} />
    </Page>
  );
};
