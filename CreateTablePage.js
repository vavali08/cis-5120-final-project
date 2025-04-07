function CreateTablePage({ locationId }) {
  const [tableName, setTableName] = React.useState("");
  const [dishes, setDishes] = React.useState([""]);
  const [time, setTime] = React.useState("");

  function handleAddDish() {
    setDishes([...dishes, ""]);
  }

  function handleChangeDish(index, value) {
    const newDishes = [...dishes];
    newDishes[index] = value;
    setDishes(newDishes);
  }

  function handleSubmit() {
    const stored = JSON.parse(localStorage.getItem("userTables") || "{}");
    const newTable = {
      name: tableName,
      time,
      dishes: dishes.filter((d) => d.trim() !== "").map((d) => ({ name: d, participants: [] })),
      host: { avatar: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    };
    const updated = {
      ...stored,
      [locationId]: [...(stored[locationId] || []), newTable],
    };
    localStorage.setItem("userTables", JSON.stringify(updated));
    window.location.hash = `#event/${locationId}`;
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
        type="text"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        placeholder="Time (e.g. Today, 6:00 - 7:30pm)"
        className="w-full mb-2 px-4 py-2 rounded border"
      />

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
