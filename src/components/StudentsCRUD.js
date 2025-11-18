
import React, { useState } from 'react';
import { Button, Table, Form, Modal, Alert, ListGroup, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaMapMarkedAlt, FaEye } from 'react-icons/fa';

const StudentsCRUD = ({ data, setData, offerings, courses, courseTypes }) => {
  // Modals state
  const [showCrudModal, setShowCrudModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  const [currentStudent, setCurrentStudent] = useState({ id: null, name: '', email: '', offeringId: '' }); 
  const [error, setError] = useState('');

  // Defensive Prop Access
  const studentsData = data || [];
  const offeringsData = offerings || [];
  const coursesData = courses || [];
  const courseTypesData = courseTypes || [];

  const getOfferingDisplay = (offeringId) => {
    // This helper remains generic for table/view display: Type - Course Name
    const offering = offeringsData.find(o => o.id === offeringId);
    if (!offering) return 'Not Mapped';

    const type = courseTypesData.find(t => t.id === offering.courseTypeId);
    const course = coursesData.find(c => c.id === offering.courseId);
    
    return `${type?.name || 'N/A Type'} - ${course?.name || 'N/A Course'}`;
  };
  
  // Helper to format the verbose label for the dropdown
  const getVerboseOptionLabel = (offering) => {
    const type = courseTypesData.find(t => t.id === offering.courseTypeId);
    const course = coursesData.find(c => c.id === offering.courseId);

    // 🚨 IMPLEMENTATION OF THE REQUIRED VERBOSE FORMATTING
    return `Course Type: ${type?.name || 'N/A'} - Course Name: ${course?.name || 'N/A'}`;
  }


  // --- Close Handlers ---
  const handleClose = () => {
    setShowCrudModal(false);
    setShowMapModal(false);
    setShowViewModal(false);
    setIsEditing(false);
    setCurrentStudent({ id: null, name: '', email: '', offeringId: '' });
    setError('');
  };

  // --- Student CRUD Handlers ---
  const handleShowAdd = () => {
    setIsEditing(false);
    setCurrentStudent({ id: Date.now(), name: '', email: '', offeringId: '' });
    setShowCrudModal(true);
  };

  const handleShowEdit = (student) => {
    setIsEditing(true);
    setCurrentStudent(student);
    setShowCrudModal(true);
  };

  const handleChange = (e) => {
    setCurrentStudent({ ...currentStudent, [e.target.name]: e.target.value });
  };

  const handleCrudSubmit = (e) => {
    e.preventDefault();
    const { name, email } = currentStudent;

    if (!name.trim() || !email.trim()) {
      setError('Name and Email are required.');
      return;
    }

    const studentToSave = { ...currentStudent };

    if (isEditing) {
      setData(studentsData.map(s => (s.id === studentToSave.id ? studentToSave : s)));
    } else {
      setData([...studentsData, studentToSave]);
    }
    handleClose();
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setData(studentsData.filter(s => s.id !== id));
    }
  };
  
  // --- Mapping Handlers ---
  const handleShowMap = (student) => {
    // Map modal needs the student data and converts offeringId to string for select
    setCurrentStudent({ ...student, offeringId: student.offeringId ? student.offeringId.toString() : '' });
    setShowMapModal(true);
  };

  const handleMapSubmit = (e) => {
    e.preventDefault();
    const { id, offeringId } = currentStudent;
    
    const newOfferingId = offeringId === '' ? '' : Number(offeringId);
    
    setData(studentsData.map(s => (
        s.id === id ? { ...s, offeringId: newOfferingId } : s
    )));
    handleClose();
  };

  // --- View Handler ---
  const handleShowView = (student) => {
    setCurrentStudent(student);
    setShowViewModal(true);
  };
  
  const hasOfferings = offeringsData.length > 0;

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h3>Students Registration & Mapping</h3>
        <Button variant="primary" onClick={handleShowAdd}>
          <FaPlus className="me-2" /> Register New Student
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mapped Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentsData.length > 0 ? (
            studentsData.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{getOfferingDisplay(student.offeringId)}</td>
                <td style={{ width: '250px' }}>
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleShowView(student)}><FaEye /> View</Button>
                  <Button variant="secondary" size="sm" className="me-2" onClick={() => handleShowMap(student)}><FaMapMarkedAlt /> Map</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(student.id)}><FaTrash /> Del</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" className="text-center">No Students found.</td></tr>
          )}
        </tbody>
      </Table>

      {/* --------------------- 1. Student CRUD Modal (No Mapping) --------------------- */}
      <Modal show={showCrudModal} onHide={handleClose}>
        <Modal.Header closeButton><Modal.Title>{isEditing ? 'Edit Student Details' : 'Register New Student'}</Modal.Title></Modal.Header>
        <Form onSubmit={handleCrudSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3"><Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={currentStudent.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={currentStudent.email} onChange={handleChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="submit">{isEditing ? 'Save Changes' : 'Register Student'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* --------------------- 2. Mapping Modal --------------------- */}
      <Modal show={showMapModal} onHide={handleClose}>
        <Modal.Header closeButton><Modal.Title>Map Course for {currentStudent.name}</Modal.Title></Modal.Header>
        <Form onSubmit={handleMapSubmit}>
            <Modal.Body>
                <Alert variant="info">Select a course offering below to enroll the student, or select 'Unmap' to remove enrollment.</Alert>
                <Form.Group className="mb-3" controlId="formStudentOffering">
                    <Form.Label>Map to Course Offering</Form.Label>
                    <Form.Select 
                        name="offeringId" 
                        value={currentStudent.offeringId} 
                        onChange={handleChange}
                        disabled={!hasOfferings}
                    >
                        <option value="">{hasOfferings ? 'Unmap / Select Offering' : 'No Offerings available'}</option>
                        {/* 🚨 VERBOSE LABEL IMPLEMENTATION */}
                        {offeringsData.map(offering => (
                            <option key={offering.id} value={offering.id}>
                                {getVerboseOptionLabel(offering)}
                            </option>
                        ))}
                    </Form.Select>
                    {!hasOfferings && <small className="text-danger">Create Course Offerings first.</small>}
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="success" type="submit">Update Mapping</Button>
            </Modal.Footer>
        </Form>
      </Modal>

      {/* --------------------- 3. View Modal --------------------- */}
      <Modal show={showViewModal} onHide={handleClose}>
        <Modal.Header closeButton><Modal.Title>Viewing Student: {currentStudent.name}</Modal.Title></Modal.Header>
        <Modal.Body>
            <ListGroup>
                <ListGroup.Item><strong>Name:</strong> {currentStudent.name}</ListGroup.Item>
                <ListGroup.Item><strong>Email:</strong> {currentStudent.email}</ListGroup.Item>
                <ListGroup.Item variant={currentStudent.offeringId ? 'success' : 'warning'}>
                    <strong>Course Joined:</strong> 
                    {currentStudent.offeringId 
                        ? getOfferingDisplay(currentStudent.offeringId) 
                        : 'Not Admitted yet'}
                </ListGroup.Item>
            </ListGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudentsCRUD;