function CreateTablePage({ locationId }) {
  const [tableName, setTableName] = React.useState(locationId ? `${locationId} Table` : "");
  const [location, setLocation] = React.useState(locationId || "");
  const [latitude, setLatitude] = React.useState(null);
  const [longitude, setLongitude] = React.useState(null);
  const [diningType, setDiningType] = React.useState("Lunch");
  const [date, setDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [dishes, setDishes] = React.useState([""]);
  const [friends, setFriends] = React.useState([]);
  const [invitedFriends, setInvitedFriends] = React.useState([]);

  const userId = localStorage.getItem("user_id");

  React.useEffect(() => {
    fetch(`http://localhost:3001/api/users/${userId}/friends`)
      .then(res => res.json())
      .then(data => {
        setFriends(data.map(friend => ({
          id: friend.id,
          name: friend.username
        })));
      });
  }, [userId]);
  
  function handleAddDish() {
    setDishes([...dishes, ""]);
  }

  function handleChangeDish(index, value) {
    const updated = [...dishes];
    updated[index] = value;
    setDishes(updated);
  }

  function handleSubmit() {
    if (!tableName || !date || !startTime || !endTime) {
      alert("Please fill in all required fields.");
      return;
    }

    const event = {
      title: tableName,
      location,
      dining_type: diningType,
      date,
      time_range: `${startTime} - ${endTime}`,
      latitude,
      longitude,
      is_public: true,
      is_availability: false,
      host_id: userId,
      dishes: dishes.filter(d => d.trim() !== "")
    };

    fetch("http://localhost:3001/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    })
      .then(res => res.json())
      .then(data => {
        const eventId = data.id;
        if (invitedFriends.length > 0) {
          invitedFriends.forEach(friendId => {
            fetch(`http://localhost:3001/api/events/${eventId}/invite`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: friendId })
            });
          });
        }
        alert("Table created!");
        window.location.hash = "#calendar";
      });
      
  }

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

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-[#f6fbff] p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#3a2e20]">Create Table {locationId && `at ${locationId}`}</h1>
  
      <div className="space-y-4 max-w-xl w-full mx-auto">
  
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="Table Name"
          className="w-full px-4 py-2 rounded border bg-white"
        />
  
        <input
          type="text"
          value={location}
          onChange={(e) => handleLocationInput(e.target.value)}
          placeholder="Select or enter location"
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
  
        <div>
          <label className="font-semibold text-[#3a2e20]">Invite Friends:</label>
          <div className="bg-white border rounded p-3 mt-1 space-y-2 max-h-48 overflow-auto">
            {friends.map(friend => (
              <label key={friend.id} className="flex items-center gap-3 text-sm text-[#3a2e20]">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  value={friend.id}
                  checked={invitedFriends.includes(friend.id)}
                  onChange={(e) => {
                    const id = friend.id;
                    setInvitedFriends(prev =>
                      e.target.checked ? [...prev, id] : prev.filter(f => f !== id)
                    );
                  }}
                />
                {friend.name}
              </label>
            ))}
          </div>
        </div>
  
        <div>
          <label className="font-semibold text-[#3a2e20]">Dishes:</label>
          {dishes.map((dish, i) => (
            <input
              key={i}
              value={dish}
              onChange={(e) => handleChangeDish(i, e.target.value)}
              placeholder={`Dish ${i + 1}`}
              className="w-full mb-1 px-4 py-2 rounded border bg-white"
            />
          ))}
          <button
            onClick={handleAddDish}
            className="mt-1 text-sm text-blue-600 underline"
          >
            + Add Another Dish
          </button>
        </div>
  
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-xl w-full shadow-sm hover:bg-blue-600 transition"
        >
          Create Table
        </button>
      </div>
  
      <Navigation />
    </div>
  );
  
}

window.CreateTablePage = CreateTablePage;
