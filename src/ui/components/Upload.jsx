import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

/**
 * Modal component for uploading files or web resources
 * @param {string} collectionId - The collection ID
 * @param {Function} onUploadComplete - Callback function to be called when upload is complete
 * @returns {JSX.Element} - The upload component
 */
function Upload({collectionId, onUploadComplete}) 
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

  const toastOptions = {
    autoClose: 5000,
    hideProgressBar: true,
    pauseOnHover: true,
    closeButton: true,
    theme: 'colored',
  };

  // Handle the upload action
  const handleUpload = () => {
    console.log('Uploading source:', source);
    if (source) {
      setShow(false);
      toast.info(
        `Uploading source "${source}". You will be notified when the upload is complete.`, 
        toastOptions);
      window.electronAPI.uploadContent(source, collectionId)
        .then(() => {
          onUploadComplete();
          toast.success(`Upload complete for "${source}".`, toastOptions);
        })
        .catch((error) => {
          toast.error(`Failed to upload source "${source}".`, toastOptions);
          console.error('Upload error:', error);
        })
        .finally(() => {
          setSource(null);
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