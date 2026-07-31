import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sources from './Sources';
import Chat from './Chat'
import '../style/Collection.css';

/**
 * The Collection component, which renders UI for a specific collection.
 * @returns {JSX.Element} The collection details element.
 */
function Collection() 
{
  const [collection, setCollection] = useState({})
  const { collectionId } = useParams();
  const id = parseInt(collectionId);

  useEffect(() => {
    window.electronAPI.getCollectionById(id)
      .then(result => {
        setCollection(result);
      })
      .catch(e => console.error(`Unable to fetch collection by id ${id}`, e))
  }, []);

  return (
    <>
      <Container fluid className="mt-2 d-flex flex-column flex-grow-1 flex-fill-min-h0">
        <div>
          <h2>{collection.name}</h2>
          <p className="text-muted">{collection.description}</p>
        </div>
        <Row className="flex-grow-1 flex-fill-min-h0">
          <Col xs={12} md={3} className="bg-light p-3 d-flex flex-column">
            <Sources collectionId={id} />
          </Col>
          <Col xs={12} md={6} className="p-3 d-flex flex-column">
            <h4 className="panel-title fw-semibold lh-base mb-0">Chat</h4>
            <Chat collectionId={id} />
          </Col>
          <Col xs={12} md={3} className="bg-light p-3 d-flex flex-column">
            <h4 className="panel-title fw-semibold lh-base mb-0">Create</h4>
            <p>Right sidebar or widget content.</p>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Collection;