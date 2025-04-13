function ProfilePage() {
  const userId = localStorage.getItem("user_id");

  const [username, setUsername] = React.useState("");
  const [friends, setFriends] = React.useState([]);
  const [dietaryPreferences, setDietaryPreferences] = React.useState([]);
  const [newPreference, setNewPreference] = React.useState("");
  const [isEditingBudget, setIsEditingBudget] = React.useState(false);
  const [weeklyBudget, setWeeklyBudget] = React.useState(100);
  const [dailyAverage, setDailyAverage] = React.useState(17);
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);

  React.useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3001/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data?.username) setUsername(data.username);
      });

    fetch(`http://localhost:3001/api/users/${userId}/friends`)
      .then(res => res.json())
      .then(data => setFriends(data.map(f => f.username)));

    const prefs = JSON.parse(localStorage.getItem("user_prefs") || "{}");
    if (prefs.dietaryPreferences) setDietaryPreferences(prefs.dietaryPreferences);
    if (prefs.weeklyBudget) setWeeklyBudget(prefs.weeklyBudget);
    if (prefs.dailyAverage) setDailyAverage(prefs.dailyAverage);
  }, []);

  React.useEffect(() => {
    localStorage.setItem(
      "user_prefs",
      JSON.stringify({ dietaryPreferences, weeklyBudget, dailyAverage })
    );
  }, [dietaryPreferences, weeklyBudget, dailyAverage]);

  function handleSaveProfile() {
    fetch(`http://localhost:3001/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    setIsEditingProfile(false);
  }

  function handleAddPreference() {
    if (newPreference.trim()) {
      setDietaryPreferences([...dietaryPreferences, newPreference.trim()]);
      setNewPreference("");
    }
  }

  function handleRemovePreference(index) {
    const updated = [...dietaryPreferences];
    updated.splice(index, 1);
    setDietaryPreferences(updated);
  }

  function handleSaveBudget() {
    setDailyAverage((weeklyBudget / 7).toFixed(2));
    setIsEditingBudget(false);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f3e7db]">
      <div className="bg-black text-white p-4 text-lg font-semibold">Profile Page</div>

      <div className="p-4 space-y-4 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#dcd2c2] rounded-full" />
            <h2 className="text-xl font-semibold text-[#3a2e20]">
              {isEditingProfile ? (
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-b-2 border-[#3a2e20] bg-transparent"
                />
              ) : (
                username
              )}
            </h2>
          </div>
          <button
            onClick={isEditingProfile ? handleSaveProfile : () => setIsEditingProfile(true)}
            className="bg-[#f2e3d1] text-sm px-3 py-1 rounded-md shadow"
          >
            {isEditingProfile ? "Save Profile" : "Edit Profile"}
          </button>
        </div>

        {/* Friends */}
        <div className="bg-[#fceede] p-4 rounded-xl">
          <h3 className="font-semibold text-[#3a2e20] mb-2">Friends</h3>
          <div className="flex gap-4 flex-wrap">
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

        {/* Preferences */}
        <div className="bg-[#fceede] p-4 rounded-xl space-y-2">
          <h3 className="font-semibold text-[#3a2e20]">Dietary Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {dietaryPreferences.map((pref, idx) => (
              <div key={idx} className="relative flex items-center">
                <span className="bg-[#e3bfa2] text-[#3a2e20] px-2 py-1 rounded-full text-sm">{pref}</span>
                <button
                  onClick={() => handleRemovePreference(idx)}
                  className="absolute top-0 right-0 text-xs text-red-500"
                >
                  x
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

        {/* Budget */}
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
                      handleSaveBudget();
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

      <Navigation />
    </div>
  );
}
