function CreateTablePage({ locationId }) {
  const [tableName, setTableName] = React.useState(locationId ? `${locationId} Table` : "");
  const [location, setLocation] = React.useState(locationId || "");
  const [diningType, setDiningType] = React.useState("Lunch");
  const [date, setDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [dishes, setDishes] = React.useState([""]);
  const userId = localStorage.getItem("user_id");

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
      latitude: null,
      longitude: null,
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
        alert("Table created!");
        window.location.hash = "#calendar";
      });
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-[#fef5f1] p-4">
      <h1 className="text-lg font-bold mb-4">Create Table {locationId && `at ${locationId}`}</h1>

      <input
        type="text"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
        placeholder="Table Name"
        className="w-full mb-2 px-4 py-2 rounded border"
      />

      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        className="w-full mb-2 px-4 py-2 rounded border"
      />

      <div className="flex gap-2 mb-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 px-4 py-2 rounded border"
        />
        <select
          value={diningType}
          onChange={(e) => setDiningType(e.target.value)}
          className="flex-1 px-4 py-2 rounded border"
        >
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
      </div>

      <div className="flex gap-2 mb-2">
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="flex-1 px-4 py-2 rounded border"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="flex-1 px-4 py-2 rounded border"
        />
      </div>

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

window.CreateTablePage = CreateTablePage;
