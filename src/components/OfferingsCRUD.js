// src/components/OfferingsCRUD.js (WITH FILTER)

import React, { useState, useMemo } from 'react';
import { Button, Table, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaFilter } from 'react-icons/fa';

const OfferingsCRUD = ({ data, setData, courses, courseTypes }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOffering, setCurrentOffering] = useState({ id: null, courseTypeId: '', courseId: '' });
  const [error, setError] = useState('');
  
  // --- Filter State ---
  const [filterType, setFilterType] = useState('');
  const [filterCourse, setFilterCourse] = useState('');

  const courseTypesData = courseTypes || [];
  const coursesData = courses || [];
  const offeringsData = data || [];

  const getDisplayName = (courseTypeId, courseId) => {
    const type = courseTypesData.find(t => t.id === Number(courseTypeId));
    const course = coursesData.find(c => c.id === Number(courseId));
    return `${type?.name || 'N/A'} - ${course?.name || 'N/A'}`;
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentOffering({ id: null, courseTypeId: '', courseId: '' });
    setError('');
  };

  // ... (handleShowAdd, handleShowEdit, handleChange, handleSubmit, handleDelete remain the same) ...

  const handleShowAdd = () => {
    setIsEditing(false);
    setCurrentOffering({ 
        id: Date.now(), 
        courseTypeId: courseTypesData.length > 0 ? courseTypesData[0].id.toString() : '', 
        courseId: coursesData.length > 0 ? coursesData[0].id.toString() : '' 
    });
    setShowModal(true);
  };

  const handleShowEdit = (offering) => {
    setIsEditing(true);
    setCurrentOffering({ 
        ...offering, 
        courseTypeId: offering.courseTypeId.toString(),
        courseId: offering.courseId.toString()
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setCurrentOffering({ ...currentOffering, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { courseTypeId, courseId } = currentOffering;

    if (!courseTypeId || !courseId) {
      setError('Both Course Type and Course must be selected.');
      return;
    }

    // Check for duplicates
    const isDuplicate = offeringsData.some(o => 
        o.courseTypeId === Number(courseTypeId) && 
        o.courseId === Number(courseId) && 
        o.id !== currentOffering.id
    );
    if (isDuplicate) {
        setError('This Course Offering (Type-Course combination) already exists.');
        return;
    }

    const offeringToSave = { 
        ...currentOffering, 
        courseTypeId: Number(courseTypeId), 
        courseId: Number(courseId) 
    };

    if (isEditing) {
      setData(offeringsData.map(o => (o.id === offeringToSave.id ? offeringToSave : o)));
    } else {
      setData([...offeringsData, offeringToSave]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course offering? This will unmap students!')) {
      setData(offeringsData.filter(o => o.id !== id));
    }
  };

  const canAdd = coursesData.length > 0 && courseTypesData.length > 0;

  // --- Filtering Logic ---
  const filteredOfferings = useMemo(() => {
    return offeringsData.filter(offering => {
      let matchesType = true;
      let matchesCourse = true;

      if (filterType) {
        matchesType = offering.courseTypeId === Number(filterType);
      }
      if (filterCourse) {
        matchesCourse = offering.courseId === Number(filterCourse);
      }

      return matchesType && matchesCourse;
    });
  }, [offeringsData, filterType, filterCourse]);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h3>Course Offerings (Type - Course Combinations)</h3>
        <Button variant="primary" onClick={handleShowAdd} disabled={!canAdd}>
          <FaPlus className="me-2" /> Add Offering
        </Button>
      </div>

      {!canAdd && (
        <Alert variant="info">Please create Course Types and Courses first.</Alert>
      )}

      {/* --- Filter Row --- */}
      <Row className="mb-3 align-items-center">
        <Col xs={1} className="text-center"><FaFilter size={20} /></Col>
        <Col xs={5}>
            <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">Filter by Course Type (All)</option>
                {courseTypesData.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                ))}
            </Form.Select>
        </Col>
        <Col xs={5}>
            <Form.Select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
                <option value="">Filter by Course Name (All)</option>
                {coursesData.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                ))}
            </Form.Select>
        </Col>
        <Col xs={1}>
             {(filterType || filterCourse) && (
                <Button variant="outline-secondary" size="sm" onClick={() => { setFilterType(''); setFilterCourse(''); }}>Clear</Button>
            )}
        </Col>
      </Row>
      {/* -------------------- */}


      <Table striped bordered hover responsive>
        <thead>
          <tr><th>Offering</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filteredOfferings.length > 0 ? (
            filteredOfferings.map(offering => (
              <tr key={offering.id}>
                <td>{getDisplayName(offering.courseTypeId, offering.courseId)}</td>
                <td style={{ width: '150px' }}>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEdit(offering)}><FaEdit /> Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(offering.id)}><FaTrash /> Del</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="2" className="text-center">No Course Offerings found matching the filter.</td></tr>
          )}
        </tbody>
      </Table>
      
      {/* Modal remains the same */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton><Modal.Title>{isEditing ? 'Edit Course Offering' : 'Add New Course Offering'}</Modal.Title></Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Course Type</Form.Label>
              <Form.Select name="courseTypeId" value={currentOffering.courseTypeId} onChange={handleChange} required>
                <option value="">Select Course Type</option>
                {courseTypesData.map(type => (<option key={type.id} value={type.id}>{type.name}</option>))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Course Name</Form.Label>
              <Form.Select name="courseId" value={currentOffering.courseId} onChange={handleChange} required>
                <option value="">Select Course</option>
                {coursesData.map(course => (<option key={course.id} value={course.id}>{course.name}</option>))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="submit">{isEditing ? 'Save Changes' : 'Create Offering'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default OfferingsCRUD;