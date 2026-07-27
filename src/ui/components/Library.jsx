import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import Tile from './Tile';
import NewCollection from './NewCollection';
import '../style/Library.css';
import defaultImg from '../assets/collection_mixed.svg';

/**
 * The Library component, which displays a list of collections fetched from the main process.
 * @param {() => void} onCollectionAdded - Callback when new collection is added
 * @returns {JSX.Element} The list of collections or an error message if fetching fails.
 * */
function Library() 
{
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);

  // Refetch helper
  const fetchCollections = () => {
    window.electronAPI.getCollections()
      .then(setCollections)
      .catch((error) => {
        console.error('Error fetching collections:', error);
        setError(error);
      });
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Clear the error state
  const clearError = () => {
    setError(null);
  }

  return (
    <>
      {error && (
        <Alert variant="danger" onClose={clearError} dismissible>
          Unable to fetch collections: {error.message}
        </Alert>
      )}
      <NewCollection onCollectionAdded={fetchCollections} />
      <div className="grid">
          {collections.map((collection) => (
            <Tile
              id={collection.id}
              key={collection.id}
              title={collection.name}
              description={collection.description}
              imageUrl={collection.imageUrl || defaultImg}
            />
        ))}
      </div>
    </>
  );
}

export default Library;