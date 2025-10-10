import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayerF } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '100vh' };
const center = { lat: 25.4683, lng: 81.8546 };
const libraries = ['visualization'];


const heatmapOptions = {
  radius: 40, 
  dissipating: true,
};

function ComplaintHeatmap({ complaints }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyB1zC3WcwEN2pBqQWlw6tD1F9Z45cZ1pzo",
    libraries,
  });

  const heatmapData = useMemo(() => {
    if (isLoaded && complaints) {
     
      return complaints.map(complaint => ({
        location: new window.google.maps.LatLng(complaint.lat, complaint.lng),
        weight: complaint.weight,
      }));
    }
    return [];
  }, [isLoaded, complaints]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      <HeatmapLayerF
        data={heatmapData}
        options={heatmapOptions} 
      />
    </GoogleMap>
  );
}

export default React.memo(ComplaintHeatmap);