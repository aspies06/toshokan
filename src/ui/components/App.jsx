import React from 'react';
import { Link, Routes, Route } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Collection from './Collection.jsx';
import Library from './Library.jsx';
import Settings from './Settings.jsx';
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
    <div className="app-container d-flex flex-column vh-100 p-3">
      <ToastContainer position="top-right" />
      <header className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo mb-4" />
        </Link>
        <Settings/>
      </header>
      <main className="d-flex flex-column flex-grow-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/collections/:collectionId" element={<Collection />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;