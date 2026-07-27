import React from 'react';
import { Link, Routes, Route } from 'react-router';
import Collection from './Collection.jsx';
import Library from './Library.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/banner_logo.svg';
import '../style/App.css';

/**
 * The main App component that sets up routing for the application.
 * @returns {JSX.Element} The main application container with routing.
 */
function App() 
{
  return (
    <div className="app-container">
      <header>
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/collections/:collectionId" element={<Collection />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;