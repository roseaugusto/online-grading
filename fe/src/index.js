import React from 'react';
import ReactDOM from 'react-dom/client';
import { Page } from './pages/Page';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminInstructors } from './pages/AdminInstructors';
import { AdminStudents } from './pages/AdminStudents';
import { AdminSubjects } from './pages/AdminSubjects';
import { AdminGrades } from './pages/AdminGrades';
import { Profile } from './pages/Profile';
import { InstructorSubjects } from './pages/InstructorSubjects';
import { InstructorSubjectEnrollees } from './pages/InstructorSubjectEnrollees';
import { StudentSubjects } from './pages/StudentSubjects';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentGrades } from './pages/StudentGrades';
import { DownloadGrade } from './pages/DownloadGrade';
import { PrivatePolicy } from './pages/PrivatePolicy';

import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/private-policy' element={<PrivatePolicy />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/intructors' element={<AdminInstructors />} />
        <Route path='/admin/students' element={<AdminStudents />} />
        <Route path='/admin/subjects' element={<AdminSubjects />} />
        <Route path='/admin/grades' element={<AdminGrades />} />
        <Route path='/user/tor/:id' element={<DownloadGrade />} />
        <Route path='/user/profile' element={<Profile />} />

        <Route path='/instructor/subjects' element={<InstructorSubjects />} />

        <Route path='/subjects/:id' element={<InstructorSubjectEnrollees />} />

        <Route path='/student/subjects' element={<StudentSubjects />} />
        <Route path='/student/grades' element={<StudentGrades />} />
        <Route path='/student/dashboard' element={<StudentDashboard />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
