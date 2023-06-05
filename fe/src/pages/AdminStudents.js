import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, Breadcrumb } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';
import { Excel } from '../utils/excel';
import Select from 'react-select';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [keyword, setKeyword] = useState('');

  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'student',
    course: 'BSIT',
  });

  const [enrollment, setEnrollment] = useState({
    year: '',
    school_year: '',
    subject_id: '',
    user_id: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [file, setFile] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleFileClose = () => setShowFileModal(false);
  const handleFileShow = () => setShowFileModal(true);

  const handleCloseSubject = () => setShowSubjectModal(false);
  const handleShowSubject = (id) => {
    setEnrollment({ ...enrollment, user_id: id });
    setShowSubjectModal(true);
  };

  const options = [
    { value: 'BSIT', label: 'BSIT' },
    { value: 'BSCRIM', label: 'BSCRIM' },
    { value: 'BSHRM', label: 'BSHRM' },
    { value: 'BEED', label: 'BEED' },
    { value: 'BSED-ENGLISH', label: 'BSED-ENGLISH' },
    { value: 'BSED-MATH', label: 'BSED-MATH' },
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  const handleChange = (option) => {
    setSelectedOption(option);
    setUser({ ...user, course: option.value });
  };

  const onEnrollmentSubmit = async (e) => {
    e.preventDefault();
    const hasData = await apiRequest.get(
      `user/enrollment?user_id=${enrollment.user_id}&school_year=${enrollment.school_year}&subject_id=${enrollment.subject_id}`,
    );

    if (hasData.data) {
      alert('Cannot re-enroll the subject in the same school year');
      return;
    }

    await apiRequest.post('/grades', enrollment).then((res) => {
      handleCloseSubject();
      fetchData();
    });
  };

  const onFileSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Upload an excel (.xlsx) file first.');
      return;
    }

    // reading the file
    const book = await Excel.read(file);
    // reading sheet
    const coverSheet = book.Sheets['students'];
    // set starting index
    const firstIndex = 2;

    const lastIndex = Excel.getLastIndex(coverSheet);

    let rowData = [];
    for (let i = firstIndex; i <= lastIndex; i++) {
      let raw = {
        name: coverSheet[`B${i}`].v,
        email: coverSheet[`C${i}`].v,
        role: 'student',
        course: coverSheet[`P${i}`].v,
        contact: coverSheet[`E${i}`].v,
        address: coverSheet[`F${i}`].v,
        id_number: coverSheet[`A${i}`].v,
        gender: coverSheet[`H${i}`].v,
        civil_status: coverSheet[`I${i}`].v,
        religion: coverSheet[`J${i}`].v,
        nationality: coverSheet[`K${i}`].v,
        father_occupation: coverSheet[`L${i}`].v,
        mother_occupation: coverSheet[`M${i}`].v,
        guardian: coverSheet[`N${i}`].v,
        guardian_contact: coverSheet[`O${i}`].v,
      };

      rowData.push(raw);
    }

    await apiRequest.post('/bulk-registration', { users: rowData }).then((res) => {
      handleFileClose();
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

  const submitFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    const urlSearchParams = new URLSearchParams();
    if (keyword !== '') {
      urlSearchParams.append('keyword', keyword);
    }

    await apiRequest.get(`/users/student?${urlSearchParams.toString()}`).then((res) => {
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
    <Page title='Students'>
      <Breadcrumb>
        <Breadcrumb.Item href='/admin/dashboard'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Students</Breadcrumb.Item>
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
          <FontAwesomeIcon
            icon={faPlus}
            className='btn btn-primary mr-2'
            onClick={() => {
              handleShow();
            }}
          />
          <FontAwesomeIcon
            icon={faFileImport}
            className='btn btn-primary'
            onClick={() => {
              handleFileShow();
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
                  <button
                    className='btn btn-success mr-2'
                    onClick={() => handleShowSubject(student.id)}
                  >
                    Enroll Student
                  </button>
                  <a href={`/user/tor/${student.id}`} target='_blank' rel='noreferrer'>
                    <button className='btn btn-warning'>Generate TOR</button>
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
            <Modal.Title>Student Registration</Modal.Title>
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
                required
              />
            </div>
            <div className='mb-3'>
              <h6>School Year</h6>
              <input
                type='text'
                className='form-control'
                placeholder='2022-2023'
                onChange={(e) => setEnrollment({ ...enrollment, school_year: e.target.value })}
                required
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
      <Modal show={showFileModal} onHide={handleFileClose}>
        <form onSubmit={onFileSubmit}>
          <Modal.Header className='bg-primary text-white'>
            <Modal.Title>Bulk Student Registration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              <h6>Upload File</h6>
              <input
                type='file'
                className='form-control'
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleFileClose}>
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
