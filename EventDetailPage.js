// EventDetailPage.js
function EventDetailPage({ eventId }) {
  const [event, setEvent] = React.useState(null);
  const [attendees, setAttendees] = React.useState([]);
  const [isHost, setIsHost] = React.useState(false);
  const userId = localStorage.getItem("user_id");

  React.useEffect(() => {
    fetch(`http://localhost:3001/api/events/${eventId}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data);
        if (data.host_id == userId) setIsHost(true);
      });

    fetch(`http://localhost:3001/api/events/${eventId}/attendees`)
      .then(res => res.json())
      .then(data => setAttendees(data));
  }, [eventId]);

  function formatStatus(status) {
    switch (status) {
      case "pending": return "Invitation Pending";
      case "declined": return "Invitation Declined";
      case "confirmed": return "Confirmed";
      default: return "Unknown";
    }
  }

  function handleStatusChange(username, newStatus) {
    fetch(`http://localhost:3001/api/events/${eventId}/attendees`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, status: newStatus })
    })
    .then(res => res.json())
    .then(() => {
      setAttendees(prev =>
        prev.map(a => a.username === username ? { ...a, status: newStatus } : a)
      );
    });
  }

  if (!event) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#f3e7db]">
      <div className="bg-black text-white p-4 text-lg font-semibold">
        Event Details
      </div>

      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold">{event.title}</h2>
        <div><strong>Host:</strong> {event.host_name || 'Anonymous'}</div>
        <div><strong>Location:</strong> {event.location}</div>
        <div><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</div>
        <div><strong>Time:</strong> {event.time_range}</div>
        <div><strong>Dining Type:</strong> {event.dining_type}</div>

        <div className="mt-4">
          <strong>Attendees:</strong>
          <ul className="list-disc list-inside">
            {attendees.map((a, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{a.username} - {formatStatus(a.status)}</span>
                {isHost && a.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(a.username, 'confirmed')}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(a.username, 'declined')}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {isHost ? (
          <div className="mt-4">
            <button className="bg-[#e3bfa2] px-4 py-2 rounded text-white">
              Edit Event (Coming Soon)
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <button className="bg-[#d3b4a4] px-4 py-2 rounded text-white">
              Request to Join
            </button>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}

window.EventDetailPage = EventDetailPage;
