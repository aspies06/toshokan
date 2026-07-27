import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

/**
 * Modal component for uploading files or web resources
 * @returns {JSX.Element} - The upload component
 */
function Upload() 
{
  const [show, setShow] = useState(false);
  const [source, setSource] = useState(null);

  const handleClose = () => { 
    setSource(null);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  // Handle file selection and set the source state
  const handleFileChange = (event) => {
    const file = window.electronAPI.getFilePath(event.target.files[0]);
    setSource(file);
  }

  // Handle the upload action
  const handleUpload = () => {
    console.log('Uploading source:', source);
    if (source) {
      window.electronAPI.uploadContent(source)
        .then(() => {
          console.log('Upload successful');
          setShow(false);
          setSource(null);
        })
        .catch((error) => {
          console.error('Upload failed:', error);
        });
    }
  };

  return (
    <>
      <Button variant="outline-primary" size="sm" onClick={handleShow}>
        Add
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Source</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Select a file to upload</p>
          <Form.Control type="file" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload} disabled={!source}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Upload;