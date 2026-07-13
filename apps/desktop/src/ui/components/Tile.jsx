import React from 'react';
import { Link } from 'react-router';
import '../style/Tile.css';

/**
 * The Tile component, which represents a single collection in the UI.
 * @param {Object} params - The parameters for the Tile component.
 * @param {string} params.id - The ID of the collection.
 * @param {string} params.title - The title of the collection.
 * @param {string} params.description - The description of the collection.
 * @param {string} params.imageUrl - The URL of the image for the collection.
 * @returns {JSX.Element} The tile element.
 */
function Tile({ id,title, description, imageUrl })
{
  return (
    <div className="tile">
      <Link to={`/collections/${id}`}>
        <img src={imageUrl} alt={title} className="tileImage" />
      </Link>
      <div>{title}</div>
    </div>
  );
}

export default Tile;