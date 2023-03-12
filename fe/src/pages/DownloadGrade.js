import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../utils/apiRequest';
import { useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';

export const DownloadGrade = () => {
  const { id } = useParams();
  const [grade, setGrade] = useState([]);
  const [user, setUser] = useState({});
  const [admin, setAdmin] = useState({});
  const exportRef = useRef();

  const fetchData = async () => {
    await apiRequest.get(`/user-tor/${id}`).then((res) => {
      setGrade(res.data || []);
      if (res.data) {
        const first = Object.keys(res.data)[0];
        setUser(res.data[first][0].user);
      }
    });
  };

  const fetchAdminData = async () => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    } else {
      setAdmin(JSON.parse(localStorage.getItem('user') || {}));
    }
  };

  const generatePDF = async () => {
    html2canvas(exportRef.current).then((canvas) => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      heightLeft -= pageHeight;
      const doc = new jsPDF('p', 'mm');
      doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }
      doc.save(`${user.name}-TOR.pdf`);
    });
  };

  useEffect(() => {
    fetchData();
    fetchAdminData();
  }, []);

  return (
    <>
      <div className='m-5'>
        <button className='btn btn-primary float-right' onClick={generatePDF}>
          <FontAwesomeIcon icon={faPrint} className='mr-2' />
          Download
        </button>
      </div>
      <div
        ref={exportRef}
        className='py-5 text-center w-100'
        style={{ paddingRight: '10em', paddingLeft: '10em' }}
      >
        <div
          className='d-flex border-bottom flex-row align-items-center justify-content-center'
          style={{ backgroundColor: '' }}
        >
          <img src='/logo.png' alt='...' width='100px' />
          <div>
            <h3>School Name</h3>
            <h5>Official Transcript of Records</h5>
          </div>
        </div>
        <div className='d-flex border-bottom flex-row align-items-center justify-content-between mb-5'>
          <p>
            Name: <b>{user.name}</b>
          </p>
          <p>
            Course: <b>{user.course}</b>
          </p>
        </div>

        <h5 className='text-left'>Academic Record</h5>
        <Table bordered>
          <thead>
            <tr>
              <th>Term</th>
              <th>School Year</th>
              <th>Subject Title</th>
              <th>Grades</th>
            </tr>
          </thead>
          <tbody>
            {grade
              ? Object.keys(grade).map((key, index) => (
                  <>
                    <tr key={index} className='bg-light'>
                      <th>{key}</th>
                      <th />
                      <th />
                      <th />
                    </tr>
                    {grade[key].map((g, idx) => (
                      <tr key={idx}>
                        <td />
                        <td>{g.school_year}</td>
                        <td>{g.subject.name}</td>
                        <td>{g.finals ? parseFloat(g.finals).toFixed(1) : `-`}</td>
                      </tr>
                    ))}
                  </>
                ))
              : null}
          </tbody>
        </Table>

        <br />
        <section style={{ paddingRight: '10em', paddingLeft: '10em' }}>
          <div className='d-flex border-top flex-row align-items-center justify-content-between'>
            <p>
              Prepared By: <u>{admin.name}</u>
            </p>
            <p>
              Checked by:{' '}
              <u className='border-bottom'>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </u>
            </p>
          </div>
          <div className='d-flex border-bottom flex-row justify-content-between mb-5'>
            <p>
              Date Issued: <u>{DateTime.now().toFormat('yyyy/MM/dd')}</u>
            </p>
            <p className='text-right'>
              School Location: <span>Sample Address</span> <br />
              <span>Street, barangay</span>
              <br />
              <span>City, zip Code</span>
            </p>
          </div>
        </section>
        <p>
          The transcript is NOT VALID WITHOUT SEAL and The College Registrar's original signature in
          ink.
          <br />
          Any erasure or alteration made on this copy shall render the entire transcript invalid.
        </p>
      </div>
    </>
  );
};
