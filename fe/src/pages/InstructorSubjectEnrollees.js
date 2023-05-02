import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { apiRequest } from '../utils/apiRequest';
import { Button, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { Breadcrumb } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export const InstructorSubjectEnrollees = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [sub, setSub] = useState({});
  const [user, setUser] = useState({});
  const [grade, setGrade] = useState({
    id: null,
    type: 'midterm',
    grade: null,
  });
  const [keyword, setKeyword] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShow = (id) => {
    setGrade({ ...grade, id: id });
    setShowModal(true);
  };

  const submitFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    const urlSearchParams = new URLSearchParams();
    if (keyword !== '') {
      urlSearchParams.append('keyword', keyword);
    }

    await apiRequest.get(`/subjects/${id}?${urlSearchParams.toString()}`).then((res) => {
      setSub(res.data[0] || {});
      setStudents(res.data[0].students || []);
    });
  };

  const fetchAdminData = async () => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    } else {
      setUser(JSON.parse(localStorage.getItem('user') || {}));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest
      .patch(`/grades/${grade.id}`, grade)
      .then((res) => {
        handleClose();
        fetchData();
      })
      .catch((e) => {
        alert(e.response.data);
      });
  };

  const options = [
    { value: 'midterm', label: 'midterm' },
    { value: 'final', label: 'final' },
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  const handleChange = (option) => {
    setSelectedOption(option);
    setGrade({ ...grade, type: option.value });
  };

  useEffect(() => {
    fetchData();
    fetchAdminData();
  }, []);

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

  return (
    <Page title={`${sub.name} Enrollees`} subTitle={`Schedule: ${sub.schedule}`}>
      <Breadcrumb>
        <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
        <Breadcrumb.Item
          href={`${user.role === 'instructor' ? '/instructor/subjects' : '/admin/subjects'}`}
        >
          Subjects
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Enrollees</Breadcrumb.Item>
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
            <th scope='col'>Student</th>
            <th scope='col'>Midterms</th>
            <th scope='col'>Finals</th>
            {user.role === 'instructor' ? <th scope='col'>Actions</th> : null}
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
                <td>{gradeFormat(key.midterm)}</td>
                <td>{gradeFormat(key.finals)}</td>
                {user.role === 'instructor' ? (
                  <td>
                    <button className='btn btn-primary' onClick={() => handleShow(key.id)}>
                      Grade Student
                    </button>
                  </td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleClose}>
        <form onSubmit={onSubmit}>
          <Modal.Header className='bg-primary text-white'>
            <Modal.Title>Student Grading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              <h6>Grade</h6>

              <small className='text-danger'>
                * Please refer to the criteria below.
                <br /> Highest = 1.0 | Passing = 3.0 | Dropped = 0
              </small>

              <input
                type='text'
                className='form-control'
                pattern='^([1-9]\d*|0)(\.\d+)?$'
                required
                onChange={(e) => setGrade({ ...grade, grade: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>Term</h6>
              <Select value={selectedOption} onChange={handleChange} options={options} required />
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
