import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-modal';
import Switch from 'react-switch';
import { FaTrash, FaEdit, FaFile } from 'react-icons/fa';

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({ titre: '', texte: '', visible: false });

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editIncident, setEditIncident] = useState(null);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '20px',
    },
    closeButton: {
      backgroundColor: 'rgba(217, 217, 217, 0.941)',
      border: 'none',
      borderRadius: '50%',
      color: '#999',
      float: 'right top'
    },
    labelColor: {
      color: 'rgba(0, 91, 144, 0.941)'
    },
    switchAlign: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  };


  useEffect(() => {
    axios.get('http://localhost:8000/api/incidents')
      .then(response => {
        setIncidents(response.data);
      });
  }, []);

  function selectIncident(id) {
    setSelectedIncidents([...selectedIncidents, id]);
  }

  function deselectIncident(id) {
    setSelectedIncidents(selectedIncidents.filter(incidentId => incidentId !== id));
  }

  function deleteSelectedIncidents() {
    selectedIncidents.forEach(id => {
      axios.delete(`http://localhost:8000/api/incidents/${id}`)
        .then(response => {
          setIncidents(incidents.filter(incident => incident.id !== id));
        })
        .catch(error => {
          console.log("Erreur lors de la suppression de l'incident : ", error);
        });
    });
    setSelectedIncidents([]);
  }

  function handleNewIncidentChange(e) {
    setNewIncident({ ...newIncident, [e.target.name]: e.target.value });
  }

  function handleSwitchChange(checked) {
    setNewIncident({ ...newIncident, visible: checked ? 1 : 0 });
  }

  function handleNewIncidentSubmit(e) {
    e.preventDefault();

    const incidentToCreate = { ...newIncident };

    axios.post('http://localhost:8000/api/incidents', incidentToCreate)
      .then(response => {
        setIncidents([...incidents, response.data]);
        setNewIncident({ titre: '', texte: '', visible: false });
      })
      .catch(error => {
        console.log("Erreur lors de la création de l'incident : ", error);
      });
    setModalIsOpen(false);
  }

  function handleEditIncident() {
    if (selectedIncidents.length !== 1) {
      alert("Veuillez sélectionner un seul incident à modifier.");
      return;
    }

    const incidentToEdit = incidents.find(incident => incident.id === selectedIncidents[0]);
    setEditIncident(incidentToEdit);
    setEditModalIsOpen(true);
  }

  function handleEditIncidentChange(e) {
    setEditIncident({ ...editIncident, [e.target.name]: e.target.value });
  }

  function handleEditSwitchChange(checked) {
    setEditIncident({ ...editIncident, visible: checked ? 1 : 0 });
  }

  function handleEditIncidentSubmit(e) {
    e.preventDefault();

    axios.put(`http://localhost:8000/api/incidents/${editIncident.id}`, editIncident)
      .then(response => {
        setIncidents(incidents.map(incident => incident.id === editIncident.id ? editIncident : incident));
        setEditIncident(null);
      })
      .catch(error => {
        console.log("Erreur lors de la modification de l'incident : ", error);
      });
    setEditModalIsOpen(false);
  }


  function intToVisibilityString(intValue) {
    return intValue === 1 ? 'OUI' : 'NON';
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: '1' }}></div>  {/* Div vide pour équilibrer */}
          <h1 style={{ flex: '1' }}>Liste des incidents iSendPro</h1>
          <div style={{ flex: '1', textAlign: 'right' }}>
            <button onClick={() => setModalIsOpen(true)}><FaFile /> Ajouter un nouvel incident</button>
          </div>
        </div>
      </header>

      <Modal isOpen={modalIsOpen} style={customStyles} onRequestClose={() => setModalIsOpen(false)}>
        <div style={{ position: 'relative' }}>
          <button
            style={{
              border: '2px solid red',
              color: 'red',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              fontSize: '18px',
              padding: '5px 10px',
              position: 'absolute',
              top: '-30px',
              right: '-10px'
            }}
            onClick={() => setModalIsOpen(false)}
          >
            X
          </button>
          <form onSubmit={handleNewIncidentSubmit} style={{ marginTop: '20px' }}>
            <label>
              <span style={{ color: 'rgba(0, 91, 144, 0.941)', display: 'block', marginBottom: '10px' }}>Titre </span>
              <input type="text" name="titre" onChange={handleNewIncidentChange} maxLength="255" style={{ border: '1px solid #ccc', marginBottom: '20px' }} />
            </label>
            <label>
              <span style={{ color: 'rgba(0, 91, 144, 0.941)', display: 'block', marginBottom: '10px' }}>Texte </span>
              <textarea name="texte" onChange={handleNewIncidentChange} maxLength="5000" style={{ border: '1px solid #ccc', marginBottom: '20px' }} />
            </label>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ color: 'rgba(0, 91, 144, 0.941)', marginRight: '10px' }}>Visible</span>
              <Switch onChange={handleSwitchChange} checked={newIncident.visible === 1} />
            </div>
            <button type="submit">Valider</button>
          </form>
        </div>
      </Modal>

      <Modal isOpen={editModalIsOpen} style={customStyles} onRequestClose={() => setEditModalIsOpen(false)}>
        {editIncident && (
          <div style={{ position: 'relative' }}>
            <button
              style={{
                border: '2px solid red',
                color: 'red',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                fontSize: '18px',
                padding: '5px 10px',
                position: 'absolute',
                top: '-30px',
                right: '-10px'
              }}
              onClick={() => setEditModalIsOpen(false)}
            >
              X
            </button>
            <form onSubmit={handleEditIncidentSubmit} style={{ marginTop: '20px' }}>
              <label>
                <span style={{ color: 'rgba(0, 91, 144, 0.941)', display: 'block', marginBottom: '10px' }}>Titre </span>
                <input type="text" name="titre" value={editIncident.titre} onChange={handleEditIncidentChange} maxLength="255" style={{ border: '1px solid #ccc', marginBottom: '20px' }} />
              </label>
              <label>
                <span style={{ color: 'rgba(0, 91, 144, 0.941)', display: 'block', marginBottom: '10px' }}>Texte </span>
                <textarea name="texte" value={editIncident.texte} onChange={handleEditIncidentChange} maxLength="5000" style={{ border: '1px solid #ccc', marginBottom: '20px' }} />
              </label>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ color: 'rgba(0, 91, 144, 0.941)', marginRight: '10px' }}>Visible</span>
                <Switch onChange={handleEditSwitchChange} checked={editIncident.visible === 1} />
              </div>
              <button type="submit">Valider</button>
            </form>
          </div>
        )}
      </Modal>



      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Texte</th>
            <th>Date création</th>
            <th>Date modification</th>
            <th>Visible</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(incident => (
            <tr key={incident.id}>
              <td>{incident.titre}</td>
              <td>{incident.texte}</td>
              <td>{moment(incident.date_creation).format('DD-MM-YYYY HH:mm')}</td>
              <td>{moment(incident.date_modification).format('DD-MM-YYYY HH:mm')}</td>
              <td>{intToVisibilityString(incident.visible)}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIncidents.includes(incident.id)}
                  onChange={() => selectedIncidents.includes(incident.id) ? deselectIncident(incident.id) : selectIncident(incident.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="actions">
        {selectedIncidents.length > 0 && <button onClick={deleteSelectedIncidents}><FaTrash />Effacer</button>}
        {selectedIncidents.length === 1 && <button onClick={handleEditIncident}><FaEdit /> Modifier</button>}
      </div>
    </div>
  );
}

export default IncidentList;
