// FilterComponent.js
function FilterComponent({ schedules, filters, onFilterChange }) {
    // Get unique dates from schedules
    const uniqueDates = Array.from(new Set(schedules.map(schedule => schedule.date)));
    // Get unique dining types
    const diningTypes = Array.from(new Set(schedules.map(schedule => schedule.diningType)));
    // Define status options
    const statusOptions = ['confirmed', 'pending', 'declined'];
  
    return (
      <div className="filter-container">
        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.diningType}
            onChange={(e) => onFilterChange('diningType', e.target.value)}
          >
            <option value="">All Dining Types</option>
            {diningTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
  
          <select
            className="filter-select"
            value={filters.date}
            onChange={(e) => onFilterChange('date', e.target.value)}
          >
            <option value="">All Dates</option>
            {uniqueDates.map(date => {
              const formattedDate = new Date(date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              });
              return (
                <option key={date} value={date}>
                  {formattedDate}
                </option>
              );
            })}
          </select>
  
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
  
  window.FilterComponent = FilterComponent;
  