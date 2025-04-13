function ScheduleCard({ schedule }) {
  const statusClasses = {
    confirmed: 'confirmed',
    pending: 'pending',
    declined: 'declined'
  };

  const isAvailability = schedule.is_availability;

  function getStatusIcon() {
    if (isAvailability) return null;
    if (schedule.status === 'declined') return './assets/Vector (1).png';
    if (schedule.status === 'pending') return './assets/Loader.svg';
    return './assets/Vector.png';
  }

  function getAvatarIcon() {
    if (schedule.avatar) return schedule.avatar;
    if (schedule.friend === 'Joe') return './assets/3d_avatar_1.png';
    if (schedule.friend === 'John') return './assets/3d_avatar_10.png';
    return './assets/8.png';
  }

  function formatStatus() {
    if (schedule.status === 'confirmed') return 'Confirmed';
    if (schedule.status === 'pending') return schedule.joined_by_user ? 'Request Pending' : 'Invitation Pending';
    if (schedule.status === 'declined') return schedule.joined_by_user ? 'Request Declined' : 'Invitation Declined';
    return 'Unknown';
  }

  function handleClick() {
    if (!isAvailability) {
      window.location.hash = `#event-detail/${schedule.eventId}`;
    }
  }

  return (
    <div
      className={`schedule-card ${isAvailability ? 'availability-card' : ''}`}
      onClick={handleClick}
      style={{ cursor: isAvailability ? 'default' : 'pointer' }}
    >
      <div className="schedule-left">
        <div className="avatar-container">
          <img src={getAvatarIcon()} alt="Avatar" className="avatar" />
          <div className="schedule-name">{schedule.friend || 'You'}</div>
        </div>
        <div className="schedule-info">
          <div className="schedule-time">{schedule.time}</div>
          <div className="schedule-meal">{schedule.diningType}</div>
          <div className="schedule-location">{schedule.location}</div>
          {isAvailability && (
            <div className="availability-tag">Available</div>
          )}
        </div>
      </div>

      {!isAvailability && schedule.status && (
        <div className={`schedule-status ${statusClasses[schedule.status]}`}>
        <img src={getStatusIcon()} className="status-icon" alt="Status Icon" />
        <span className="status-text">
          {formatStatus()}
        </span>
      </div>
      )}
    </div>
  );
}

window.ScheduleCard = ScheduleCard;
