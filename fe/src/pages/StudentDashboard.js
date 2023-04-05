import React, { useState, useEffect } from 'react';
import { Page } from './Page';
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
import DatePicker from 'react-datepicker';
import { DateTime } from 'luxon';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const StudentDashboard = () => {
  const [user, setUser] = useState({});
  const [sub, setSub] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'My Grades Based on Subject and Year',
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

  const labels = Object.keys(sub);

  const getData = (type = 'midterms') => {
    const midtermData = Object.keys(sub).map((item) => sub[item].map((key) => key.midterm));
    const finalsData = Object.keys(sub).map((item) => sub[item].map((key) => key.finals));
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
        backgroundColor: '#ef5350',
      },
      {
        label: 'Finals',
        data: getData('finals'),
        backgroundColor: '#047bfe',
      },
    ],
  };

  const fetchData = async () => {
    const params = new URLSearchParams({
      year: startDate ? DateTime.fromJSDate(startDate).year : null,
    });
    await apiRequest.get(`/show-graph?${params.toString()}`).then((res) => {
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
      <div className='d-flex align-items-center justify-content-start'>
        <b>Year Picker</b>
        <div>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showYearPicker
            dateFormat='yyyy'
            className='p-1 border rounded mx-2'
            yearItemNumber={4}
          />
        </div>
        <button className='btn btn-success' onClick={() => fetchData()}>
          Submit
        </button>
      </div>
      <Bar options={options} data={data} />
    </Page>
  );
};
