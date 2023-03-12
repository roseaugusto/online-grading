import React, { useState } from 'react';
import { apiRequest } from '../utils/apiRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

export const Sidebar = ({ user = {} }) => {
  const loc = useLocation();
  const logout = async () => {
    await apiRequest.post('logout', {}).then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
  };
  return (
    <>
      <div
        className={`d-flex flex-column flex-shrink-0 sidebar d-none d-lg-block border shadow`}
        style={{ width: '320px' }}
      >
        <div className='border-bottom border-2 py-4 text-center mb-2 bg-primary text-white'>
          <h5>Online Grading | {user.role?.toUpperCase()}</h5>
          <h6>
            {' '}
            <FontAwesomeIcon icon={faUser} className='mr-2' />
            {user.name}
          </h6>
        </div>
        <ul className='nav nav-pills flex-column mb-auto px-3'>
          {user?.role === 'admin' && (
            <>
              <li
                className={loc.pathname === '/admin/dashboard' ? 'rounded bg-primary' : 'bg-white'}
              >
                <a
                  href='/admin/dashboard'
                  className={`nav-link ${loc.pathname === '/admin/dashboard' && 'text-white'}`}
                >
                  Dashboard
                </a>
              </li>
              <li
                className={loc.pathname === '/admin/intructors' ? 'rounded bg-primary' : 'bg-white'}
              >
                <a
                  href='/admin/intructors'
                  className={`nav-link ${loc.pathname === '/admin/intructors' && 'text-white'}`}
                >
                  Instructors
                </a>
              </li>
              <li
                className={loc.pathname === '/admin/students' ? 'rounded bg-primary' : 'bg-white'}
              >
                <a
                  href='/admin/students'
                  className={`nav-link ${loc.pathname === '/admin/students' && 'text-white'}`}
                >
                  Students
                </a>
              </li>
              <li
                className={loc.pathname === '/admin/subjects' ? 'rounded bg-primary' : 'bg-white'}
              >
                <a
                  href='/admin/subjects'
                  className={`nav-link ${loc.pathname === '/admin/subjects' && 'text-white'}`}
                >
                  Subjects
                </a>
              </li>
              {/* <li className={loc.pathname === '/admin/grades' ? 'rounded bg-primary' : 'bg-white'}>
                <a
                  href='/admin/grades'
                  className={`nav-link ${loc.pathname === '/admin/grades' && 'text-white'}`}
                >
                  Grades
                </a>
              </li> */}
            </>
          )}

          {user?.role === 'instructor' && (
            <li
              className={
                loc.pathname === '/instructor/subjects' ? 'rounded bg-primary' : 'bg-white'
              }
            >
              <a
                href='/instructor/subjects'
                className={`nav-link ${loc.pathname === '/instructor/subjects' && 'text-white'}`}
              >
                Subjects
              </a>
            </li>
          )}

          {user?.role === 'student' && (
            <>
              <li
                className={loc.pathname === '/student/subjects' ? 'rounded bg-primary' : 'bg-white'}
              >
                <a
                  href='/student/subjects'
                  className={`nav-link ${loc.pathname === '/student/subjects' && 'text-white'}`}
                >
                  Subjects
                </a>
              </li>
              <li
                className={loc.pathname === '/student/grades' ? 'rounded bg-primary' : 'bg-white'}
              >
                <a
                  href='/student/grades'
                  className={`nav-link ${loc.pathname === '/student/grades' && 'text-white'}`}
                >
                  Grades
                </a>
              </li>
            </>
          )}
        </ul>
        <div
          className='d-flex align-items-center p-3 position-absolute bg-primary text-white'
          style={{ bottom: '0px', width: '319px', fontSize: '18px' }}
        >
          <div style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faArrowRightToBracket} className='mr-2' />
            <span onClick={logout}>Logout</span>
          </div>
        </div>
      </div>
    </>
  );
};
