import React from 'react';
import { Link } from 'react-router';
import Figure from 'react-bootstrap/Figure';
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
function Tile({ id, title, description, imageUrl }) {
  return (
    <div className="tile-wrapper">
      <Link to={`/collections/${id}`} className="tile-link">
        <Figure className="tile-figure">
          <Figure.Image
            width={64}
            height={64}
            alt={title}
            src={imageUrl}>
          </Figure.Image>
          <Figure.Caption className="tile-caption">
            {title}
          </Figure.Caption>
        </Figure>
      </Link>
    </div>
  );
}

export default Tile;