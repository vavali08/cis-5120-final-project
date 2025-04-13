function AddAvailabilityPage() {
    const [date, setDate] = React.useState("");
    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [diningType, setDiningType] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [title, setTitle] = React.useState("");
  
    const userId = localStorage.getItem("user_id");
  
    function handleSubmit() {
      if (!date || !startTime || !endTime || !diningType) {
        alert("Please fill out date, time, and dining type.");
        return;
      }
  
      if (startTime >= endTime) {
        alert("End time must be after start time.");
        return;
      }
  
      const payload = {
        host_id: parseInt(userId),
        date,
        time_range: `${startTime} - ${endTime}`,
        dining_type: diningType,
        location,
        title,
        is_availability: true,
        is_public: true
      };
  
      fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            window.location.hash = "#calendar";
          } else {
            alert("Failed to create availability.");
          }
        });
    }
  
    return (
      <div className="flex flex-col min-h-screen pb-16 bg-[#fef5f1] p-4">
        <h1 className="text-lg font-bold mb-4">Add Availability</h1>
  
        <label className="font-semibold">Date:</label>
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
  
        <label className="font-semibold">Meal Type:</label>
        <select
          value={diningType}
          onChange={(e) => setDiningType(e.target.value)}
          className="w-full mb-2 px-4 py-2 rounded border"
        >
          <option value="">Select Meal</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
  
        <label className="font-semibold">Optional Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full mb-2 px-4 py-2 rounded border"
        />
  
        <label className="font-semibold">Optional Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 px-4 py-2 rounded border"
        />
  
        <button
          onClick={handleSubmit}
          className="button-primary mt-4"
        >
          Add Availability
        </button>
  
        <Navigation />
      </div>
    );
  }
  
  window.AddAvailabilityPage = AddAvailabilityPage;
  