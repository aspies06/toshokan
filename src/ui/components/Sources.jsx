import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Upload from './Upload';

/**
 * A component for displaying and adding sources to a collection
 * @param {*} collectionId - The collection id
 * @returns {JSX} - The component
 */
function Sources({ collectionId }) 
{
    const [sources, setSources] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.electronAPI.getSources(collectionId)
            .then(setSources)
            .catch((error) => {
                console.error('Error fetching sources:', error);
                setError(error);
            });
    }, []);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4>Sources</h4>
                <Upload />
            </div>
            <ListGroup>
                {sources.map(source =>
                    <ListGroup.Item key={source.id}>{source.title}</ListGroup.Item>
                )}
            </ListGroup>
        </>
    );
}

export default Sources;