function EditEventPage({ eventId }) {
    const [event, setEvent] = React.useState(null);
    const [title, setTitle] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [latitude, setLatitude] = React.useState(null);
    const [longitude, setLongitude] = React.useState(null);
    const [date, setDate] = React.useState("");
    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [diningType, setDiningType] = React.useState("Lunch");
    const [isPublic, setIsPublic] = React.useState(true); // default to public
  
    const userId = localStorage.getItem("user_id");
  
    React.useEffect(() => {
      fetch(`http://localhost:3001/api/events/${eventId}`)
        .then(res => res.json())
        .then(data => {
          setEvent(data);
          setTitle(data.title);
          setLocation(data.location);
          setDate(data.date.split("T")[0]); 
          setDiningType(data.dining_type);
          const [start, end] = data.time_range.split(" - ");
          setStartTime(start);
          setEndTime(end);
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          setIsPublic(data.is_public);
        });
    }, [eventId, userId]);
  
    function handleLocationInput(value) {
      setLocation(value);
      const match = defaultLocations.find(
        loc => loc.name.toLowerCase() === value.toLowerCase()
      );
      if (match) {
        setLatitude(match.lat);
        setLongitude(match.lng);
      } else {
        setLatitude(null);
        setLongitude(null);
      }
    }
  
    function handleSubmit() {
        if (!title || !date || !startTime || !endTime) {
          alert("Please fill in all required fields.");
          return;
        }
      
        const updatedEvent = {
          title,
          location,
          latitude,
          longitude,
          date,
          dining_type: diningType,
          time_range: `${startTime} - ${endTime}`,
            is_public: isPublic,
        };
      
        fetch(`http://localhost:3001/api/events/${eventId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEvent),
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert("Event updated!");
              window.location.hash = `#event-detail/${eventId}`;
            } else {
              alert("Failed to update event.");
            }
          })
          .catch(err => {
            console.error("Error updating event:", err);
            alert("Error updating event.");
          });
      }
  
    if (!event) return <div className="p-4 text-white">Loading...</div>;
  
    return (
      <div className="flex flex-col min-h-screen pb-16 bg-[#f6fbff] p-6">
        <h1 className="text-2xl font-bold mb-4 text-[#3a2e20]">Edit Event</h1>
  
        <div className="space-y-4 max-w-xl w-full mx-auto">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            className="w-full px-4 py-2 rounded border bg-white"
          />
  
          <input
            type="text"
            value={location}
            onChange={(e) => handleLocationInput(e.target.value)}
            placeholder="Location"
            list="location-options"
            className="w-full px-4 py-2 rounded border bg-white"
          />
          <datalist id="location-options">
            {defaultLocations.map((loc, i) => (
              <option key={i} value={loc.name} />
            ))}
          </datalist>
  
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 px-4 py-2 rounded border bg-white"
            />
            <select
              value={diningType}
              onChange={(e) => setDiningType(e.target.value)}
              className="flex-1 px-4 py-2 rounded border bg-white"
            >
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
  
          <div className="flex gap-2">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="flex-1 px-4 py-2 rounded border bg-white"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="flex-1 px-4 py-2 rounded border bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-800">Make Event Public</label>
            <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="accent-blue-600"
            />
            </div>
  
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-xl w-full shadow-sm hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </div>
  
        <Navigation />
      </div>
    );
  }
  
  window.EditEventPage = EditEventPage;