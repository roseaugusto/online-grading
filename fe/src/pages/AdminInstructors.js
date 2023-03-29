import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';
import { Breadcrumb } from 'react-bootstrap';

export const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'instructor',
    fb: '',
    instagram: '',
    twitter: '',
    other_social_link: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [keyword, setKeyword] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const fetchData = async () => {
    const urlSearchParams = new URLSearchParams();
    if (keyword !== '') {
      urlSearchParams.append('keyword', keyword);
    }
    await apiRequest.get(`/users/instructor?${urlSearchParams.toString()}`).then((res) => {
      setInstructors(res.data || []);
    });
  };

  const submitFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest.post('/register', user).then((res) => {
      handleClose();
      fetchData();
    });
  };

  return (
    <Page title='Instructors'>
      <Breadcrumb>
        <Breadcrumb.Item href='/admin/dashboard'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Instructors</Breadcrumb.Item>
      </Breadcrumb>
      <div className='d-flex justify-content-between align-items-center'>
        <form className='d-flex w-75' onSubmit={submitFilter}>
          <input
            type='text'
            className='form-control mr-3'
            placeholder='Type keyword'
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
          <Button variant='primary' type='submit'>
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </form>
        <div className='w-25 text-right'>
          {' '}
          <FontAwesomeIcon
            icon={faPlus}
            className='btn btn-primary'
            onClick={() => {
              handleShow();
            }}
          />
        </div>
      </div>
      <br />
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>ID</th>
            <th scope='col'>Name</th>
            <th scope='col'>Email</th>
            <th scope='col'>FB</th>
            <th scope='col'>Instagram</th>
            <th scope='col'>Twitter</th>
            <th scope='col'>Others</th>
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
                  {instructor?.fb ? <a href={`https://${instructor.fb}`}>{instructor.fb}</a> : '-'}
                </td>
                <td>
                  {instructor?.instagram ? (
                    <a href={`https://${instructor.instagram}`}>{instructor.instagram}</a>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {instructor?.twitter ? (
                    <a href={`https://${instructor.twitter}`}>{instructor.twitter}</a>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {instructor?.other_social_link ? (
                    <a href={`https://${instructor.other_social_link}`}>
                      {instructor.other_social_link}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Modal show={showModal} onHide={handleClose}>
        <form onSubmit={onSubmit}>
          <Modal.Header className='bg-primary text-white'>
            <Modal.Title>Instructor Registration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              <h6>Name</h6>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
            </div>
            <div className='mb-3'>
              <h6>Email</h6>
              <input
                type='email'
                className='form-control'
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </div>
            <div className='mb-3'>
              <h6>
                FB Link <i>(optional)</i>
              </h6>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setUser({ ...user, fb: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>
                Instagram Link <i>(optional)</i>
              </h6>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setUser({ ...user, instagram: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>
                Twitter Link <i>(optional)</i>
              </h6>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setUser({ ...user, twitter: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>
                Other social Link <i>(optional)</i>
              </h6>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setUser({ ...user, other_social_link: e.target.value })}
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
