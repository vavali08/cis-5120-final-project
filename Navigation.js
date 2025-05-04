function Navigation() {
  const navItems = [
    { name: "Schedule", icon: "/icons/calendar-solid.svg", hash: "#calendar" },
    { name: "Event Map", icon: "/icons/map-solid.svg", hash: "#map" },
    { name: "Profile", icon: "/icons/circle-user-solid.svg", hash: "#profile" },
  ];

  return (
    <div className="bot-nav-bar">
      <nav className="flex justify-around py-3">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.hash}
            className="flex flex-col items-center text-sm text-[#1a3a5f] font-semibold hover:text-black"
          >
            <img src={item.icon} alt={item.name} className="w-5 h-5 mb-1" />
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
}
