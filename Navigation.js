function Navigation() {
  const route = window.location.hash || "#events";

  const navItems = [
    { name: "Calendar", icon: "/icons/calendar-xmark-solid.svg", hash: "#calendar" },
    { name: "Events", icon: "/icons/map-solid.svg", hash: "#events" },
    { name: "Profile", icon: "/icons/circle-user-solid.svg", hash: "#profile" },
  ];

  return (
    <nav className="navbar">
      {navItems.map((item) => (
        <a
          key={item.hash}
          href={item.hash}
          className={`nav-item ${route === item.hash ? "nav-active" : ""}`}
        >
          <img src={item.icon} alt={item.name} className="w-6 h-6 mb-1" />
          <span>{item.name}</span>
        </a>
      ))}
    </nav>
  );
}

