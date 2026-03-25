import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // CRITICAL: The map breaks without this

// Dictionary to convert Pincodes to Lat/Lng coordinates
const PINCODE_COORDINATES = {
  600020: [12.9960, 80.2540], // Chennai South
  625001: [9.9252, 78.1198],  // Madurai
  632014: [12.9692, 79.1559], // Vellore
  632001: [12.9165, 79.1325], // Vellore 2
  632004: [12.9465, 79.1425], // Vellore 3
};

// Default center of the map (Tamil Nadu)
const MAP_CENTER = [11.1271, 78.6569];

export default function OutbreakMap({ alerts }) {
  return (
    // We use a clean, light-themed basemap so the red/yellow alerts pop out
    <MapContainer 
      center={MAP_CENTER} 
      zoom={7} 
      className="w-full h-full rounded-[16px] z-0"
      style={{ minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {alerts.map((alert, index) => {
        // Look up the coordinates, fallback to center if unknown
        const coords = PINCODE_COORDINATES[alert.pincode] || MAP_CENTER;
        
        // Match the circle color to the AI Alert level
        const alertColor = alert.color === 'red' ? '#EF4444' : '#F59E0B';

        return (
          <CircleMarker
            key={index}
            center={coords}
            radius={alert.color === 'red' ? 24 : 16} // Critical alerts are bigger
            pathOptions={{
              color: alertColor,
              fillColor: alertColor,
              fillOpacity: 0.4,
              weight: 2
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <span className="font-bold">{alert.disease} ({alert.level})</span>
            </Tooltip>
            
            <Popup>
              <div className="p-1">
                <h4 className={`font-bold text-sm mb-1 ${alert.color === 'red' ? 'text-red-700' : 'text-yellow-700'}`}>
                  {alert.disease} Alert
                </h4>
                <p className="text-xs text-gray-600 mb-2">Pincode: <b>{alert.pincode}</b></p>
                <p className="text-xs">{alert.message}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}