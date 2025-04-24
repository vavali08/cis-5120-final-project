function Navigation() {
  const navItems = [
    { name: "Calendar", icon: "/icons/calendar-xmark-solid.svg", hash: "#calendar" },
    { name: "Events", icon: "/icons/map-solid.svg", hash: "#events" },
    { name: "Profile", icon: "/icons/circle-user-solid.svg", hash: "#profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-[#e0f0ff] border-t border-blue-200 shadow-inner">
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
