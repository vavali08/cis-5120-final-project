function startApp() {
function App() {
    const [route, setRoute] = React.useState(location.hash || "#events");
  
    React.useEffect(() => {
      const onHashChange = () => setRoute(location.hash);
      window.addEventListener("hashchange", onHashChange);
      return () => window.removeEventListener("hashchange", onHashChange);
    }, []);
  
    switch (route) {
      case "#calendar":
        return <CalendarPage />;
      case "#profile":
        return <ProfilePage />;
      case "#events":
      default:
        return <EventMapPage />;
    }
  }
  
  ReactDOM.render(<App />, document.getElementById("app-root"));
}

if (typeof L === 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(startApp, 100); // wait for Leaflet to load
  });
} else {
  startApp();
}