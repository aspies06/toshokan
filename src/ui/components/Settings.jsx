import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import GearIcon from 'bootstrap-icons/icons/gear.svg';

function Settings() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button variant="light" size="lg" onClick={handleShow}>
                <img src={GearIcon} width={24} height={24} className="me-2" />
                Settings
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="settings-theme">
                            <Form.Label>Embedding Model</Form.Label>
                            <Form.Select className="form-select">
                                <option value="all-MiniLM-L6-v2">all-MiniLM-L6-v2</option>
                                <option value="all-mpnet-base-v2">all-mpnet-base-v2</option>
                                <option value="paraphrase-MiniLM-L6-v2">paraphrase-MiniLM-L6-v2</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Settings;