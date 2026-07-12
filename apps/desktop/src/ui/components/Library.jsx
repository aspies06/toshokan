import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Tile from './Tile';
import '../style/Library.css';
import defaultImg from '../assets/default_tile_img.png';

function Library() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    window.electronAPI.getCollections().then(setCollections)
  }, []);

  return (
    <div>
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