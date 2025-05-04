function LocationPage({ locationId = ""}) {
  const [events, setEvents] = React.useState([]);
  const [requestSentMap, setRequestSentMap] = React.useState({});
  const userId = localStorage.getItem("user_id");
  const location = defaultLocations.find(loc => loc.id === locationId);
  const locationName = location ? location.name : locationId.replace(/_/g, ' ');


  React.useEffect(() => {
    fetch(`http://localhost:3001/api/events/location/${locationId}`)
      .then((res) => res.json())
      .then(setEvents);
  }, [locationId]);

  function handleRequest(eventId) {
    fetch(`http://localhost:3001/api/events/${eventId}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    }).then(() => {
      setRequestSentMap(prev => ({ ...prev, [eventId]: true }));
    });
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-[#f1faee]">
<div className="relative">
  {location?.image && (
    <div className="w-full h-60">
      <img
        src={location.image}
        alt={locationName}
        className="w-full h-full object-cover"
      />
    </div>
  )}
  
  <div className="absolute top-0 left-0 right-0 bg-[#e0f0ff]/70 p-4 backdrop-blur-sm">
    <div className="text-black text-lg font-semibold">
      Events at: {locationName}
    </div>
  </div>
</div>


      <div className="p-4 flex flex-col gap-4">
        <button
          onClick={() => window.location.hash = `#event/${locationId}/create`}
          className="button-primary"
        >
            <div className="button-content">
              <img className="but-icon2" src="./icons/icon.png"></img>
              <p>Create Your Table</p>
            </div>
        </button>

        <button className="button-secondary">
          <div className="button-content">
              <img className="but-icon2" src="./icons/love.svg"></img>
              <p>Add To Favorites</p>
          </div>
        </button>

        <div className="font-bold text-lg">Public Tables</div>

        {events.length === 0 ? (
          <div className="text-sm text-gray-700">No events at this location yet.</div>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className="location-card">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold">{ev.title}</div>
                  <div className="text-sm text-gray-800">{ev.time_range} — {ev.dining_type}</div>
                  <div className="text-sm">Host: {ev.host_name || "Anonymous"}</div>
                </div>
                <span className="text-sm text-gray-600">{new Date(ev.date).toLocaleDateString()}</span>
              </div>

              <button
                className="mt-3 w-full button-primary disabled:opacity-60"
                onClick={() => handleRequest(ev.id)}
                disabled={requestSentMap[ev.id]}
              >
              <div className="button-content">
                <img className="but-icon2" src={requestSentMap[ev.id] ? "./icons/check.svg" : "./icons/icon.png"}></img>
                <p>{requestSentMap[ev.id] ? "Request Sent" : "Request To Join"}</p>
              </div>
              </button>
            </div>
          ))
        )}
      </div>

      <Navigation />
    </div>
  );
}

window.LocationPage = LocationPage;
