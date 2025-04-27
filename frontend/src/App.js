import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Form, Table, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/persons';

function App() {
  const [persons, setPersons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPerson, setCurrentPerson] = useState({ name: '', birthDate: '', email: '', phoneNumber: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  // Fetch persons on component mount
  useEffect(() => {
    fetchPersons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all persons from API
  const fetchPersons = async () => {
    try {
      const response = await axios.get(API_URL);
      setPersons(response.data);
    } catch (error) {
      showAlert('Viga isikute laadimisel', 'danger');
      console.error('Error fetching persons:', error);
    }
  };

  // Search persons
  const searchPersons = async () => {
    try {
      if (searchTerm.trim() === '') {
        fetchPersons();
        return;
      }
      const response = await axios.get(`${API_URL}/search?name=${searchTerm}`);
      setPersons(response.data);
    } catch (error) {
      showAlert('Viga otsingul', 'danger');
      console.error('Error searching persons:', error);
    }
  };

  // Show alert message
  const showAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setTimeout(() => {
      setAlertMessage('');
    }, 3000);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPerson({ ...currentPerson, [name]: value });
  };

  // Open modal for adding a new person
  const handleAddPerson = () => {
    setCurrentPerson({ name: '', birthDate: '', email: '', phoneNumber: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  // Open modal for editing a person
  const handleEditPerson = (person) => {
    // Format date for input field
    const formattedPerson = {
      ...person,
      birthDate: person.birthDate ? person.birthDate.substring(0, 10) : ''
    };
    setCurrentPerson(formattedPerson);
    setIsEditing(true);
    setShowModal(true);
  };

  // Submit form for adding/editing a person
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${currentPerson.id}`, currentPerson);
        showAlert('Isik muudetud edukalt', 'success');
      } else {
        await axios.post(API_URL, currentPerson);
        showAlert('Isik lisatud edukalt', 'success');
      }
      setShowModal(false);
      fetchPersons();
    } catch (error) {
      showAlert('Viga: ' + (error.response?.data?.message || 'Midagi läks valesti'), 'danger');
      console.error('Error saving person:', error);
    }
  };

  // Delete a person
  const handleDeletePerson = async (id) => {
    if (window.confirm('Kas oled kindel, et soovid kustutada?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        showAlert('Isik kustutatud edukalt', 'success');
        fetchPersons();
      } catch (error) {
        showAlert('Viga kustutamisel', 'danger');
        console.error('Error deleting person:', error);
      }
    }
  };

  // Sort persons
  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sortedPersons = [...persons].sort((a, b) => {
      let valueA = a[field] || '';
      let valueB = b[field] || '';

      if (field === 'birthDate') {
        valueA = valueA ? new Date(valueA) : new Date(0);
        valueB = valueB ? new Date(valueB) : new Date(0);
      }

      if (valueA < valueB) return newDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setPersons(sortedPersons);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('et-EE');
  };

  return (
      <Container className="mt-4">
        <h1 className="text-center mb-4">Person Manager</h1>

        {/* Alert Messages */}
        {alertMessage && (
            <Alert variant={alertVariant} className="mt-2">
              {alertMessage}
            </Alert>
        )}

        {/* Search and Add Button */}
        <Row className="mb-3">
          <Col md={8}>
            <Form.Group as={Row}>
              <Col sm={8}>
                <Form.Control
                    type="text"
                    placeholder="Otsi nime järgi"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchPersons()}
                />
              </Col>
              <Col sm={4}>
                <Button variant="primary" onClick={searchPersons}>Otsi</Button>{' '}
                <Button variant="secondary" onClick={() => {setSearchTerm(''); fetchPersons();}}>Tühista</Button>
              </Col>
            </Form.Group>
          </Col>
          <Col md={4} className="text-end">
            <Button variant="success" onClick={handleAddPerson}>
              Lisa uus isik
            </Button>
          </Col>
        </Row>

        {/* Persons Table */}
        <Table striped bordered hover responsive>
          <thead>
          <tr>
            <th onClick={() => handleSort('name')} style={{cursor: 'pointer'}}>
              Nimi {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('birthDate')} style={{cursor: 'pointer'}}>
              Sünnipäev {sortField === 'birthDate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('email')} style={{cursor: 'pointer'}}>
              E-mail {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('phoneNumber')} style={{cursor: 'pointer'}}>
              Telefon {sortField === 'phoneNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Tegevused</th>
          </tr>
          </thead>
          <tbody>
          {persons.length > 0 ? (
              persons.map((person) => (
                  <tr key={person.id}>
                    <td>{person.name}</td>
                    <td>{formatDate(person.birthDate)}</td>
                    <td>{person.email}</td>
                    <td>{person.phoneNumber}</td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => handleEditPerson(person)} className="me-2">
                        Muuda
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeletePerson(person.id)}>
                        Kustuta
                      </Button>
                    </td>
                  </tr>
              ))
          ) : (
              <tr>
                <td colSpan="5" className="text-center">Isikuid ei leitud</td>
              </tr>
          )}
          </tbody>
        </Table>

        {/* Add/Edit Person Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Muuda isikut' : 'Lisa uus isik'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nimi</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={currentPerson.name}
                    onChange={handleChange}
                    required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Sünnipäev</Form.Label>
                <Form.Control
                    type="date"
                    name="birthDate"
                    value={currentPerson.birthDate}
                    onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={currentPerson.email}
                    onChange={handleChange}
                    required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Telefon</Form.Label>
                <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={currentPerson.phoneNumber}
                    onChange={handleChange}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Tühista
              </Button>
              <Button variant="primary" type="submit">
                Salvesta
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
  );
}

export default App;