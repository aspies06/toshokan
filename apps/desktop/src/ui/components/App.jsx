import React from 'react';
import { Routes, Route } from 'react-router';
import '../style/App.css';
import Collection from './Collection.jsx';
import Library from './Library.jsx';

function App() {
  return (
    <div className="App">
      <h1>Toshokan LM - Your Personal A.I. Library Manager</h1>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/collections/:collectionId" element={<Collection />} />
      </Routes>
    </div>
  );
}

export default App;