import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { geocodeLocation } from '../utils/emergencyUtils';

const AIDispatchModal = ({ emergency, facility, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  // Custom icons
  const emergencyIcon = L.divIcon({
    className: 'custom-icon',
    html: `<div class="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg pulse"></div>`,
  });

  const facilityIcon = L.divIcon({
    className: 'custom-icon',
    html: `<div class="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>`,
  });

  // Add pulse animation style
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
      .pulse { animation: pulse 1.5s infinite; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Define the dispatchEmergency function
  const dispatchEmergency = async (emergencyId, facilityId) => {
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emergencyId, facilityId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create dispatch');
      }
    } catch (error) {
      console.error('Error dispatching emergency:', error);
      // Handle error (e.g., show a message)
    }
  };

  useEffect(() => {
    const initializeDispatch = async () => {
      try {
        // 1. Get coordinates from location if not available
        const coords = emergency.latitude && emergency.longitude
          ? { latitude: emergency.latitude, longitude: emergency.longitude }
          : await geocodeLocation(emergency.location);

        if (coords) {
          setCoordinates(coords);
          
          // 2. Find nearest facility
          const response = await fetch(
            `http://localhost:3001/api/facilities/nearest?type=${emergency.type}&latitude=${coords.latitude}&longitude=${coords.longitude}`
          );
          const facility = await response.json();
          
          if (facility) {
            setSelectedFacility(facility);
          }
        }
      } catch (error) {
        console.error('Error in AI dispatch:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDispatch();
  }, [emergency]);

  useEffect(() => {
    if (selectedFacility && !loading) {
      const autoConfirmTimer = setTimeout(() => {
        handleConfirmDispatch();
      }, 5000); // 5-second delay for user review

      return () => clearTimeout(autoConfirmTimer);
    }
  }, [selectedFacility, loading]);

  const handleConfirmDispatch = async () => {
    try {
      await dispatchEmergency(emergency.id, facility.id); // Call dispatch API
      onClose();
    } catch (error) {
      console.error('Error dispatching emergency:', error);
      // Handle error (e.g., show a message)
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-lg">AI is analyzing the emergency...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">AI Dispatch Recommendation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="font-semibold">Emergency Type: {emergency.type}</p>
          <p>Location: {emergency.location}</p>
          {selectedFacility && (
            <div className="mt-2 p-4 bg-blue-50 rounded">
              <h3 className="font-bold">Recommended Facility:</h3>
              <p>{selectedFacility.name}</p>
              <p>{selectedFacility.address}</p>
              <p>Distance: {Math.round(selectedFacility.distance * 10) / 10} km</p>
            </div>
          )}
        </div>

        {coordinates && (
          <div className="h-[400px] mb-4">
            <MapContainer
              center={[coordinates.latitude, coordinates.longitude]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
              <Marker
                position={[coordinates.latitude, coordinates.longitude]}
                icon={emergencyIcon}
              >
                <Popup>
                  <div className="font-bold">Emergency Location</div>
                  <div>{emergency.location}</div>
                </Popup>
              </Marker>

              {selectedFacility && (
                <Marker
                  position={[selectedFacility.latitude, selectedFacility.longitude]}
                  icon={facilityIcon}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{selectedFacility.name}</h3>
                      <p>{selectedFacility.address}</p>
                      <p className="text-sm text-gray-600">
                        Distance: {Math.round(selectedFacility.distance * 10) / 10} km
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ facilityId: selectedFacility?.id })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!selectedFacility}
          >
            Confirm AI Dispatch
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIDispatchModal; 