function startApp() {
  function App() {
    const [route, setRoute] = React.useState(location.hash || "#events");
  
    React.useEffect(() => {
      const onHashChange = () => setRoute(location.hash);
      window.addEventListener("hashchange", onHashChange);
      return () => window.removeEventListener("hashchange", onHashChange);
    }, []);
  
    if (route === "#availability/create") {
      return <AddAvailabilityPage />;
    }

    if (route === "#event/create") {
      return <CreateTablePage />;
    }
    
    if (route.match(/^#event\/[^\/]+\/create$/)) {
      const locationId = route.split("/")[1];
      return <CreateTablePage locationId={locationId} />;
    }
    
  
    if (route.startsWith("#event-detail/")) {
      const eventId = route.split("/")[1];
      return <EventDetailPage eventId={eventId} />;
    }

    if (route.startsWith("#location/")) {
      const locationId = route.split("/")[1];
      return <LocationPage locationId={locationId} />;
    }

    if (route.startsWith("#event-edit/")) {
      const eventId = route.split("/")[1];
      return <EditEventPage eventId={eventId} />;
    }
    

  
    switch (route) {
      case "#calendar":
        return <CalendarPage />;
      case "#profile":
        return <ProfilePage />;
      case "#event":
        return <EventDetailPage />;
      case "#events":
      default:
        return <EventMapPage />;
    }
  }  

  ReactDOM.render(<App />, document.getElementById("app-root"));
}

if (typeof L === 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(startApp, 100);
  });
} else {
  startApp();
}
