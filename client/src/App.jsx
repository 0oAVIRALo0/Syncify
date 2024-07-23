function App() {
  const handleCLick = () => {
    console.log("Clicked");
  };

  return (
    <div>
      <div>
        <h1>Spotify Chat App</h1>
      </div>
      <div>
        <button onClick={handleCLick}>Login using spotify</button>
      </div>
    </div>
  );
}

export default App;
