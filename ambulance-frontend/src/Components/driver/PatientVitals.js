import React from 'react';

const PatientVitals = ({ vitals = {} }) => {
  const getVitalStatus = (vital, value) => {
    switch (vital) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'critical';
        if (value < 70 || value > 90) return 'warning';
        return 'normal';
      case 'spo2':
        if (value < 95) return 'critical';
        if (value < 97) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <div className="vitals-grid">
      <div className={`vital-item ${getVitalStatus('heartRate', vitals?.heartRate)}`}>
        <span className="vital-icon">💓</span>
        <div className="vital-info">
          <span className="vital-label">Heart Rate</span>
          <span className="vital-value">{vitals?.heartRate || '--'} BPM</span>
        </div>
      </div>

      <div className="vital-item normal">
        <span className="vital-icon">🩸</span>
        <div className="vital-info">
          <span className="vital-label">Blood Pressure</span>
          <span className="vital-value">{vitals?.bloodPressure || '--/--'}</span>
        </div>
      </div>

      <div className={`vital-item ${getVitalStatus('spo2', vitals?.spo2)}`}>
        <span className="vital-icon">🫁</span>
        <div className="vital-info">
          <span className="vital-label">SpO2</span>
          <span className="vital-value">{vitals?.spo2 || '--'}%</span>
        </div>
      </div>

      <div className="vital-item normal">
        <span className="vital-icon">🌡️</span>
        <div className="vital-info">
          <span className="vital-label">Temperature</span>
          <span className="vital-value">{vitals?.temperature || '--'}°F</span>
        </div>
      </div>

      <div className="vital-item normal">
        <span className="vital-icon">🫁</span>
        <div className="vital-info">
          <span className="vital-label">Respiratory Rate</span>
          <span className="vital-value">{vitals?.respiratoryRate || '--'} BPM</span>
        </div>
      </div>

      <div className="vital-item normal">
        <span className="vital-icon">🍯</span>
        <div className="vital-info">
          <span className="vital-label">Blood Glucose</span>
          <span className="vital-value">{vitals?.bloodGlucose || '--'} mg/dL</span>
        </div>
      </div>

      <div className="vitals-timestamp">
        Last updated: {vitals?.timestamp || '--'}
      </div>


    </div>
  );
};

export default PatientVitals;
