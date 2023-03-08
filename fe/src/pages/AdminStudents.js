import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';
import Select from 'react-select';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'student',
    course: null,
  });

  const [enrollment, setEnrollment] = useState({
    year: '',
    school_year: '',
    subject_id: '',
    user_id: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleCloseSubject = () => setShowSubjectModal(false);
  const handleShowSubject = (id) => {
    setEnrollment({ ...enrollment, user_id: id });
    setShowSubjectModal(true);
  };

  const options = [
    { value: 'BSIT', label: 'BSIT' },
    { value: 'BSCRIM', label: 'BSCRIM' },
    { value: 'BSHRM', label: 'BSHRM' },
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  const handleChange = (option) => {
    setSelectedOption(option);
    setUser({ ...user, course: option.value });
  };

  const onEnrollmentSubmit = async (e) => {
    e.preventDefault();
    await apiRequest.post('/grades', enrollment).then((res) => {
      handleCloseSubject();
      fetchData();
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest.post('/register', user).then((res) => {
      handleClose();
      fetchData();
    });
  };

  const fetchData = async () => {
    await apiRequest.get('/users/student').then((res) => {
      setStudents(res.data || []);
    });

    await apiRequest.get('/subjects').then((res) => {
      let data = [];
      if (res.data.length > 0) {
        data = res.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      }
      setSubjects(data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Page>
      <FontAwesomeIcon
        icon={faPlus}
        className='mr-2 btn btn-primary float-right mb-3'
        onClick={() => {
          handleShow();
        }}
      />
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>ID</th>
            <th scope='col'>Name</th>
            <th scope='col'>Email</th>
            <th scope='col'>Course</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan='7'>No student/s found.</td>
            </tr>
          ) : (
            students.map((student, index) => (
              <tr key={index}>
                <th scope='row'>{student.id}</th>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>
                  <button className='btn btn-success' onClick={() => handleShowSubject(student.id)}>
                    Enroll Student
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Modal show={showModal} onHide={handleClose}>
        <form onSubmit={onSubmit}>
          <Modal.Header className='bg-primary text-white'>
            <Modal.Title>Student Registration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              <h6>Name</h6>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>Email</h6>
              <input
                type='email'
                className='form-control'
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>Course</h6>
              <Select value={selectedOption} onChange={handleChange} options={options} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            <Button variant='primary' type='submit'>
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal show={showSubjectModal} onHide={handleCloseSubject}>
        <form onSubmit={onEnrollmentSubmit}>
          <Modal.Header className='bg-primary text-white'>
            <Modal.Title>Subject Enrollment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              <h6>Year</h6>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setEnrollment({ ...enrollment, year: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>School Year</h6>
              <input
                type='text'
                className='form-control'
                placeholder='2022-2023'
                onChange={(e) => setEnrollment({ ...enrollment, school_year: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>Subject</h6>
              <select
                className='form-control'
                name='instructors'
                onChange={(e) => setEnrollment({ ...enrollment, subject_id: e.target.value })}
              >
                <option value={null}>Choose Subject</option>
                {subjects.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseSubject}>
              Close
            </Button>
            <Button variant='primary' type='submit'>
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Page>
  );
};
