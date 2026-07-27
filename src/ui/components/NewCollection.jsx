import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

/**
 * Modal component for creating a new collection.
 * @param {() => void} - The callback to invoke on new collection
 * @returns {JSX.Element} - The rendered NewCollection modal
 */
function NewCollection({onCollectionAdded}) 
{
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Submit new collection
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name');
        const description = formData.get('description');
        window.electronAPI.addCollection({ name, description })
            .then((result) => onCollectionAdded(result.id))
            .catch((e) => console.error('Unable to add collection: ', e));
        setShow(false);
    };

    return (
        <>
            <Button variant="outline-primary" size="sm" onClick={handleShow}>
                Add Collection
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Collection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="collection-form" onSubmit={handleSubmit}>
                        <Form.Group controlId="collection-name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control name="name" type="input"/>
                        </Form.Group>
                        <Form.Group controlId="collection-description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control name="description" type="input"/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" form="collection-form" type="submit">
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NewCollection;