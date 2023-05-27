import React, { useState, useEffect } from 'react';
import { Page } from '../pages/Page';
import './css/page.css';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faChalkboardTeacher,
  faFileClipboard,
  faBook,
} from '@fortawesome/free-solid-svg-icons';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const AdminDashboard = () => {
  const [user, setUser] = useState({});
  const [sub, setSub] = useState([]);
  const [det, setDet] = useState([]);

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
    const prelimData = sub.map((item) => item.students_sum_prelim);
    const midtermData = sub.map((item) => item.students_sum_midterm);
    const semiFinalsData = sub.map((item) => item.students_sum_semi_finals);
    const finalsData = sub.map((item) => item.students_sum_finals);
    if (type === 'finals') {
      return finalsData;
    } else if (type === 'prelim') {
      return prelimData;
    } else if (type === 'semi_finals') {
      return semiFinalsData;
    }
    return midtermData;
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Prelims',
        data: getData('prelim'),
        backgroundColor: '#0FC533',
      },
      {
        label: 'Midterms',
        data: getData(),
        backgroundColor: '#ef5350',
      },
      {
        label: 'Semi-Finals',
        data: getData('semi_finals'),
        backgroundColor: '#806188',
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

    await apiRequest.get(`/show-details`).then((res) => {
      setDet(res.data);
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
      <div className='container mb-5'>
        <div className='row'>
          <div className='col-md-3'>
            <div className='card-counter primary'>
              <FontAwesomeIcon icon={faBook} size='4x' />
              <span className='count-numbers'>{det?.subjects}</span>
              <span className='count-name'>Subjects</span>
            </div>
          </div>

          <div className='col-md-3'>
            <div className='card-counter danger'>
              <FontAwesomeIcon icon={faFileClipboard} size='4x' />
              <span className='count-numbers'>{det?.class}</span>
              <span className='count-name'>Total Classes</span>
            </div>
          </div>

          <div className='col-md-3'>
            <div className='card-counter success'>
              <FontAwesomeIcon icon={faChalkboardTeacher} size='4x' />
              <span className='count-numbers'>{det?.instructors}</span>
              <span className='count-name'>Instructors</span>
            </div>
          </div>

          <div className='col-md-3'>
            <div className='card-counter info'>
              <FontAwesomeIcon icon={faUserGraduate} size='4x' />
              <span className='count-numbers'>{det?.students}</span>
              <span className='count-name'>Students</span>
            </div>
          </div>
        </div>
      </div>
      <br />
      <Bar options={options} data={data} />
    </Page>
  );
};
