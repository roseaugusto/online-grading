import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, Breadcrumb } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState({
    name: '',
    code: '-',
    schedule: '',
    instructor_id: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [instructors, setInstructors] = useState([]);

  const handleClose = () => {
    setShowModal(false);
  };
  const handleShow = (id) => {
    setShowModal(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (subject.instructor_id) {
      await apiRequest.post('/subjects', subject).then((res) => {
        handleClose();
        fetchData();
      });
    } else {
      alert('choose instructor');
    }
  };

  const fetchData = async () => {
    await apiRequest.get('/subjects').then((res) => {
      setSubjects(res.data || []);
    });

    await apiRequest.get('/users/instructor').then((res) => {
      let data = [];
      if (res.data.length > 0) {
        data = res.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      }
      setInstructors(data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Page title='Subjects'>
      <Breadcrumb>
        <Breadcrumb.Item href='/admin/dashboard'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Subjects</Breadcrumb.Item>
      </Breadcrumb>
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
                  <a href={`/subjects/${subject.id}`}>
                    <button className='btn btn-primary'>See Enrolless</button>
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Modal show={showModal} onHide={handleClose}>
        <form onSubmit={onSubmit}>
          <Modal.Header className='bg-primary text-white'>
            <Modal.Title>Subject Registration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              <h6>Name</h6>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setSubject({ ...subject, name: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>Schedule</h6>
              <input
                type='text'
                className='form-control'
                placeholder='MWF (9:00AM - 10:00AM)'
                onChange={(e) => setSubject({ ...subject, schedule: e.target.value })}
                required
              />
            </div>
            <div className='mb-3'>
              <h6>Instructors Name</h6>
              <select
                className='form-control'
                name='instructors'
                onChange={(e) => setSubject({ ...subject, instructor_id: e.target.value })}
                required
              >
                <option value={null}>Choose Instructor</option>
                {instructors.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
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
    </Page>
  );
};
