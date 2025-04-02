function Page({ title }) {
    return (
      <div className="flex flex-col h-screen">
        <div className="bg-black text-white p-4 text-lg font-semibold">{title}</div>
        <div className="flex-grow flex items-center justify-center">
          <h1 className="text-xl">This is the {title} Page</h1>
        </div>
        <Navigation />
      </div>
    );
  }
  