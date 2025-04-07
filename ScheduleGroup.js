// ScheduleGroup.js
function ScheduleGroup({ schedules }) {
    return (
      <div>
        {schedules.map((schedule) => (
          // Since ScheduleCard is now globally available, you can reference it directly.
          <ScheduleCard key={schedule.id} schedule={schedule} />
        ))}
      </div>
    );
  }
  
  window.ScheduleGroup = ScheduleGroup;
  