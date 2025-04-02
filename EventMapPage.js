function EventMapPage() {
  const [tab, setTab] = React.useState("Map");

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-black text-white p-4 text-lg font-semibold">
        Event Page Map
      </div>
      <div className="flex">
        <button
          onClick={() => setTab("Map")}
          className={`flex-1 py-2 ${tab === "Map" ? "bg-[#EBD2C3]" : "bg-[#EAD3C1]"}`}
        >
          Map
        </button>
        <button
          onClick={() => setTab("People")}
          className={`flex-1 py-2 ${tab === "People" ? "bg-[#EBD2C3]" : "bg-[#EAD3C1]"}`}
        >
          People
        </button>
      </div>
      <div className="flex-grow">
        {tab === "Map" ? (
          <img
            src="https://i.imgur.com/v8AdnXv.png"
            alt="Map View"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="p-4">People tab content goes here.</div>
        )}
      </div>
      <Navigation />
    </div>
  );
}
