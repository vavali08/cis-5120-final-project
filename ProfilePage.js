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
  const [searchUsername, setSearchUsername] = React.useState("");

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
  }, [userId]);

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

  function handleSendFriendRequest() {
    if (!searchUsername.trim()) return;

    fetch(`http://localhost:3001/api/users/username/${searchUsername.trim()}`)
      .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then(user => {
        fetch(`http://localhost:3001/api/friends/request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, friend_id: user.id }),
        })
          .then(res => {
            if (!res.ok) throw new Error("Failed to send request");
            return res.json();
          })
          .then(() => {
            alert("Friend request sent!");
            setSearchUsername("");
          });
      })
      .catch(() => {
        alert("Invalid username.");
      });
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f6fbff]">
      <div className="p-4 space-y-4 flex-grow">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
            {isEditingProfile ? (
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-b border-gray-400 bg-transparent text-lg font-semibold"
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-800">{username}</h2>
            )}
          </div>
          <button
            onClick={isEditingProfile ? handleSaveProfile : () => setIsEditingProfile(true)}
            className="bg-gray-200 px-3 py-1 rounded-md text-sm font-medium"
          >
            {isEditingProfile ? "Save Profile" : "Edit Profile"}
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold text-gray-800 mb-2">Friends</h3>
          <div className="flex gap-4 flex-wrap">
            {friends.map((friend, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-indigo-400 text-white rounded-full flex items-center justify-center font-bold">
                  {friend[0].toUpperCase()}
                </div>
                <span className="text-xs text-gray-700 mt-1">{friend}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter username to send request"
              className="flex-1 px-3 py-1 rounded border text-sm"
            />
            <button
              onClick={handleSendFriendRequest}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold text-gray-800 mb-2">Dietary Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {dietaryPreferences.map((pref, idx) => (
              <div key={idx} className="relative flex items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {pref}
                </span>
                <button
                  onClick={() => handleRemovePreference(idx)}
                  className="ml-1 text-xs text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
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
              className="px-3 py-1 rounded border text-sm flex-1"
            />
            <button
              onClick={handleAddPreference}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow mb-20">
          <h3 className="font-semibold text-gray-800 mb-2">Dining Budget</h3>
          <div className="flex justify-between items-center mb-2">
            <span>Weekly Budget</span>
            {isEditingBudget ? (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={weeklyBudget}
                  onChange={(e) => setWeeklyBudget(Number(e.target.value))}
                  className="px-2 py-1 rounded border text-sm w-24"
                />
                <button
                  onClick={handleSaveBudget}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium"
                >
                  Save
                </button>
              </div>
            ) : (
              <span className="text-gray-700 font-semibold">${weeklyBudget}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span>Daily Average</span>
            <span className="text-gray-700 font-semibold">${dailyAverage}</span>
          </div>
          <button
            onClick={() => setIsEditingBudget(!isEditingBudget)}
            className="bg-gray-100 text-sm px-3 py-1 rounded-md shadow mt-3"
          >
            {isEditingBudget ? "Cancel" : "Edit Budget"}
          </button>
        </div>
      </div>

      <Navigation />
    </div>
  );
}

window.ProfilePage = ProfilePage;
