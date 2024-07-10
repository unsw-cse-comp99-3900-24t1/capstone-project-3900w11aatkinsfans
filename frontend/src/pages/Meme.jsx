import React from 'react';
import { useParams } from 'react-router-dom';

function MemePage() {
  const { id } = useParams();

  // You can now use the id to fetch data or perform any other action
  return (
    <div>
      <p>Meme ID: {id}</p>
    </div>
  );
}

export default MemePage;