function EventMapPage() {
  const mapRef = React.useRef(null);
  const userId = localStorage.getItem("user_id");

  React.useEffect(() => {
    if (!mapRef.current || mapRef.current._leaflet_id) return;

    const map = L.map(mapRef.current).setView([39.9545, -75.1994], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    fetch(`http://localhost:3001/api/users/${userId}/visible-events`)
      .then(res => res.json())
      .then(events => {
        events.forEach(event => {
          if (!event.latitude || !event.longitude) return;

          const icon = L.icon({
            iconUrl: event.icon_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            iconSize: [36, 36],
            iconAnchor: [18, 36],
          });

          L.marker([event.latitude, event.longitude], { icon })
            .addTo(map)
            .on('click', () => {
              window.location.hash = `#event/${event.id}`;
            });
        });
      });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-black text-white p-3 pl-4 text-md font-medium">
        Event Page Map
      </div>

      <div ref={mapRef} className="flex-grow w-full" />

      <Navigation />
    </div>
  );
}
