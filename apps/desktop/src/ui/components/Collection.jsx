import React from 'react';
import { Link, useParams } from 'react-router';

/**
 * The Collection component, which renders UI for a specific collection.
 * @returns {JSX.Element} The collection details element.
 */
function Collection() {
  const { collectionId } = useParams();
  return (
    <div className="collection-container">
      <h2>Collection Details</h2>
      {collectionId ? (
        <p>Viewing Collection ID: <strong>{collectionId}</strong></p>
      ) : (
        <p>No Collection ID found.</p>
      )}
    <footer>
      <p><Link to="/">← Back to Library</Link></p>
    </footer>
    </div>
  );
}

export default Collection;