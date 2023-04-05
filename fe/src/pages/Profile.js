import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { apiRequest } from '../utils/apiRequest';
import { Breadcrumb, Card, Button } from 'react-bootstrap';

export const Profile = () => {
  const [user, setUser] = useState({});
  const [uname, setName] = useState('');

  const fetchData = async () => {
    await apiRequest.get(`/user/profile`).then((res) => {
      setUser(res.data);
      setName(res.data.name);
    });
  };

  const fetchUserData = async () => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest.patch('/user', user).then((res) => {
      fetchData();
    });
  };

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);
  return (
    <Page title='Profile'>
      <Breadcrumb>
        <Breadcrumb.Item href='/admin/dashboard'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Profile</Breadcrumb.Item>
      </Breadcrumb>
      <div className='d-flex justify-content-between align-items-start'>
        <Card className='mr-5 text-center shadow' style={{ width: '25rem' }}>
          <Card.Img
            variant='top'
            src={
              user.role === 'student'
                ? '/student-profile.jpeg'
                : user.role === 'admin'
                ? '/admin.jpeg'
                : '/instructor.jpeg'
            }
          />
          <Card.Body>
            <Card.Title>{uname}</Card.Title>
            <Card.Text>
              {user.role?.toUpperCase()} {user.role === 'student' ? `| ${user.course}` : ''}
              <br />
              {user.email}
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className='w-100 shadow'>
          <Card.Body>
            <Card.Title>Info</Card.Title>
            <form onSubmit={onSubmit}>
              <div className='mb-3'>
                <h6>Name</h6>
                <input
                  type='text'
                  className='form-control'
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  value={user.name}
                />
              </div>
              <div className='mb-3'>
                <h6>Contact</h6>
                <input
                  type='text'
                  className='form-control'
                  maxLength='11'
                  pattern='^[0-9,]*$'
                  onChange={(e) => setUser({ ...user, contact: e.target.value })}
                  value={user.contact}
                />
              </div>
              <div className='mb-3'>
                <h6>Address</h6>
                <textarea
                  className='form-control'
                  onChange={(e) => setUser({ ...user, address: e.target.value })}
                  value={user.address}
                />
              </div>
              <div className='mb-3'>
                <h6>Birthdate</h6>
                <input
                  type='date'
                  className='form-control'
                  onChange={(e) => setUser({ ...user, birthdate: e.target.value })}
                  value={user.birthdate}
                />
              </div>
              {user.role === 'instructor' ? (
                <>
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
                </>
              ) : null}
              <Button variant='primary' type='submit'>
                Update Profile
              </Button>
            </form>
          </Card.Body>
        </Card>
      </div>
    </Page>
  );
};
