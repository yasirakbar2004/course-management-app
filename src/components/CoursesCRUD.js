import React, { useState } from 'react';
import { Button, Table, Form, Modal, Row, Col, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const CoursesCRUD = ({ data, setData }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({ id: null, name: '' });
  const [error, setError] = useState('');

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentCourse({ id: null, name: '' });
    setError('');
  };

  const handleShowAdd = () => {
    setIsEditing(false);
    setCurrentCourse({ id: Date.now(), name: '' }); 
    setShowModal(true);
  };

  const handleShowEdit = (course) => {
    setIsEditing(true);
    setCurrentCourse(course);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentCourse.name.trim()) {
      setError('Course Name cannot be empty.');
      return;
    }
    const courseToSave = { ...currentCourse, name: currentCourse.name.trim() };

    if (isEditing) {
      setData(data.map(c => (c.id === courseToSave.id ? courseToSave : c)));
    } else {
      setData([...data, courseToSave]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setData(data.filter(c => c.id !== id));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h3>Courses (e.g., English, Hindi)</h3>
        <Button variant="primary" onClick={handleShowAdd}>
          <FaPlus className="me-2" /> Add Course
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr><th>Name</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(course => (
              <tr key={course.id}>
                <td>{course.name}</td>
                <td style={{ width: '150px' }}>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEdit(course)}><FaEdit /> Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(course.id)}><FaTrash /> Del</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="2" className="text-center">No Courses found.</td></tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton><Modal.Title>{isEditing ? 'Edit Course' : 'Add New Course'}</Modal.Title></Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3">Name</Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  placeholder="e.g., English"
                  value={currentCourse.name}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, name: e.target.value })}
                  required
                />
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="submit">{isEditing ? 'Save Changes' : 'Create Course'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CoursesCRUD;