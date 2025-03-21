/*global google*/
import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, DrawingManager, Polygon, InfoWindow, Autocomplete, Marker } from '@react-google-maps/api';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 17.5505,
  lng: 78.1658,
};

function MapComponent() {
  const [polygonData, setPolygonData] = useState({ area: 0.0, perimeter: 0.0 });
  const [unit, setUnit] = useState('meters');
  const [showForm, setShowForm] = useState(false);
  const [polygonDetails, setPolygonDetails] = useState({
    name: '',
    phone: '',
    email: '',
    surveyNo: '',
    east_Photo: null,
    west_Photo: null,
    north_Photo: null,
    south_Photo: null,
  });
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [fetchedPolygons, setFetchedPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const polygonRef = useRef(null);
  const undoStack = useRef([]);
  const [loading, setLoading] = useState(false);
  const [isInfoBoxOpen, setIsInfoBoxOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [mapCenter, setMapCenter] = useState(center);
  const [markerPosition, setMarkerPosition] = useState(null);
  const autocompleteRef = useRef(null);
  const [mapType, setMapType] = useState('satellite');

  const photos = selectedPolygon
    ? [
        selectedPolygon.east_Photo,
        selectedPolygon.west_Photo,
        selectedPolygon.north_Photo,
        selectedPolygon.south_Photo,
      ].filter((photo) => photo)
    : [];

  const handlePhotoClick = (index) => {
    setPhotoIndex(index);
    setIsLightboxOpen(true);
  };
  useEffect(() => {
    setMapType('satellite'); // Ensure map is in satellite view when component mounts
  }, []);
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setPolygonDetails((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

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

    const formData = new FormData();
    formData.append('name', polygonDetails.name);
    formData.append('phone', polygonDetails.phone);
    formData.append('email', polygonDetails.email);
    formData.append('surveyNo', polygonDetails.surveyNo);
    formData.append('coordinates', JSON.stringify({
      type: 'Polygon',
      coordinates: [geoJsonCoordinates],
    }));

    if (polygonDetails.east_Photo) formData.append('east_Photo', polygonDetails.east_Photo);
    if (polygonDetails.west_Photo) formData.append('west_Photo', polygonDetails.west_Photo);
    if (polygonDetails.north_Photo) formData.append('north_Photo', polygonDetails.north_Photo);
    if (polygonDetails.south_Photo) formData.append('south_Photo', polygonDetails.south_Photo);

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/polygons', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        const fetchResponse = await fetch('http://localhost:5000/api/polygons');
        const fetchData = await fetchResponse.json();
        setFetchedPolygons(fetchData);
        window.location.reload();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving polygon:', error);
      alert('Failed to save polygon data.');
    } finally {
      setLoading(false);
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

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMapCenter(location);
        setMarkerPosition(location);
      } else {
        alert("No location found for the selected place.");
      }
    }
  };

  const clearSearch = () => {
    setMapCenter(center);
    setMarkerPosition(null);
  };

  const toggleMapType = () => {
    setMapType((prevMapType) => (prevMapType === 'satellite' ? 'roadmap' : 'satellite'));
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyA_Z1_l75AWkfTNqvjX5Sp0wMejwP33ZTo"
      libraries={['drawing', 'geometry', 'places']}
      loadingElement={<div>Loading...</div>}
    >
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: 4, position: 'relative' }}>
          <div style={{ position: 'absolute', top: '40px', left: '5px', zIndex: 1 }}>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                placeholder="Search for a location"
                style={{
                  width: '300px',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                }}
              />
            </Autocomplete>
            <button
              onClick={clearSearch}
              style={{
                marginLeft: '3px',
                marginTop: '5px',
                padding: '10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Clear Search
            </button>
            <button
              onClick={toggleMapType}
              style={{
                marginLeft: '3px',
                marginTop: '5px',
                padding: '10px',
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {mapType === 'satellite' ? 'Map' : 'Satellite'}
            </button>
          </div>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={18}
            mapTypeId={mapType}
            options={{
              mapTypeControl: false, // Disable default Map/Satellite button
            }} // Set the map type based on state
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
            {selectedPolygon && infoWindowPosition && isInfoBoxOpen && (
              <InfoWindow
                position={infoWindowPosition}
                onCloseClick={handleCloseInfoBox}
              >
                <div style={{ maxWidth: '300px' }}>
                  <h3>{selectedPolygon.name}</h3>
                  <p><strong>Phone:</strong> {selectedPolygon.phone}</p>
                  <p><strong>Survey No:</strong> {selectedPolygon.surveyNo}</p>
                  <div style={{ marginTop: '10px' }}>
                    <h4>Property Photos</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {selectedPolygon.east_Photo && (
                        <div>
                          <p><strong>East Side:</strong></p>
                          <img
                            src={`http://localhost:5000/${selectedPolygon.east_Photo}`}
                            alt="East View"
                            style={{ width: '120px', height: '90px', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => handlePhotoClick(0)}
                          />
                        </div>
                      )}
                      {selectedPolygon.west_Photo && (
                        <div>
                          <p><strong>West Side:</strong></p>
                          <img
                            src={`http://localhost:5000/${selectedPolygon.west_Photo}`}
                            alt="West View"
                            style={{ width: '120px', height: '90px', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => handlePhotoClick(1)}
                          />
                        </div>
                      )}
                      {selectedPolygon.north_Photo && (
                        <div>
                          <p><strong>North Side:</strong></p>
                          <img
                            src={`http://localhost:5000/${selectedPolygon.north_Photo}`}
                            alt="North View"
                            style={{ width: '120px', height: '90px', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => handlePhotoClick(2)}
                          />
                        </div>
                      )}
                      {selectedPolygon.south_Photo && (
                        <div>
                          <p><strong>South Side:</strong></p>
                          <img
                            src={`http://localhost:5000/${selectedPolygon.south_Photo}`}
                            alt="South View"
                            style={{ width: '120px', height: '90px', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => handlePhotoClick(3)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        </div>
        <div style={{ flex: 1, padding: '20px', borderLeft: '1px solid #ccc', overflowY: 'auto' }}>
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
          <div>
            <h4 style={{ textAlign: 'center' }}>Polygon Data</h4>
            <p>
              <strong>Area:</strong>{' '}
              {unit === 'meters'
                ? (polygonData.area * 0.000247105).toFixed(2) + ' Acres'
                : (polygonData.area * 1.19599).toFixed(2) + ' sq yards'}
            </p>
            <p>
              <strong>Perimeter:</strong>{' '}
              {unit === 'meters'
                ? polygonData.perimeter.toFixed(2) + ' meters'
                : polygonData.perimeter.toFixed(2) + ' yards'}
            </p>
          </div>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer', width: '100%', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Add to Map
          </button>
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
              <div style={{ marginTop: '20px' }}>
                <h4>Upload Property Photos</h4>
                <div>
                  <label>East Side Photo:</label>
                  <input
                    type="file"
                    name="east_Photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'block', width: '100%', margin: '10px 0' }}
                  />
                </div>
                <div>
                  <label>West Side Photo:</label>
                  <input
                    type="file"
                    name="west_Photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'block', width: '100%', margin: '10px 0' }}
                  />
                </div>
                <div>
                  <label>North Side Photo:</label>
                  <input
                    type="file"
                    name="north_Photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'block', width: '100%', margin: '10px 0' }}
                  />
                </div>
                <div>
                  <label>South Side Photo:</label>
                  <input
                    type="file"
                    name="south_Photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'block', width: '100%', margin: '10px 0' }}
                  />
                </div>
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
                  marginTop: '20px'
                }}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
      {isLightboxOpen && (
        <Lightbox
          mainSrc={`http://localhost:5000/${photos[photoIndex]}`}
          nextSrc={`http://localhost:5000/${photos[(photoIndex + 1) % photos.length]}`}
          prevSrc={`http://localhost:5000/${photos[(photoIndex + photos.length - 1) % photos.length]}`}
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + photos.length - 1) % photos.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % photos.length)}
        />
      )}
    </LoadScript>
  );
}

export default MapComponent;