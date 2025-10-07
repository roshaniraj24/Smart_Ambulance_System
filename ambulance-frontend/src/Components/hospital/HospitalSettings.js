import React, { useState } from 'react';

const HospitalSettings = () => {
  const [form, setForm] = useState({
    hospitalName: 'Central Medical Center',
    notificationEmail: 'alerts@centralmed.example',
    maxQueue: 6,
    autoAcceptThreshold: 70,
    theme: 'teal'
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSave = (e) => {
    e.preventDefault();
    localStorage.setItem('hospitalSettings', JSON.stringify(form));
    alert('Settings saved');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Hospital Settings</h3>
      </div>
      <form onSubmit={onSave} className="settings-form">
        <div className="form-group">
          <label className="form-label" htmlFor="hospitalName">Hospital Name</label>
          <input className="form-input" id="hospitalName" name="hospitalName" value={form.hospitalName} onChange={onChange} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="notificationEmail">Notification Email</label>
          <input className="form-input" id="notificationEmail" name="notificationEmail" value={form.notificationEmail} onChange={onChange} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="maxQueue">Max Incoming Queue</label>
          <input className="form-input" type="number" id="maxQueue" name="maxQueue" value={form.maxQueue} onChange={onChange} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="autoAcceptThreshold">Auto-Accept Threshold (%)</label>
          <input className="form-input" type="number" id="autoAcceptThreshold" name="autoAcceptThreshold" value={form.autoAcceptThreshold} onChange={onChange} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="theme">Theme</label>
          <select id="theme" name="theme" className="form-select" value={form.theme} onChange={onChange}>
            <option value="teal">Teal</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Save Settings</button>
      </form>
    </div>
  );
};

export default HospitalSettings;





