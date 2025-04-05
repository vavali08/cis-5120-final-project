function EventMapPage() {
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    if (mapRef.current && !mapRef.current._leaflet_id) {
      const map = L.map(mapRef.current).setView([39.9545, -75.1994], 17); // Centered near UPenn

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      const greenIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const blueIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/147/147142.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([39.9552, -75.1996], { icon: greenIcon }).addTo(map); // Dunkin'
      L.marker([39.9532, -75.2004], { icon: blueIcon }).addTo(map);  // Smokey Joe's
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="text-white p-4 text-lg font-semibold">
        Event Page Map
      </div>

      <div ref={mapRef} className="flex-grow w-full h-full" />

      <Navigation />
    </div>
  );
}
