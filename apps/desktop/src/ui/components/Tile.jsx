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
function Tile({ id,title, description, imageUrl })
{
  return (
    <Link to={`/collections/${id}`}>
      <Figure>
        <Figure.Image
          width={64}
          height={64}
          alt={title}
          src={imageUrl}>
        </Figure.Image>
        <Figure.Caption>
          {title}
        </Figure.Caption>
      </Figure>
    </Link>
  );
}

export default Tile;