function EventMapPage() {
  const mapRef = React.useRef(null);
  const userId = localStorage.getItem("user_id");

  React.useEffect(() => {
    const map = L.map(mapRef.current).setView([39.9545, -75.1994], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add default markers
    defaultLocations.forEach(loc => {
      const icon = L.icon({
        iconUrl: loc.icon,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .on("click", () => {
          window.location.hash = `#location/${loc.id}`;
        });
    });

    // Add event locations from DB
    fetch(`http://localhost:3001/api/users/${userId}/events`)
      .then(res => res.json())
      .then(events => {
        events.forEach(event => {
          const marker = L.marker([event.latitude, event.longitude])
            .addTo(map)
            .on("click", () => {
              window.location.hash = `#event/${event.id}`;
            });
        });
      });
  }, []);
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="bg-black text-white p-3 pl-4 text-md font-medium">
        Event Page Map
      </div>
  
      <div ref={mapRef} className="flex-grow w-full z-0" />
  
      <div className="z-10">
        <Navigation />
      </div>
    </div>
  );
  
}

window.EventMapPage = EventMapPage;