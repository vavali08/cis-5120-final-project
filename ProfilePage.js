function ProfilePage() {
  const friends = ["Joe", "John", "Fred", "Amy"];
  const dietaryPreferences = ["Vegetarian", "Gluten Free"];
  const weeklyBudget = 100;
  const dailyAverage = 17;

  return (
    <div className="flex flex-col min-h-screen bg-[#f3e7db]">
      {/* Top bar */}
      <div className="bg-black text-white p-4 text-lg font-semibold">
        Profile Page
      </div>

      <div className="p-4 space-y-4 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#dcd2c2] rounded-full" />
            <h2 className="text-xl font-semibold text-[#3a2e20]">Jane Doe</h2>
          </div>
          <button className="bg-[#f2e3d1] text-sm px-3 py-1 rounded-md shadow">
            Edit Profile
          </button>
        </div>

        {/* Friends */}
<div className="bg-[#fceede] p-4 rounded-xl">
  <h3 className="font-semibold text-[#3a2e20] mb-2">Friends</h3>
  <div className="flex gap-4">
    {friends.map((friend, idx) => (
      <div key={idx} className="flex flex-col items-center">
        <div className="w-12 h-12 bg-[#dfcbb4] rounded-full flex items-center justify-center text-xs text-white font-bold">
          {friend[0]} 
        </div>
        <span className="text-xs text-[#3a2e20] mt-1">{friend}</span> {/* Name below the circle */}
      </div>
    ))}
  </div>
</div>


        {/* Dietary Preferences */}
        <div className="bg-[#fceede] p-4 rounded-xl space-y-2">
          <h3 className="font-semibold text-[#3a2e20]">Dietary Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {dietaryPreferences.map((pref, idx) => (
              <span
                key={idx}
                className="bg-[#e3bfa2] text-[#3a2e20] px-2 py-1 rounded-full text-sm"
              >
                {pref}
              </span>
            ))}
            <button className="bg-[#f5d9c1] px-3 py-1 rounded-full text-sm text-[#3a2e20]">
              Add More
            </button>
          </div>
        </div>

        {/* Dining Budget */}
        <div className="bg-[#fceede] p-4 rounded-xl space-y-2 mb-10">
          <h3 className="font-semibold text-[#3a2e20] mb-2">Dining Budget</h3>
          <div className="flex justify-between">
            <span className="text-[#3a2e20]">Weekly Budget</span>
            <span className="bg-[#e3bfa2] px-2 py-1 rounded-md text-[#3a2e20]">
              ${weeklyBudget}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#3a2e20]">Daily Average</span>
            <span className="bg-[#e3bfa2] px-2 py-1 rounded-md text-[#3a2e20]">
              ${dailyAverage}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
