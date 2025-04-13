function CreateTablePage({ locationId }) {
  const [tableName, setTableName] = React.useState("");
  const [dishes, setDishes] = React.useState([""]);
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [date, setDate] = React.useState("");
  const [diningType, setDiningType] = React.useState("Lunch");
  const [location, setLocation] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(true);
  const [invitees, setInvitees] = React.useState([]);
  const [friends, setFriends] = React.useState([]);
  const userId = localStorage.getItem("user_id");

  React.useEffect(() => {
    fetch(`http://localhost:3001/api/users/${userId}/friends`)
      .then(res => res.json())
      .then(setFriends);
  }, [userId]);

  function handleAddDish() {
    setDishes([...dishes, ""]);
  }

  function handleChangeDish(index, value) {
    const newDishes = [...dishes];
    newDishes[index] = value;
    setDishes(newDishes);
  }

  function toggleInvite(friendId) {
    setInvitees(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  }

  async function handleSubmit() {
    if (!tableName.trim() || !startTime || !endTime || !date || !location.trim()) {
      alert("Please fill out all required fields.");
      return;
    }

    if (!startTime || !endTime) {
      alert("Please select both start and end time.");
      return;
    }
    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    const time_range = `${startTime} - ${endTime}`;

    

    const payload = {
      title: tableName,
      time_range: time_range,
      date,
      dining_type: diningType,
      location,
      is_availability: false,
      is_public: isPublic,
      host_id: userId,
      invitees,
      dishes: dishes.filter((d) => d.trim() !== "")
    };

    const res = await fetch("http://localhost:3001/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const result = await res.json();
      window.location.hash = `#event-detail/${result.id}`;
    } else {
      alert("Failed to create event.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-[#fef5f1] p-4">
      <h1 className="text-lg font-bold mb-4">Create Table at {locationId}</h1>

      <input
        type="text"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
        placeholder="Table Name"
        className="w-full mb-2 px-4 py-2 rounded border"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full mb-2 px-4 py-2 rounded border"
      />

      <label className="font-semibold">Start Time:</label>
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="w-full mb-2 px-4 py-2 rounded border"
      />

      <label className="font-semibold">End Time:</label>
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="w-full mb-2 px-4 py-2 rounded border"
      />


      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        className="w-full mb-2 px-4 py-2 rounded border"
      />

      <select
        value={diningType}
        onChange={(e) => setDiningType(e.target.value)}
        className="w-full mb-2 px-4 py-2 rounded border"
      >
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Brunch">Brunch</option>
        <option value="Breakfast">Breakfast</option>
      </select>

      <div className="mb-2 flex items-center gap-2">
        <label className="font-semibold">Public?</label>
        <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
      </div>

      <div className="mb-4">
        <label className="font-semibold">Invite Friends:</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {friends.map(friend => (
            <label key={friend.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={invitees.includes(friend.id)}
                onChange={() => toggleInvite(friend.id)}
              />
              {friend.username}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <label className="font-semibold">Dishes:</label>
        {dishes.map((dish, i) => (
          <input
            key={i}
            value={dish}
            onChange={(e) => handleChangeDish(i, e.target.value)}
            placeholder={`Dish ${i + 1}`}
            className="w-full mb-1 px-4 py-2 rounded border"
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
        className="button-primary mt-4"
      >
        Create Table
      </button>

      <Navigation />
    </div>
  );
}
