function ProfilePage() {
  const friends = ["Joe", "John", "Fred", "Amy"];
  const [dietaryPreferences,setDietaryPreferences] = React.useState(["Vegetarian", "Gluten Free"]);
  const [newPreference, setNewPreference] = React.useState("");
  const [isEditingBudget, setIsEditingBudget] = React.useState(false);
  const [weeklyBudget, setWeeklyBudget] = React.useState(100);
  const [dailyAverage, setDailyAverage] = React.useState(17);
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);

  // Handle profile editing
  function handleSaveProfile() {
    setIsEditingProfile(false);
  }

  // Handle adding dietary preferences
  function handleAddPreference() {
    if (newPreference.trim() !== ""){
    setDietaryPreferences([...dietaryPreferences, newPreference.trim()]);
    setNewPreference("");
    }
  }

  // Handle removing dietary preferences
  function handleRemovePreference(index) {
    const updatedPreferences = [...dietaryPreferences];
    updatedPreferences.splice(index, 1); 
    setDietaryPreferences(updatedPreferences);
  }

  // Handle budget editing
  function handleSaveBudget() {
    setDailyAverage((weeklyBudget / 7).toFixed(2)); // Update daily average based on weekly budget
    setIsEditingBudget(false); 
  }

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
            <h2 className="text-xl font-semibold text-[#3a2e20]">
              {isEditingProfile ? (
                <input
                  type="text"
                  defaultValue="Jane Doe"
                  className="border-b-2 border-[#3a2e20]"
                />
              ) : (
                "Jane Doe"
              )}
            </h2>
          </div>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="bg-[#f2e3d1] text-sm px-3 py-1 rounded-md shadow"
          >
            {isEditingProfile ? "Save Profile" : "Edit Profile"}
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
                <span className="text-xs text-[#3a2e20] mt-1">{friend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="bg-[#fceede] p-4 rounded-xl space-y-2">
          <h3 className="font-semibold text-[#3a2e20]">Dietary Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {dietaryPreferences.map((pref, idx) => (
              <div key={idx} className="relative flex items-center">
                <span className="bg-[#e3bfa2] text-[#3a2e20] px-2 py-1 rounded-full text-sm">
                  {pref}
                </span>
                <button
                  onClick={() => handleRemovePreference(idx)} // Remove preference
                  className="absolute top-0 right-0 text-xs text-red-500"
                >
                  x {/* Keeping the "x" for removal */}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={newPreference}
              onChange={(e) => setNewPreference(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddPreference();
                }
              }}
              placeholder="Add a preference"
              className="px-2 py-1 rounded border text-sm"
            />
            <button
              onClick={handleAddPreference}
              className="bg-[#f5d9c1] px-3 py-1 rounded-full text-sm text-[#3a2e20]"
            >
              Add Preference
            </button>
          </div>
        </div>

        {/* Dining Budget */}
        <div className="bg-[#fceede] p-4 rounded-xl space-y-2 mb-10">
          <h3 className="font-semibold text-[#3a2e20] mb-2">Dining Budget</h3>
          <div className="flex justify-between">
            <span className="text-[#3a2e20]">Weekly Budget</span>
            {isEditingBudget ? (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={weeklyBudget}
                  onChange={(e) => setWeeklyBudget(Number(e.target.value))}
                  className="px-2 py-1 rounded border"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSaveBudget(); // Save budget on Enter key
                    }
                  }}
                />
                <button
                  onClick={handleSaveBudget}
                  className="bg-[#f5d9c1] px-3 py-1 rounded-full text-sm text-[#3a2e20]"
                >
                  Save
                </button>
              </div>
            ) : (
              <span className="bg-[#e3bfa2] px-2 py-1 rounded-md text-[#3a2e20]">
                ${weeklyBudget}
              </span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-[#3a2e20]">Daily Average</span>
            <span className="bg-[#e3bfa2] px-2 py-1 rounded-md text-[#3a2e20]">
              ${dailyAverage}
            </span>
          </div>
          <button
            onClick={() => setIsEditingBudget(!isEditingBudget)}
            className="bg-[#f2e3d1] text-sm px-3 py-1 rounded-md shadow mt-2"
          >
            {isEditingBudget ? "Cancel" : "Edit Budget"}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
