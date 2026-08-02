import { useEffect, useRef, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Upload from './Upload';

/**
 * A component for displaying and adding sources to a collection
 * @param {*} collectionId - The collection id
 * @returns {JSX} - The component
 */
function Sources({ collectionId }) 
{
    const [sources, setSources] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [error, setError] = useState(null);
    const selectAllRef = useRef(null);

    useEffect(() => {
        window.electronAPI.getSources(collectionId)
            .then((result) => {
                setSources(result);
                setSelectedIds(new Set(result.map(s => s.id)));
            })
            .catch((error) => {
                console.error('Error fetching sources:', error);
                setError(error);
            });
    }, []);

    const allSelected = sources.length > 0 && selectedIds.size === sources.length;
    const someSelected = selectedIds.size > 0 && !allSelected;

    // Keep the "select all" checkbox's indeterminate visual state in sync
    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someSelected;
        }
    }, [someSelected]);

    // Toggle every source on/off at once
    const toggleSelectAll = () => {
        setSelectedIds(allSelected ? new Set() : new Set(sources.map(s => s.id)));
    };

    // Toggle a single source
    const toggleSource = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-baseline mb-2">
                <h4 className="panel-title fw-semibold lh-base mb-0">Sources</h4>
                <Upload collectionId={collectionId} />
            </div>
            <ListGroup>
                <ListGroup.Item className="bg-light border-0 fw-semibold">
                    <Form.Check
                        ref={selectAllRef}
                        type="checkbox"
                        id="select-all-sources"
                        label="Select All"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        disabled={sources.length === 0}
                    />
                </ListGroup.Item>
                {sources.map(source =>
                    <ListGroup.Item key={source.id}>
                        <Form.Check
                            type="checkbox"
                            id={`source-${source.id}`}
                            label={source.title}
                            checked={selectedIds.has(source.id)}
                            onChange={() => toggleSource(source.id)}
                        />
                    </ListGroup.Item>
                )}
            </ListGroup>
        </>
    );
}

export default Sources;