import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { apiRequest } from '../utils/apiRequest';

export const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);

  const fetchData = async () => {
    await apiRequest.get('/subjects').then((res) => {
      setSubjects(res.data || []);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Page>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>ID</th>
            <th scope='col'>Name</th>
            <th scope='col'>Instructor</th>
            <th scope='col'>Schedule</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length === 0 ? (
            <tr>
              <td colSpan='7'>No subject/s found.</td>
            </tr>
          ) : (
            subjects.map((subject, index) => (
              <tr key={index}>
                <th scope='row'>{subject.id}</th>
                <td>{subject.name}</td>
                <td>{subject.instructor.name}</td>
                <td>{subject.schedule}</td>
                <td>
                  <button className='btn btn-primary'>See Grades</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Page>
  );
};
