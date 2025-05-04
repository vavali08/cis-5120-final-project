// ScheduleGroup.js
function ScheduleGroup({ schedules }) {
  return (
    <div className="schedule-group">
      {schedules.map(schedule => (
        <ScheduleCard key={schedule.id} schedule={schedule} />
      ))}
    </div>
  );
}

  window.ScheduleGroup = ScheduleGroup;
  