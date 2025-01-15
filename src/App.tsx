import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Feed } from './components/Feed';
import { Explore } from './components/Explore';

function App() {
  const [currentPage, setCurrentPage] = useState<'feed' | 'explore'>('feed');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onPageChange={setCurrentPage} currentPage={currentPage} />
      <main>
        {currentPage === 'feed' ? <Feed /> : <Explore />}
      </main>
    </div>
  );
}

export default App;