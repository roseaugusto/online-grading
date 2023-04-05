import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { apiRequest } from '../utils/apiRequest';
import Select from 'react-select';
import { Breadcrumb } from 'react-bootstrap';

export const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [user, setUser] = useState({});
  const [keyword, setKeyword] = useState(null);

  const optionsYear = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
  ];
  const [selectedYear, setSelectedYear] = useState(null);
  const handleYearChange = (option) => {
    setSelectedYear(option);
  };

  const fetchData = async () => {
    const params = new URLSearchParams({
      keyword,
      year: selectedYear ? selectedYear.value : null,
    });
    await apiRequest.get(`/grades?${params.toString()}`).then((res) => {
      setGrades(res.data || []);
    });
  };

  const fetchUserData = async () => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
  };

  const gradeFormat = (grade) => {
    if (grade) {
      if (grade <= 0) {
        return 'DROPPED';
      } else {
        return parseFloat(grade).toFixed(1);
      }
    }
    return '-';
  };

  const submitFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);

  return (
    <Page title='Grades'>
      <Breadcrumb>
        <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Grades</Breadcrumb.Item>
      </Breadcrumb>
      <form className='d-flex justify-content-between mb-3' onSubmit={submitFilter}>
        <div className='d-flex w-100 align-items-center'>
          <input
            type='text'
            className='form-control mr-2'
            placeholder='search'
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
        </div>
        <div className='d-flex justify-content-between w-100 align-items-center mr-3'>
          <Select
            className='w-100'
            value={selectedYear}
            onChange={handleYearChange}
            options={optionsYear}
            placeholder='Filter by year'
          />
        </div>
        <div className='d-flex w-100'>
          {' '}
          <button className='btn btn-success mr-2' type='submit'>
            Search
          </button>
          <a href={`/user/tor/${user.id}`} target='_blank' rel='noreferrer'>
            <button className='btn btn-warning' type='button'>
              Generate TOR
            </button>
          </a>
        </div>
      </form>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>ID</th>
            <th scope='col'>Subject</th>
            <th scope='col'>Instructor</th>
            <th scope='col'>Year</th>
            <th scope='col'>School Year</th>
            <th scope='col'>Midterms</th>
            <th scope='col'>Finals</th>
          </tr>
        </thead>
        <tbody>
          {grades.length === 0 ? (
            <tr>
              <td colSpan='7'>No subject/s found.</td>
            </tr>
          ) : (
            grades.map((grade, index) => (
              <tr key={index}>
                <th scope='row'>{grade.id}</th>
                <td>{grade.subject.name}</td>
                <td>{grade.subject.instructor.name}</td>
                <td>{grade.year}</td>
                <td>{grade.school_year}</td>
                <td>{gradeFormat(grade.midterm)}</td>
                <td>{gradeFormat(grade.finals)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Page>
  );
};
