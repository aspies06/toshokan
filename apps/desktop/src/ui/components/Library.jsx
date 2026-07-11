import React from 'react';
import { Link } from 'react-router';
import Tile from './Tile';
import '../style/Library.css';
import defaultImg from '../assets/default_tile_img.png';

// TODO: Placeholder data for collections
const collections = [
  {
    id: 1,
    title: "Collection 1",
    description: "A collection of items related to category 1",
  },
  {
    id: 2, 
    title: "Collection 2",
    description: "A collection of items related to category 2", 
  },
  {
    id: 3,
    title: "Collection 3",
    description: "A collection of items related to category 3",
  },
];

function Library() {
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