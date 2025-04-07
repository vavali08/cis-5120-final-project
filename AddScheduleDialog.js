// AddScheduleDialog.js
function AddScheduleDialog({ isOpen, onClose, onAddSchedule }) {
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const [friend, setFriend] = React.useState('');
    const [diningType, setDiningType] = React.useState('Breakfast');
  
    if (!isOpen) return null;
  
    function handleSubmit(e) {
      e.preventDefault();
      const newSchedule = {
        id: Date.now().toString(),
        date,
        time,
        friend,
        diningType,
        avatar: '/assets/3d_avatar_1.png', // Adjust as needed
        status: 'pending'
      };
      onAddSchedule(newSchedule);
      onClose();
      // Reset form fields
      setDate('');
      setTime('');
      setFriend('');
      setDiningType('Breakfast');
    }
  
    return (
      <div className="dialog-overlay">
        <div className="dialog">
          <h2>Add New Schedule</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Date:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
            <label>
              Time:
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 12:00 - 1:00 PM"
                required
              />
            </label>
            <label>
              Friend:
              <input
                type="text"
                value={friend}
                onChange={(e) => setFriend(e.target.value)}
                required
              />
            </label>
            <label>
              Dining Type:
              <select value={diningType} onChange={(e) => setDiningType(e.target.value)}>
                <option value="Breakfast">Breakfast</option>
                <option value="Brunch">Brunch</option>
                <option value="Lunch">Lunch</option>
                <option value="Afternoon Snack">Afternoon Snack</option>
                <option value="Dinner">Dinner</option>
              </select>
            </label>
            <div className="dialog-actions">
              <button type="button" onClick={onClose}>Cancel</button>
              <button type="submit">Add Schedule</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  window.AddScheduleDialog = AddScheduleDialog;
  