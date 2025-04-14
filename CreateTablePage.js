function CreateTablePage({ locationId }) {
  const [tableName, setTableName] = React.useState(locationId ? `${locationId} Table` : "");
  const [latitude, setLatitude] = React.useState(null);
  const [longitude, setLongitude] = React.useState(null);
  const [diningType, setDiningType] = React.useState("Lunch");
  const [date, setDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [dishes, setDishes] = React.useState([""]);
  const [showMap, setShowMap] = React.useState(false);
  const mapRef = React.useRef(null);
  const userId = localStorage.getItem("user_id");
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState(locationId ? {
    name: locationId,
    lat: null,
    lng: null
  } : null);


  React.useEffect(() => {
    if (showMap && mapRef.current && !mapRef.current._leaflet_id) {
      const map = L.map(mapRef.current).setView([39.9545, -75.1994], 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      let selectedMarker = null;

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);
        setLocation("Custom Location");
        if (selectedMarker) map.removeLayer(selectedMarker);
        selectedMarker = L.marker([lat, lng]).addTo(map);
      });
    }
  }, [showMap]);

  function handleAddDish() {
    setDishes([...dishes, ""]);
  }

  function handleChangeDish(index, value) {
    const updated = [...dishes];
    updated[index] = value;
    setDishes(updated);
  }

  function handleSubmit() {
    if (!tableName || !date || !startTime || !endTime || !selectedLocation) {
      console.log(tableName, date, startTime, endTime, location);
      alert("Please fill in all required fields.");
      return;
    }

    const event = {
      title: tableName,
      location: selectedLocation?.name || "",
      dining_type: diningType,
      date,
      time_range: `${startTime} - ${endTime}`,
      latitude: selectedLocation?.lat || null,
      longitude: selectedLocation?.lng || null,
      is_public: true,
      is_availability: false,
      host_id: userId,
      dishes: dishes.filter(d => d.trim() !== "")
    };
    

    if (location === "Custom Location" && latitude && longitude) {
      event.latitude = latitude;
      event.longitude = longitude;
    } else {
      event.latitude = null;
      event.longitude = null;
    }

    fetch("http://localhost:3001/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    })
      .then((res) => res.json())
      .then(() => {
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

      <div className="mb-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={selectedLocation?.name || ""}
            onChange={(e) =>
              setSelectedLocation({ name: e.target.value, lat: null, lng: null })
            }
            placeholder="Location"
            className="flex-1 px-4 py-2 rounded border"
          />
          <button
            className="button-secondary"
            type="button"
            onClick={() => setIsMapOpen(true)}
          >
            🗺️ Pick from Map
          </button>
        </div>
        {selectedLocation?.lat && (
          <p className="text-sm text-green-700 mt-1">
            Selected: {selectedLocation.name}
          </p>
        )}
      </div>
      <MapSelectorModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelect={(loc) => setSelectedLocation(loc)}
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
