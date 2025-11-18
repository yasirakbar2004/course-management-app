// src/components/CourseTypesCRUD.js (FINAL VERIFIED VERSION)

import React, { useState } from 'react';
import { Button, Table, Form, Modal, Row, Col, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const CourseTypesCRUD = ({ data, setData }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentType, setCurrentType] = useState({ id: null, name: '' });
  const [error, setError] = useState('');

  // Use a defensive array reference
  const courseTypesData = data || [];

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentType({ id: null, name: '' });
    setError('');
  };

  const handleShowAdd = () => {
    setIsEditing(false);
    setCurrentType({ id: Date.now(), name: '' }); 
    setShowModal(true);
  };

  const handleShowEdit = (type) => {
    setIsEditing(true);
    setCurrentType(type);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentType.name.trim()) {
      setError('Course Type Name cannot be empty.');
      return;
    }
    const typeToSave = { ...currentType, name: currentType.name.trim() };

    if (isEditing) {
      setData(courseTypesData.map(t => (t.id === typeToSave.id ? typeToSave : t)));
    } else {
      setData([...courseTypesData, typeToSave]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course type?')) {
      setData(courseTypesData.filter(t => t.id !== id));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h3>Course Types (e.g., Individual, Group)</h3>
        <Button variant="primary" onClick={handleShowAdd}>
          <FaPlus className="me-2" /> Add Course Type
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr><th>Name</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {/* 🚨 FIX: Using the defensive array 'courseTypesData' for mapping */}
          {courseTypesData.length > 0 ? (
            courseTypesData.map(type => (
              <tr key={type.id}>
                <td>{type.name}</td>
                <td style={{ width: '150px' }}>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEdit(type)}><FaEdit /> Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(type.id)}><FaTrash /> Del</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="2" className="text-center">No Course Types found.</td></tr>
          )}
        </tbody>
      </Table>
      
      {/* Modal remains the same */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton><Modal.Title>{isEditing ? 'Edit Course Type' : 'Add New Course Type'}</Modal.Title></Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3">Name</Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  placeholder="e.g., Individual or Group"
                  value={currentType.name}
                  onChange={(e) => setCurrentType({ ...currentType, name: e.target.value })}
                  required
                />
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="submit">{isEditing ? 'Save Changes' : 'Create Type'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CourseTypesCRUD;