function LocationPage({ locationId = ""}) {
  const [events, setEvents] = React.useState([]);
  const [requestSentMap, setRequestSentMap] = React.useState({});
  const userId = localStorage.getItem("user_id");

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
    <div className="flex flex-col min-h-screen pb-16 bg-[#fef5f1]">
      <div className="bg-black text-white p-4 text-lg font-semibold">
        Events at: {locationId.replace(/_/g, ' ')}
      </div>

      <div className="p-4 flex flex-col gap-4">
        <button
          onClick={() => window.location.hash = `#event/${locationId}/create`}
          className="button-primary"
        >
          + Create Your Table
        </button>

        <button className="button-secondary">🤍 Add Favorites</button>

        <div className="font-bold text-lg">Public Tables</div>

        {events.length === 0 ? (
          <div className="text-sm text-gray-700">No events at this location yet.</div>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className="bg-[#f3dbc3] p-4 rounded-xl shadow-sm">
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
                {requestSentMap[ev.id] ? "✅ Request Sent" : "+ Request To Join"}
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
