import React from 'react';
import NavBar from './components/navbar';
import Home from './components/home';

function App() {
  return (
    <main className="w-full h-auto gradient_background text-lightText px-2">
      <header>
        <NavBar />
      </header>
      <div className="max-w-screen-xl mx-auto px-6">
        <Home />
      </div>
    </main>
  );
}

export default App;
