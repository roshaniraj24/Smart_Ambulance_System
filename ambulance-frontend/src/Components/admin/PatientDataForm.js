import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PatientDataForm = ({ addPatientData }) => {
  const { incidentId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: incidentId || '',
    name: '',
    age: '',
    condition: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPatientData(formData);
    navigate('/admin'); // Assuming AdminDashboard is at /admin
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Patient Data Form for Incident {formData.id}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Age:</label><br />
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </div>
        <div>
          <label>Condition:</label><br />
          <input type="text" name="condition" value={formData.condition} onChange={handleChange} required />
        </div>
        <div>
          <label>Notes:</label><br />
          <textarea name="notes" value={formData.notes} onChange={handleChange} />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Submit</button>
      </form>
    </div>
  );
};

export default PatientDataForm;
