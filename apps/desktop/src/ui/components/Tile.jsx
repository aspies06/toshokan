import React from 'react';
import { Link } from 'react-router';
import '../style/Tile.css';

function Tile({ title, description, imageUrl, id })
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