// EventDetailPage.js
function EventDetailPage({ eventId }) {
  const [event, setEvent] = React.useState(null);
  const [attendees, setAttendees] = React.useState([]);
  const [isHost, setIsHost] = React.useState(false);
  const [alreadyRequested, setAlreadyRequested] = React.useState(false);
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
      .then(data => {
        setAttendees(data);
        setAlreadyRequested(data.some(p => p.user_id == userId && p.status === 'request_pending' || p.status === 'confirmed'));
      });
  }, [eventId, userId]);

  function handleRequestToJoin(eventId) {
    fetch(`http://localhost:3001/api/events/${eventId}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: localStorage.getItem("user_id") })
    })
    .then(res => res.json())
    .then(data => {
      alert("Request sent!");
      setAlreadyRequested(true);
    });
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

  function getStatusColor(status) {
    if (status === 'confirmed') return 'text-green-600';
    if (status === 'request_pending' || status === 'invitation_pending') return 'text-yellow-600';
    return 'text-red-500';
  }

  function formatStatus(status) {
    switch (status) {
      case 'request_pending': return 'Request Pending';
      case 'invitation_pending': return 'Invitation Pending';
      case 'request_declined': return 'Request Declined';
      case 'invitation_declined': return 'Invitation Declined';
      case 'confirmed': return 'Confirmed';
      default: return status;
    }
  }

  function handleDeleteEvent() {
    if (confirm("Are you sure you want to delete this event?")) {
      fetch(`http://localhost:3001/api/events/${eventId}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
        alert("Event deleted.");
        window.location.hash = "#calendar";
      });
    }
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
          <h3 className="font-semibold text-lg mb-2">Attendees</h3>
          {(isHost ? attendees : attendees.filter(p => p.status === 'confirmed'))
            .map((p, i) => (
              <div key={i} className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <img src={p.avatar_url || '/default.png'} className="w-6 h-6 rounded-full" />
                  <span>{p.username}</span>
                </div>
                {isHost && (
                  <span className={`text-sm ${getStatusColor(p.status)}`}>
                    {formatStatus(p.status)}
                  </span>
                )}
              </div>
          ))}
        </div>

        {isHost ? (
          <div className="mt-4">
            <button className="bg-[#e3bfa2] px-4 py-2 rounded text-white">
              Edit Event (Coming Soon)
            </button>
            <div className="flex gap-2 mt-4">
              <button className="bg-[#e3bfa2] px-4 py-2 rounded text-white">
                Edit Event (Coming Soon)
              </button>
              <button
                onClick={handleDeleteEvent}
                className="bg-red-500 px-4 py-2 rounded text-white"
              >
                Delete Event
              </button>
            </div>
          </div>       
        ) : (
          alreadyRequested ? (
            <button className="button-disabled w-full mt-4" disabled>
              Already Requested to Join
            </button>
          ) : (
            <button
              onClick={() => handleRequestToJoin(eventId)}
              className="button-primary w-full mt-4"
            >
              + Request to Join
            </button>
          )
        )}
      </div>

      <Navigation />
    </div>
  );
}

window.EventDetailPage = EventDetailPage;
