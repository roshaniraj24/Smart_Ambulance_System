import React from 'react';

const RouteMap = ({ trip }) => {
  return (
    <div className="route-map">
      <div className="map-placeholder">
        <div className="map-icon">🗺️</div>
        <p>Route Navigation</p>
        {trip && (
          <div className="route-details">
            <p>From: {trip.pickupAddress}</p>
            <p>To: {trip.hospitalName}</p>
            <p>ETA: {trip.eta} min</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteMap;
