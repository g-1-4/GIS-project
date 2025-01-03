/* global google */
import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, DrawingManager, Polygon, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 17.5505,
  lng: 78.1658,
};

function MapComponent() {
  const [polygonData, setPolygonData] = useState({
    area: 0.0,
    perimeter: 0.0,
  });
  const [unit, setUnit] = useState('meters');
  const [showForm, setShowForm] = useState(false);
  const [polygonDetails, setPolygonDetails] = useState({
    name: '',
    phone: '',
    email: '',
    surveyNo: '',
  });
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [fetchedPolygons, setFetchedPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null); 
  const [infoWindowPosition, setInfoWindowPosition] = useState(null); 
  const polygonRef = useRef(null);
  const undoStack = useRef([]);
  const [loading, setLoading] = useState(false); 
  const [isInfoBoxOpen, setIsInfoBoxOpen] = useState(false);


  useEffect(() => {
    const fetchPolygons = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/polygons');
        const data = await response.json();
        setFetchedPolygons(data);
      } catch (error) {
        console.error('Error fetching polygons:', error);
      }
    };

    fetchPolygons();
  }, []);

  const handlePolygonClick = (polygonId) => {
    const polygon = fetchedPolygons.find((poly) => poly.id === polygonId);
    if (!polygon) return;
  
    
    const path = polygon.coordinates.coordinates[0].map(([lng, lat]) => new google.maps.LatLng(lat, lng));
  
    
    const area = google.maps.geometry.spherical.computeArea(path);
    const perimeter = google.maps.geometry.spherical.computeLength(path);
  
    
    setPolygonData({ area, perimeter });
  
    
    setSelectedPolygon(polygon);
    setInfoWindowPosition({
      lat: polygon.coordinates.coordinates[0][0][1],
      lng: polygon.coordinates.coordinates[0][0][0],
    });
    setIsInfoBoxOpen(true);
  };
  
  
  
  const handleCloseInfoBox = () => {
    setIsInfoBoxOpen(false); 
    setPolygonData({ area: 0.0, perimeter: 0.0 }); 
  };
  
  

  const handleOnPolygonComplete = (polygon) => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }
  
    polygonRef.current = polygon;
  
    const path = polygon.getPath().getArray();
    const coordinates = path.map((latLng) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));
  
    
    const latLngPath = path.map((latLng) => new google.maps.LatLng(latLng.lat(), latLng.lng()));
  
    
    let isOverlapping = false;
    fetchedPolygons.forEach((existingPolygon) => {
      const existingLatLngPath = existingPolygon.coordinates.coordinates[0].map(
        ([lng, lat]) => new google.maps.LatLng(lat, lng)
      );
  
      latLngPath.forEach((point) => {
        if (google.maps.geometry.poly.containsLocation(point, new google.maps.Polygon({ paths: existingLatLngPath }))) {
          isOverlapping = true;
        }
      });
    });
  
    if (isOverlapping) {
      alert('Error: The new polygon overlaps with an existing land parcel.');
      polygon.setMap(null); 
      return;
    }
  
    const area = google.maps.geometry.spherical.computeArea(polygon.getPath());
    const perimeter = google.maps.geometry.spherical.computeLength(polygon.getPath());
  
    setPolygonCoordinates(coordinates);
    setPolygonData({ area, perimeter });
  
    undoStack.current.push([...coordinates]);
  
    const updatePolygonData = () => {
      const updatedPath = polygon.getPath().getArray();
      const updatedCoordinates = updatedPath.map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));
  
      const updatedArea = google.maps.geometry.spherical.computeArea(polygon.getPath());
      const updatedPerimeter = google.maps.geometry.spherical.computeLength(polygon.getPath());
  
      setPolygonCoordinates(updatedCoordinates);
      setPolygonData({ area: updatedArea, perimeter: updatedPerimeter });
  
      undoStack.current.push([...updatedCoordinates]);
    };
  
    polygon.getPath().addListener('set_at', updatePolygonData);
    polygon.getPath().addListener('insert_at', updatePolygonData);
    polygon.getPath().addListener('remove_at', updatePolygonData);
  };
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPolygonDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!/^\S+@\S+\.\S+$/.test(polygonDetails.email)) {
      alert('Please enter a valid email address.');
      return false;
    }
    if (!/^\d{10}$/.test(polygonDetails.phone)) {
      alert('Please enter a valid 10-digit phone number.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (polygonCoordinates.length === 0) {
      alert('Please draw a polygon before submitting the form.');
      return;
    }

    if (!validateForm()) return;

    const geoJsonCoordinates = polygonCoordinates.map((coord) => [coord.lng, coord.lat]);

    if (
      geoJsonCoordinates.length > 0 &&
      (geoJsonCoordinates[0][0] !== geoJsonCoordinates[geoJsonCoordinates.length - 1][0] ||
        geoJsonCoordinates[0][1] !== geoJsonCoordinates[geoJsonCoordinates.length - 1][1])
    ) {
      geoJsonCoordinates.push(geoJsonCoordinates[0]);
    }

    const data = {
      ...polygonDetails,
      coordinates: {
        type: 'Polygon',
        coordinates: [geoJsonCoordinates],
      },
    };

    try {
      setLoading(true); 
      const response = await fetch('http://localhost:5000/api/polygons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving polygon:', error);
      alert('Failed to save polygon data.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleChangeUnits = () => {
    setUnit((prevUnit) => (prevUnit === 'meters' ? 'yards' : 'meters'));
  };

  const handleDeletePolygon = () => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      setPolygonData({ area: 0.0, perimeter: 0.0 });
      setPolygonCoordinates([]);
    }
  };

  const handleUndo = () => {
    if (undoStack.current.length > 1) {
      undoStack.current.pop();
      const lastCoordinates = undoStack.current[undoStack.current.length - 1];
      setPolygonCoordinates(lastCoordinates);

      if (polygonRef.current) {
        const path = lastCoordinates.map((coord) => new google.maps.LatLng(coord.lat, coord.lng));
        polygonRef.current.setPath(path);
      }
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={['drawing', 'geometry']}
    >
      
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Map Container */}
        <div style={{ flex: 4, position: 'relative' }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={18}
            mapTypeId="satellite"
          >
            <DrawingManager
              onPolygonComplete={handleOnPolygonComplete}
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  drawingModes: ['polygon'],
                },
                polygonOptions: {
                  fillColor: '#000',
                  fillOpacity: 0.5,
                  strokeWeight: 1,
                  editable: true,
                  draggable: true,
                },
              }}
            />
            {/* Display fetched polygons */}
            {fetchedPolygons.map((polygon, index) => (
              <Polygon
                key={index}
                paths={polygon.coordinates.coordinates[0].map(([lng, lat]) => ({
                  lat,
                  lng,
                }))}
                options={{
                  fillColor: 'yellow',
                  fillOpacity: 0.6,
                  strokeColor: 'yellow',
                  strokeWeight: 2,
                }}
                onClick={() => handlePolygonClick(polygon.id)}
              />
            ))}
            {/* InfoWindow for clicked polygon */}
            {selectedPolygon && infoWindowPosition && (
              <InfoWindow position={infoWindowPosition} onCloseClick={() => setSelectedPolygon(null)}>
                <div>
                  <p><strong>Name:</strong> {selectedPolygon.name}</p>
                  <p><strong>Phone:</strong> {selectedPolygon.phone}</p>
                  <p><strong>Survey No:</strong> {selectedPolygon.surveyNo}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>

        {/* Controls and Form */}
        <div style={{ flex: 1, padding: '20px', borderLeft: '1px solid #ccc', overflowY: 'auto' }}>
          {/* Buttons */}
          <div>
            <button
              onClick={handleChangeUnits}
              style={{ margin: '5px 0', padding: '10px', width: '100%', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Change Units to {unit === 'meters' ? 'Yards' : 'Meters'}
            </button>
            <button
              onClick={handleDeletePolygon}
              style={{ margin: '5px 0', padding: '10px', width: '100%', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Delete Polygon
            </button>
            <button
              onClick={handleUndo}
              style={{ margin: '5px 0', padding: '10px', width: '100%', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Undo
            </button>
          </div>

          {/* Polygon Data */}
          <div>
            <h4 style={{ textAlign: 'center' }}>Polygon Data</h4>
            <p>
              <strong>Area:</strong>{' '}
              {unit === 'meters'
                ? `${(polygonData.area * 0.000247105).toFixed(2)} Acres`
                : `${(polygonData.area * 1.19599).toFixed(2)} sq yards`}
            </p>
            <p>
              <strong>Perimeter:</strong>{' '}
              {unit === 'meters'
                ? `${polygonData.perimeter.toFixed(2)} meters`
                : `${polygonData.perimeter.toFixed(2)} yards`}
            </p>
          </div>

          {/* Form Button */}
          <button
            onClick={() => setShowForm((prev) => !prev)}
            style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer', width: '100%', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Add to Map
          </button>

          {/* Form Section */}
          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={polygonDetails.name}
                  onChange={handleInputChange}
                  required
                  style={{ display: 'block', width: '100%', margin: '10px 0', padding: '5px' }}
                />
              </div>
              <div>
                <label>Phone Number:</label>
                <input
                  type="tel"
                  name="phone"
                  value={polygonDetails.phone}
                  onChange={handleInputChange}
                  required
                  style={{ display: 'block', width: '100%', margin: '10px 0', padding: '5px' }}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={polygonDetails.email}
                  onChange={handleInputChange}
                  required
                  style={{ display: 'block', width: '100%', margin: '10px 0', padding: '5px' }}
                />
              </div>
              <div>
                <label>Survey Number:</label>
                <input
                  type="text"
                  name="surveyNo"
                  value={polygonDetails.surveyNo}
                  onChange={handleInputChange}
                  required
                  style={{ display: 'block', width: '100%', margin: '10px 0', padding: '5px' }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  backgroundColor: 'blue',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  width: '100%',
                }}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </LoadScript>
  );
}

export default MapComponent;
