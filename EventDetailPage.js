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
        setAlreadyRequested(
          data.some(
            p =>
              p.user_id == userId &&
              (p.status === "request_pending" || p.status === "confirmed")
          )
        );
      });
  }, [eventId, userId]);

  function handleRequestToJoin(eventId) {
    fetch(`http://localhost:3001/api/events/${eventId}/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    })
      .then(res => res.json())
      .then(() => {
        alert("Request sent!");
        setAlreadyRequested(true);
      });
  }

  function handleStatusChange(username, newStatus) {
    fetch(`http://localhost:3001/api/events/${eventId}/attendees`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, status: newStatus })
    })
      .then(res => res.json())
      .then(() => {
        setAttendees(prev =>
          prev.map(a =>
            a.username === username ? { ...a, status: newStatus } : a
          )
        );
      });
  }

  function handleDeleteEvent() {
    if (confirm("Are you sure you want to delete this event?")) {
      fetch(`http://localhost:3001/api/events/${eventId}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(() => {
          alert("Event deleted.");
          window.location.hash = "#calendar";
        });
    }
  }

  function getStatusClass(status) {
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "request_pending") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  }

  function formatStatus(status) {
    switch (status) {
      case "request_pending":
        return "Request Pending";
      case "invitation_pending":
        return "Invitation Pending";
      case "request_declined":
        return "Request Declined";
      case "invitation_declined":
        return "Invitation Declined";
      case "confirmed":
        return "Confirmed";
      default:
        return status;
    }
  }

  if (!event) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="text-center py-6 text-xl font-bold text-gray-800">
        Event Details
      </div>

      <div className="bg-blue-50 p-6 space-y-4 mx-4 rounded-xl shadow max-w-2xl self-center">
        <h2 className="text-xl font-bold">{event.title}</h2>
        <div className="text-gray-700">
          <span className="font-semibold">Host:</span> {event.host_name || 'Anonymous'}
        </div>
        <div className="text-gray-700">
          <span className="font-semibold">Location:</span> {event.location}
        </div>
        <div className="text-gray-700">
          <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
        </div>
        <div className="text-gray-700">
          <span className="font-semibold">Time:</span> {event.time_range}
        </div>
        <div className="text-gray-700">
          <span className="font-semibold">Dining Type:</span> {event.dining_type}
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">Attendees</h3>
          {(isHost ? attendees : attendees.filter(p => p.status === 'confirmed')).map((p, i) => (
            <div key={i} className="flex justify-between items-center p-3 mb-2 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                <img src={p.avatar_url || '/default.png'} className="w-6 h-6 rounded-full" />
                <span>{p.username}</span>
              </div>
              {isHost && (
                <span className={`text-sm px-2 py-1 rounded-full ${getStatusClass(p.status)}`}>
                  {formatStatus(p.status)}
                </span>
              )}
            </div>
          ))}
        </div>

        {isHost ? (
          <div className="mt-4 space-y-2">
            <button className="bg-[#4a90e2] text-white font-semibold px-6 py-2 rounded-xl w-full shadow-sm">
              Edit Event (Coming Soon)
            </button>
            <button
              onClick={handleDeleteEvent}
              className="bg-red-500 text-white font-semibold px-6 py-2 rounded-xl w-full shadow-sm"
            >
              Delete Event
            </button>
          </div>
        ) : alreadyRequested ? (
          <button className="bg-yellow-100 text-yellow-700 font-semibold px-6 py-2 rounded-xl w-full shadow-sm mt-4" disabled>
            Already Requested to Join
          </button>
        ) : (
          <button
            onClick={() => handleRequestToJoin(eventId)}
            className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-xl mt-4 w-full shadow-sm"
          >
            + Request to Join
          </button>
        )}
      </div>

      <Navigation />
    </div>
  );
}

window.EventDetailPage = EventDetailPage;
