function EventPage({ locationId }) {
    const data = eventData[locationId];
    if (!data) return <div className="p-4 text-white">No event found.</div>;
  
    const stored = JSON.parse(localStorage.getItem("userTables") || "{}");
    const userTables = stored[locationId] || [];
    const allTables = [...(data.tables || []), ...userTables];

    return (
      <div className="flex flex-col min-h-screen pb-16 bg-[#fef5f1]">
  <div className="bg-black text-white p-4 text-lg font-semibold">
    Event Page Map Detail
  </div>

  <div className="relative">
    <img
      src={data.image}
      alt={data.name}
      className="w-full h-48 object-cover"
    />
    <div className="absolute bottom-2 left-4 text-xl text-white font-bold bg-gradient-to-r from-black/70 to-transparent px-2 py-1 rounded">
      {data.name}
    </div>
  </div>

  <div className="p-4 flex flex-col gap-4">
    <button
      onClick={() => window.location.hash = `#event/${locationId}/create`}
      className="button-primary"
    >
      + Create Your Table
    </button>

    <button className="button-secondary">🤍 Add Favorites</button>

    <div className="font-bold text-lg">Public Tables</div>

    {allTables.map((table, i) => (
      <div key={i} className="bg-[#e8c9b7] p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <img
            src={table.host.avatar}
            className="w-8 h-8 rounded-full"
            alt="host"
          />
          <div>
            <div className="font-bold">{table.name}</div>
            <div className="text-sm">{table.time}</div>
          </div>
        </div>

        <div className="mt-2 text-sm text-white">
          <div className="underline">Dishes</div>
          {table.dishes.map((dish, j) => (
            <div className="flex justify-between" key={j}>
              <span>{dish.name}</span>
              <span>{dish.participants.join("")}</span>
            </div>
          ))}
        </div>

        <button className="mt-3 w-full button-primary">
          + Request To Join
        </button>
      </div>
    ))}
  </div>

  <Navigation />
</div>

    );
  }
  