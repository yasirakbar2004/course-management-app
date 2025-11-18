// src/App.js

import React from 'react';
import { Container, Tabs, Tab, Alert } from 'react-bootstrap';
import useLocalStorage from './hooks/useLocalStorage';

import CourseTypesCRUD from './components/CourseTypesCRUD';
import CoursesCRUD from './components/CoursesCRUD';
import OfferingsCRUD from './components/OfferingsCRUD';
import StudentsCRUD from './components/StudentsCRUD';

function App() {
  const [courseTypes, setCourseTypes] = useLocalStorage('courseTypes', []);
  const [courses, setCourses] = useLocalStorage('courses', []);
  const [offerings, setOfferings] = useLocalStorage('offerings', []);
  const [students, setStudents] = useLocalStorage('students', []);

  
  React.useEffect(() => {
    const validOfferingIds = new Set(offerings.map(o => o.id));

    const updatedStudents = students.map(student => {
     
      if (student.offeringId && !validOfferingIds.has(student.offeringId)) {
        return { ...student, offeringId: '' }; 
      }
      return student;
    });
    
    if (JSON.stringify(students) !== JSON.stringify(updatedStudents)) {
        setStudents(updatedStudents);
    }
  }, [offerings, students, setStudents]);

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">📚 Simplified Course Management System</h1>
      
      <Tabs defaultActiveKey="courseTypes" id="course-management-tabs" className="mb-3">

        <Tab eventKey="courseTypes" title="1. Course Types">
          <CourseTypesCRUD data={courseTypes} setData={setCourseTypes} />
        </Tab>

        <Tab eventKey="courses" title="2. Courses">
          <CoursesCRUD data={courses} setData={setCourses} />
        </Tab>

        <Tab eventKey="offerings" title="3. Course Offerings">
          <OfferingsCRUD
            data={offerings}
            setData={setOfferings}
            courses={courses}
            courseTypes={courseTypes}
          />
        </Tab>

        <Tab eventKey="students" title="4. Students & Mapping">
          <StudentsCRUD
            data={students} 
            setData={setStudents}
            offerings={offerings} 
            courses={courses} 
            courseTypes={courseTypes} 
          />
        </Tab>

      </Tabs>
      
    </Container>
  );
}

export default App;