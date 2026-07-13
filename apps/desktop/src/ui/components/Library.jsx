import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import Tile from './Tile';
import '../style/Library.css';
import defaultImg from '../assets/collection.svg';

/**
 * The Library component, which displays a list of collections fetched from the main process.
 * @returns {JSX.Element} The list of collections or an error message if fetching fails.
 */
function Library() {
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.electronAPI.getCollections()
    .then(setCollections)
    .catch((error) => {
      console.error('Error fetching collections:', error);
      setError(error);
    });
  }, []);

  // Clear the error state
  const clearError = () => {
    setError(null);
  }

  return (
    <div>
      {error && (
        <Alert variant="danger" onClose={clearError} dismissible>
          Unable to fetch collections: {error.message}
        </Alert>
      )}
      <ul>
        {collections.map((collection) => (
          <li key={collection.id}>
            <Tile
              id={collection.id}
              title={collection.title}
              description={collection.description}
              imageUrl={collection.imageUrl || defaultImg}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Library;