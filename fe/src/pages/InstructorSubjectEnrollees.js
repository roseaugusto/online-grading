import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { apiRequest } from '../utils/apiRequest';
import { useParams } from 'react-router-dom';

export const InstructorSubjectEnrollees = () => {
  const { id } = useParams();

  const [students, setStudents] = useState([]);

  const fetchData = async () => {
    await apiRequest.get(`/subjects/${id}`).then((res) => {
      setStudents(res.data[0].students || []);
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
            <th scope='col'>Student</th>
            <th scope='col'>Midterms</th>
            <th scope='col'>Finals</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan='7'>No student/s found.</td>
            </tr>
          ) : (
            students.map((key, index) => (
              <tr key={index}>
                <th scope='row'>{key.user.id}</th>
                <td>{key.user.name}</td>
                <td>{key?.midterm || `-`}</td>
                <td>{key?.finals || `-`}</td>
                <td>
                  <button className='btn btn-primary'>Grade Student</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Page>
  );
};
