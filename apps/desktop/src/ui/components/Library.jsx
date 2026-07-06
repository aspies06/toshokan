import React from 'react';
import { Link } from 'react-router';

function Library() {
  return (
    <div>
      <h2>Library Component</h2>
      <ul>
        <li><Link to="/collections/1">Collection 1</Link></li>
        <li><Link to="/collections/2">Collection 2</Link></li>
        <li><Link to="/collections/3">Collection 3</Link></li>
      </ul>
    </div>
  );
}

export default Library;