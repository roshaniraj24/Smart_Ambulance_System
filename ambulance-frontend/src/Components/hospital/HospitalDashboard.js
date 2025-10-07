import React, { useEffect, useState } from 'react';
import BedCapacity from './BedCapacity';
import IncomingPatients from './IncomingPatients';

const HospitalDashboard = () => {
  const [capacity, setCapacity] = useState({
    icu: { occupied: 6, total: 10, percentage: 60 },
    general: { occupied: 22, total: 40, percentage: 55 },
    emergency: { occupied: 3, total: 8, percentage: 38 },
  });
  const [incoming, setIncoming] = useState([
    { id: 'AMB-201', name: 'Jane Doe', condition: 'Trauma', eta: 8, priority: 'High' },
    { id: 'AMB-087', name: 'Michael Chan', condition: 'Cardiac', eta: 15, priority: 'Critical' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCapacity(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const nextIcu = Math.max(0, Math.min(prev.icu.total, prev.icu.occupied + delta));
        const nextGeneral = Math.max(0, Math.min(prev.general.total, prev.general.occupied + (Math.random() > 0.5 ? 1 : 0)));
        const nextEmergency = Math.max(0, Math.min(prev.emergency.total, prev.emergency.occupied + (Math.random() > 0.7 ? 1 : -1)));
        return {
          icu: { occupied: nextIcu, total: prev.icu.total, percentage: Math.round((nextIcu / prev.icu.total) * 100) },
          general: { occupied: nextGeneral, total: prev.general.total, percentage: Math.round((nextGeneral / prev.general.total) * 100) },
          emergency: { occupied: nextEmergency, total: prev.emergency.total, percentage: Math.round((nextEmergency / prev.emergency.total) * 100) },
        };
      });

      setIncoming(prev => {
        const updated = prev.map(p => ({ ...p, eta: Math.max(0, p.eta - 1) }));
        // Occasionally add a new incoming ambulance
        if (Math.random() > 0.8) {
          updated.push({
            id: `AMB-${Math.floor(Math.random() * 900 + 100)}`,
            name: 'New Patient',
            condition: 'Respiratory',
            eta: Math.floor(Math.random() * 20 + 5),
            priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)]
          });
        }
        return updated.slice(-6);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hospital-dashboard">
      <div className="dashboard-grid">
        <div className="card">
          <h3>Bed Capacity</h3>
          <BedCapacity capacity={capacity} />
        </div>
        <div className="card">
          <h3>Incoming Ambulances</h3>
          <IncomingPatients patients={incoming} />
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;


