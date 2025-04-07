// ScheduleCard.js
function ScheduleCard({ schedule }) {
    const statusClasses = {
      confirmed: 'confirmed',
      pending: 'pending',
      declined: 'declined'
    };
  
    function getStatusIcon() {
      if (schedule.status === 'declined') return './assets/Vector (1).png';
      if (schedule.status === 'pending') return './assets/Loader.svg';
      return './assets/Vector.png';
    }
  
    function getAvatarIcon() {
      if (schedule.friend === 'Joe') return './assets/3d_avatar_1.png';
      if (schedule.friend === 'John') return './assets/3d_avatar_10.png';
      return './assets/8.png';
    }
  
    return (
      <div className="schedule-card">
        <div className="schedule-left">
          <div className="avatar-container">
            <img src={getAvatarIcon()} alt="Avatar" className="avatar" />
            <div className="schedule-name">{schedule.friend}</div>
          </div>
          <div className="schedule-info">
            <div className="schedule-time">{schedule.time}</div>
            <div className="schedule-meal">{schedule.diningType}</div>
          </div>
        </div>
        <div className={`schedule-status ${statusClasses[schedule.status]}`}>
          <img src={getStatusIcon()} className="status-icon" alt="Status Icon" />
          <span className="status-text">
            {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
          </span>
        </div>
      </div>
    );
  }
  
  window.ScheduleCard = ScheduleCard;
  