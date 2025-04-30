function ScheduleCard({ schedule }) {
  const statusClasses = {
    confirmed: 'confirmed',
    pending: 'pending',
    declined: 'declined'
  };

  const isAvailability = schedule.is_availability;

  function getStatusIcon() {
    if (schedule.status === 'declined' || schedule.status === 'request_declined') {
      return './assets/Vector (1).png';
    }
    if (schedule.status === 'pending' || schedule.status === 'invitation_pending' || schedule.status === 'request_pending') {
      return './assets/Loader.svg';
    }
    return './assets/Vector.png'; // confirmed
  }
  
  function getAvatarIcon() {
    if (schedule.avatar) return schedule.avatar;
    if (schedule.friend === 'Joe') return './assets/3d_avatar_1.png';
    if (schedule.friend === 'John') return './assets/3d_avatar_10.png';
    return './assets/8.png';
  }

  function formatStatus(status) {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'request_pending': return 'Request Pending';
      case 'invitation_pending': return 'Invitation Pending';
      case 'request_declined': return 'Request Declined';
      case 'invitation_declined': return 'Invitation Declined';
      default: return status;
    }
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
        </div>
      </div>

      {!isAvailability && schedule.status && (
        <div className={`schedule-status ${statusClasses[schedule.status]}`}>
        <img src={getStatusIcon()} className="status-icon" alt="Status Icon" />
        <span className="status-text">
          {formatStatus(schedule.status)}
        </span>
      </div>
      )}
    </div>
  );
}

window.ScheduleCard = ScheduleCard;
