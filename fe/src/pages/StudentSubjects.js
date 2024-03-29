import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { apiRequest } from '../utils/apiRequest';
import { OverlayTrigger, Tooltip, Breadcrumb, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [keyword, setKeyword] = useState('');

  const fetchData = async () => {
    const urlSearchParams = new URLSearchParams();
    if (keyword !== '') {
      urlSearchParams.append('keyword', keyword);
    }
    await apiRequest.get(`/subjects?${urlSearchParams.toString()}`).then((res) => {
      setSubjects(res.data || []);
    });
  };

  const submitFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Page title='Subjects'>
      <Breadcrumb>
        <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Subject</Breadcrumb.Item>
      </Breadcrumb>
      <div className='d-flex justify-content-between align-items-center'>
        <form className='d-flex w-100' onSubmit={submitFilter}>
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
      </div>
      <br />
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>ID</th>
            <th scope='col'>Name</th>
            <th scope='col'>Instructor</th>
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
                <td>
                  {' '}
                  <OverlayTrigger
                    trigger='focus'
                    placement='left'
                    overlay={
                      <Tooltip id={`tooltip-${index}`}>
                        <span>Social Links</span>
                        <br />
                        {subject.instructor.fb ? (
                          <a
                            href={`https://${subject.instructor.fb}`}
                            className='mr-2'
                            target='_blank'
                            rel='noreferrer'
                          >
                            <img src='/facebook.png' alt='...' width={15} />
                          </a>
                        ) : null}
                        {subject.instructor.instagram ? (
                          <a
                            href={`https://${subject.instructor.instagram}`}
                            className='mr-2'
                            target='_blank'
                            rel='noreferrer'
                          >
                            <img src='/instagram.png' alt='...' width={15} />
                          </a>
                        ) : null}
                        {subject.instructor.twitter ? (
                          <a
                            href={`https://${subject.instructor.twitter}`}
                            className='mr-2'
                            target='_blank'
                            rel='noreferrer'
                          >
                            <img src='/twitter.png' alt='...' width={15} />
                          </a>
                        ) : null}
                        <br />
                        {subject.instructor.other_social_link ? (
                          <span>Others: {subject.instructor.other_social_link}</span>
                        ) : null}
                      </Tooltip>
                    }
                  >
                    <button className='btn p-0'>{subject.instructor.name}</button>
                  </OverlayTrigger>
                </td>
                <td>{subject.schedule}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Page>
  );
};
