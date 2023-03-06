import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const AdminGrades = () => {
  const [instructors, setInstructors] = useState([]);

  const fetchData = async () => {
    await apiRequest.get('/users/instructor').then((res) => {
      setInstructors(res.data || []);
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
            <th scope='col'>Subject</th>
            <th scope='col'>Instructor</th>
            <th scope='col'>Student</th>
            <th scope='col'>Year</th>
            <th scope='col'>School Year</th>
            <th scope='col'>Midterms</th>
            <th scope='col'>Finals</th>
          </tr>
        </thead>
        <tbody>
          {instructors.length === 0 ? (
            <tr>
              <td colSpan='7'>No instructor/s found.</td>
            </tr>
          ) : (
            instructors.map((instructor, index) => (
              <tr key={index}>
                <th scope='row'>{instructor.id}</th>
                <td>{instructor.name}</td>
                <td>{instructor.email}</td>
                <td>
                  <a href={instructor.fb}>{instructor.fb}</a>
                </td>
                <td>
                  <a href={instructor.instagram}>{instructor.instagram}</a>
                </td>
                <td>
                  <a href={instructor.twitter}>{instructor.twitter}</a>
                </td>
                <td>
                  <a href={instructor.other_social_link}>{instructor.other_social_link}</a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Page>
  );
};
