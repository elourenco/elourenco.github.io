import React from 'react';
import NavBar from './components/navbar';
import Home from './components/home';

function App() {
  return (
    <main className="w-full h-auto bg-bodyColor text-lightText px-2">
      <header>
        <NavBar />
      </header>
      <div className="max-w-screen-xl mx-auto">
        <Home />
      </div>
    </main>
  );
}

export default App;
