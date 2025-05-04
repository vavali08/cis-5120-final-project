function CalendarPage() {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'globals.css';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const userId = localStorage.getItem("user_id");

  const [activeTab, setActiveTab] = React.useState("user");
  const [userSchedules, setUserSchedules] = React.useState([]);
  const [friendSchedules, setFriendSchedules] = React.useState([]);
  const [filteredSchedules, setFilteredSchedules] = React.useState([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({ diningType: '', date: '', status: '' });
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3001/api/users/${userId}/schedules`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUserSchedules(data);
      });

    fetch(`http://localhost:3001/api/users/${userId}/friends/availabilities`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFriendSchedules(data);
      });

  }, [userId]);

  React.useEffect(() => {
    let schedules = activeTab === "user" ? userSchedules : friendSchedules;
    let result = schedules;

    if (filters.diningType) result = result.filter(s => s.diningType === filters.diningType);
    if (filters.date) result = result.filter(s => s.date === filters.date);
    if (filters.status) {
      result = result.filter(s => s.status !== undefined && s.status === filters.status);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s => (s.friend || "").toLowerCase().includes(term) || s.diningType.toLowerCase().includes(term));
    }
    setFilteredSchedules(result);
  }, [userSchedules, friendSchedules, activeTab, filters, searchTerm]);

  function groupSchedulesByDate(schedulesArr) {
    return schedulesArr.reduce((groups, schedule) => {
      if (!groups[schedule.date]) groups[schedule.date] = [];
      groups[schedule.date].push(schedule);
      return groups;
    }, {});
  }

  const groupedSchedules = groupSchedulesByDate(filteredSchedules);

  function handleAddSchedule(newSchedule) {
    setUserSchedules(prev => [...prev, newSchedule]);
  }

  function handleFilterChange(filterType, value) {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  }

  return (
    <div className="bg-[#f6fbff]">
      <header className="header">
        <div className="nav-tabs">
          <button
            className={`tab ${activeTab === "user" ? "active" : ""}`}
            onClick={() => setActiveTab("user")}
          >
            My Schedule
          </button>
          <button
            className={`tab ${activeTab === "friend" ? "active" : ""}`}
            onClick={() => setActiveTab("friend")}
          >
            Friends' Schedule
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="add-button-container">
          <button className="add-button" onClick={() => window.location.hash = "#event/create"}>
            Create A Table
          </button>
          <button className="add-button mt-2" onClick={() => window.location.hash = "#availability/create"}>
            Add Availability
          </button>
        </div>

        <div className="filter-bar space-y-2 sm:space-y-0 sm:space-x-4 sm:flex sm:items-center">
  <select
    className="filter-select"
    value={filters.diningType}
    onChange={(e) => handleFilterChange('diningType', e.target.value)}
  >
    <option className="px-2" value="">All Dining Types</option>
    <option className="px-2" value="Lunch">Lunch</option>
    <option className="px-2" value="Dinner">Dinner</option>
  </select>

  <select
    className="filter-select"
    value={filters.date}
    onChange={(e) => handleFilterChange('date', e.target.value)}
  >
    <option className="px-2" value="">All Dates</option>
    {Array.from(new Set((activeTab === "user" ? userSchedules : friendSchedules).map(s => s.date))).map(date => (
      <option className="px-2" key={date} value={date}>{date}</option>
    ))}
  </select>

  {activeTab === "user" && (
    <select
      className="filter-select"
      value={filters.status}
      onChange={(e) => handleFilterChange('status', e.target.value)}
    >
      <option className="px-2" value="">All Statuses</option>
      <option className="px-2" value="confirmed">Confirmed</option>
      <option className="px-2" value="pending">Pending</option>
      <option className="px-2" value="declined">Declined</option>
    </select>
  )}
</div>


        {Object.keys(groupedSchedules).length > 0 ? (
          Object.keys(groupedSchedules).map((date) => {
            const formattedDate = new Date(date).toLocaleDateString(undefined, {
              weekday: 'long', month: 'short', day: 'numeric'
            });
            const today = new Date().toISOString().split('T')[0] === date;
            return (
              <div key={date}>
                <h2 className="section-title">{formattedDate} {today && '(Today)'}</h2>
                <ScheduleGroup schedules={groupedSchedules[date]} />
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <p>No schedules match your filters</p>
          </div>
        )}

      </main>

      <Navigation/>

      <AddScheduleDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddSchedule={handleAddSchedule}
      />
    </div>
  );
}

window.CalendarPage = CalendarPage;
