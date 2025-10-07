import React from 'react';

const TripInfo = ({ trip }) => {
  if (!trip) {
    return <div className="trip-info">No active trip</div>;
  }

  return (
    <div className="trip-info">
      <div className="trip-detail">
        <strong>Patient:</strong> {trip.patientName}
      </div>
      <div className="trip-detail">
        <strong>Priority:</strong> {trip.priority}
      </div>
      <div className="trip-detail">
        <strong>Pickup:</strong> {trip.pickupAddress}
      </div>
      <div className="trip-detail">
        <strong>Destination:</strong> {trip.hospitalName}
      </div>
      <div className="trip-detail">
        <strong>ETA:</strong> {trip.eta} minutes
      </div>
      <div className="trip-detail">
        <strong>Status:</strong> {trip.status}
      </div>
    </div>
  );
};

export default TripInfo;
