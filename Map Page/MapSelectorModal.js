function MapSelectorModal({ isOpen, onClose, onSelect }) {
    const mapRef = React.useRef(null);
  
    React.useEffect(() => {
      if (!isOpen || !mapRef.current) return;
  
      const map = L.map(mapRef.current).setView([39.9545, -75.1994], 15);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);
  
      defaultLocations.forEach(loc => {
        const icon = L.icon({
          iconUrl: loc.icon,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
  
        L.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .on("click", () => {
            onSelect({ name: loc.name, lat: loc.lat, lng: loc.lng });
            onClose();
          });
      });
  
      return () => map.remove();
    }, [isOpen]);
  
    if (!isOpen) return null;
  
    return (
      <div className="dialog-overlay">
        <div className="dialog">
          <div className="text-lg font-bold mb-2">Select a Location</div>
          <div ref={mapRef} style={{ height: "300px", width: "100%", borderRadius: "8px" }} />
          <button onClick={onClose} className="button-secondary mt-4 w-full">Cancel</button>
        </div>
      </div>
    );
  }
  window.MapSelectorModal = MapSelectorModal;
  