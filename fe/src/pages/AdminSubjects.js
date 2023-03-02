import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState({
    name: '',
    code: '',
    schedule: '',
  });
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest.post('/subjects', subject).then((res) => {
      alert('Successfully Registered');
      handleClose();
      fetchData();
    });
  };

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
            <th scope='col'>Code</th>
            <th scope='col'>Schedule</th>
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
                <td>{subject.code}</td>
                <td>{subject.schedule}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Modal show={showModal} onHide={handleClose}>
        <form onSubmit={onSubmit}>
          <Modal.Header>
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
              <h6>Code</h6>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setSubject({ ...subject, code: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>Schedule</h6>
              <input
                type='text'
                className='form-control'
                placeholder='MWF (9:00AM - 10:00AM)'
                onChange={(e) => setSubject({ ...subject, schedule: e.target.value })}
              />
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
