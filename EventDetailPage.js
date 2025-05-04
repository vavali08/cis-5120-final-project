function EventDetailPage({ eventId }) {
  const [event, setEvent] = React.useState(null);
  const [attendees, setAttendees] = React.useState([]);
  const [isHost, setIsHost] = React.useState(false);
  const [alreadyRequested, setAlreadyRequested] = React.useState(false);
  const [friends, setFriends] = React.useState([]);
  const [selectedFriend, setSelectedFriend] = React.useState(null);
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

    fetch(`http://localhost:3001/api/users/${userId}/friends`)
      .then(res => res.json())
      .then(data => setFriends(data));
  }, [eventId, userId]);

  function handleInviteFriend(friendId) {
    fetch(`http://localhost:3001/api/events/${eventId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: friendId })
    })
      .then(res => res.json())
      .then(() => window.location.reload());
  }

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

  function handleCancelRequest(eventId) {
    fetch(`http://localhost:3001/api/events/${eventId}/request/${userId}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        alert("Request cancelled.");
        setAlreadyRequested(false);
      });
  }

  function handleUpdateStatus(username, newStatus) {
    fetch(`http://localhost:3001/api/events/${eventId}/attendees`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, status: newStatus })
    })
      .then(res => res.json())
      .then(() => window.location.reload());
  }

  function handleRemoveAttendee(userId) {
    fetch(`http://localhost:3001/api/events/${eventId}/attendees/${userId}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => window.location.reload());
  }

  function getStatusClass(status) {
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "request_pending") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  }

  if (!event) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#f6fbff]">
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
          {attendees.map((p, i) => (
            <div key={i} className="flex justify-between items-center p-3 mb-2 bg-white rounded-xl shadow-sm">
              <span>{p.username}</span>
              {isHost && p.user_id != userId ? (
                <div className="flex gap-2 items-center">
                  <span className={`text-sm px-2 py-1 rounded-full ${getStatusClass(p.status)}`}>{p.status.replace("_", " ")}</span>
                  {p.status === "invitation_pending" && (
                    <button className="text-sm text-red-600" onClick={() => handleRemoveAttendee(p.user_id)}>Uninvite</button>
                  )}
                  {p.status === "request_pending" && (
                    <>
                      <button className="text-sm text-green-600" onClick={() => handleUpdateStatus(p.username, "confirmed")}>Accept</button>
                      <button className="text-sm text-red-600" onClick={() => handleRemoveAttendee(p.user_id)}>Decline</button>
                    </>
                  )}
                  {p.status === "confirmed" && (
                    <button className="text-sm text-red-600" onClick={() => handleRemoveAttendee(p.user_id)}>Remove</button>
                  )}
                </div>
              ) : (
                <span className={`text-sm px-2 py-1 rounded-full ${getStatusClass(p.status)}`}>{p.status.replace("_", " ")}</span>
              )}
            </div>
          ))}

          {isHost && (
            <div className="mt-4">
              <select
                value={selectedFriend || ""}
                onChange={e => setSelectedFriend(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">-- Invite Friend --</option>
                {friends.filter(f => !attendees.some(a => a.user_id === f.id)).map(f => (
                  <option key={f.id} value={f.id}>{f.username}</option>
                ))}
              </select>
              <button
                onClick={() => handleInviteFriend(selectedFriend)}
                className="ml-2 px-3 py-1 bg-blue-600 text-white text-sm rounded"
              >
                Invite
              </button>
            </div>
          )}
        </div>

        {!isHost && (
          alreadyRequested ? (
            <button
              onClick={() => handleCancelRequest(eventId)}
              className="bg-red-100 text-red-700 font-semibold px-6 py-2 rounded-xl w-full shadow-sm mt-4"
            >
              Cancel Request
            </button>
          ) : (
            <button
              onClick={() => handleRequestToJoin(eventId)}
              className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-xl mt-4 w-full shadow-sm"
            >
              + Request to Join
            </button>
          )
        )}

        {isHost && (
          <div className="mt-4 space-y-2">
            <button
              onClick={() => { window.location.hash = `#event-edit/${eventId}`; }}
              className="bg-[#4a90e2] text-white font-semibold px-6 py-2 rounded-xl w-full shadow-sm"
            >
              Edit Event
            </button>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this event?")) {
                  fetch(`http://localhost:3001/api/events/${eventId}`, { method: "DELETE" })
                    .then(res => res.json())
                    .then(() => {
                      alert("Event deleted.");
                      window.location.hash = "#calendar";
                    });
                }
              }}
              className="bg-red-500 text-white font-semibold px-6 py-2 rounded-xl w-full shadow-sm"
            >
              Delete Event
            </button>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}

window.EventDetailPage = EventDetailPage;
