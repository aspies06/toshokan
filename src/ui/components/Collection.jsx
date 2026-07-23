import React from 'react';
import { Link, useParams } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sources from './Sources';
import '../style/Collection.css';

/**
 * The Collection component, which renders UI for a specific collection.
 * @returns {JSX.Element} The collection details element.
 */
function Collection() {
  const { collectionId } = useParams();
    return (
    <Container fluid className="mt-4">
      <Row className="horizontal-row-wrapper">
        <Col xs={12} md={3} className="panel-side bg-light p-3">
          <Sources collectionId={collectionId} />
        </Col>
        <Col xs={12} md={6} className="panel-center p-3">
          <h4>Chat</h4>
          <p>Main content goes here.</p>
        </Col>
        <Col xs={12} md={3} className="panel-side bg-light p-3">
          <h4>Create</h4>
          <p>Right sidebar or widget content.</p>
        </Col>
      </Row>
    </Container>
  );
}

export default Collection;