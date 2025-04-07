// CalendarPage.js
function CalendarPage() {
  // Dynamically load the stylesheet exclusive to the Calendar page
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'globals.css'; // adjust path as needed
    document.head.appendChild(link);

    // Cleanup on unmount:
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const [schedules, setSchedules] = React.useState([
    {
      id: '1',
      date: '2025-04-06',
      time: '12:00 - 1:00 PM',
      diningType: 'Lunch',
      friend: 'Joe',
      avatar: '/assets/3d_avatar_1.png',
      status: 'confirmed'
    },
    {
      id: '2',
      date: '2025-04-06',
      time: '12:00 - 1:00 PM',
      diningType: 'Lunch',
      friend: 'John',
      avatar: '/assets/3d_avatar_10.png',
      status: 'pending'
    },
    {
      id: '3',
      date: '2025-04-10',
      time: '12:00 - 1:00 PM',
      diningType: 'Lunch',
      friend: 'Joe',
      avatar: '/assets/3d_avatar_1.png',
      status: 'confirmed'
    },
    {
      id: '4',
      date: '2025-04-11',
      time: '12:00 - 1:00 PM',
      diningType: 'Lunch',
      friend: 'Joe',
      avatar: '/assets/3d_avatar_1.png',
      status: 'declined'
    }
  ]);
  const [filteredSchedules, setFilteredSchedules] = React.useState(schedules);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    diningType: '',
    date: '',
    status: ''
  });
  const [searchTerm, setSearchTerm] = React.useState('');

  // Apply filters whenever schedules, filters, or searchTerm change
  React.useEffect(() => {
    let result = schedules;
    if (filters.diningType) {
      result = result.filter(s => s.diningType === filters.diningType);
    }
    if (filters.date) {
      result = result.filter(s => s.date === filters.date);
    }
    if (filters.status) {
      result = result.filter(s => s.status === filters.status);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.friend.toLowerCase().includes(term) ||
        s.diningType.toLowerCase().includes(term)
      );
    }
    setFilteredSchedules(result);
  }, [schedules, filters, searchTerm]);

  function groupSchedulesByDate(schedulesArr) {
    return schedulesArr.reduce((groups, schedule) => {
      if (!groups[schedule.date]) groups[schedule.date] = [];
      groups[schedule.date].push(schedule);
      return groups;
    }, {});
  }

  const groupedSchedules = groupSchedulesByDate(filteredSchedules);

  function handleAddSchedule(newSchedule) {
    setSchedules(prev => [...prev, newSchedule]);
  }

  function handleFilterChange(filterType, value) {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }

  return (
    <div>
      <header className="header">
        <div className="nav-tabs">
          <button className="tab active">My Schedule</button>
          <button className="tab">Friends' Schedule</button>
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

        <div className="filter-bar">
          <select
            className="filter-select"
            value={filters.diningType}
            onChange={(e) => handleFilterChange('diningType', e.target.value)}
          >
            <option value="">All Dining Types</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>

          <select
            className="filter-select"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          >
            <option value="">All Dates</option>
            {Array.from(new Set(schedules.map(s => s.date))).map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        {Object.keys(groupedSchedules).length > 0 ? (
          Object.keys(groupedSchedules).map((date) => {
            const formattedDate = new Date(date).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            });
            const today = new Date().toISOString().split('T')[0] === date;
            return (
              <div key={date}>
                <h2 className="section-title">
                  {formattedDate} {today && '(Today)'}
                </h2>
                <ScheduleGroup schedules={groupedSchedules[date]} />
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <p>No schedules match your filters</p>
          </div>
        )}

        <div className="add-button-container">
          <button className="add-button" onClick={() => setIsDialogOpen(true)}>
            Create A Table
          </button>
        </div>
      </main>

      <footer className="footer">
        <nav className="bottom-nav">
          <a href="#calendar" className="nav-item">Calendar</a>
          <a href="#events" className="nav-item">Events</a>
          <a href="#profile" className="nav-item">Profile</a>
        </nav>
      </footer>

      {/* Add Schedule Dialog */}
      <AddScheduleDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddSchedule={handleAddSchedule}
      />
    </div>
  );
}

// Attach CalendarPage to the global object
window.CalendarPage = CalendarPage;
