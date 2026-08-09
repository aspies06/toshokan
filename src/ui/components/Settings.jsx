import { useEffect, useState } from 'react';
import { listModels } from '@huggingface/hub';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import GearIcon from 'bootstrap-icons/icons/gear.svg';

function Settings() {
    const [show, setShow] = useState(false);
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [accessToken, setAccessToken] = useState('');

    const [selectedLLM, setSelectedLLM] = useState([]);
    // Loading indicator for model selection
    const [isLlmLoading, setIsLlmLoading] = useState(false);
    // options for LLM models fetched from Hugging Face API
    const [llmOptions, setLlmOptions] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = async () => {
        await loadSettings();
        setShow(true);
    };

    // Fetch LLM Models (pipeline_tag=text-generation)
    const handleLLMSearch = async (query) => {
        setIsLlmLoading(true);
        try {
            const models = [];
            const modelStream = listModels({
                accessToken: accessToken,
                search: {
                    query: query,
                    // task: "feature-extraction",
                    library: "gguf"
                },
                limit: 10,
                sort: "downloads",
                direction: "desc"
            });

            for await (const model of modelStream) {
                models.push({
                    id: model.name,
                    label: model.name,
                    downloads: model.downloads,
                    likes: model.likes,
                    updatedAt: model.lastModified,
                });
            }
            setLlmOptions(models);
        } catch (error) {
            console.error('Error fetching LLM models:', error);
        } finally {
            setIsLlmLoading(false);
        }
    };

    // Handles form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        const newSettings = {};
        if (width && height) {
            newSettings.windowDimensions = { width: parseInt(width), height: parseInt(height) };
        }
        if (selectedLLM && selectedLLM.length > 0) {
            // selectedLLM contains objects with 'id' and 'label', extract the id which is the model name
            newSettings.llm = { model: selectedLLM[0].id };
        }
        if (accessToken) {
            newSettings.hf = { accessToken: accessToken };
        }
        window.electronAPI.saveSettings(newSettings).then(() => {
            handleClose();
            toast.success("Saved settings", {
                autoClose: 2000,
                hideProgressBar: true,
                theme: 'colored'
            })
        }).catch((err) => {
            console.error('Failed to save settings:', err);
        });
    };

    // loads the settings from settings.json
    const loadSettings = async () => {
        try {
            const settings = await window.electronAPI.getSettings();
            populateSettings(settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    // populate fields from settings
    const populateSettings = (settings) => {
        setWidth(settings.windowDimensions?.width?.toString() || '');
        setHeight(settings.windowDimensions?.height?.toString() || '');
        setAccessToken(settings.hf?.accessToken ?? '');
        
        if (settings.llm?.model) {
            setSelectedLLM([{ id: settings.llm.model, label: settings.llm.model }]);
        } else {
            setSelectedLLM([]); // Reset if no model is set
        }
    }

    useEffect(() => {
        loadSettings();
    }, []);

    return (
        <>
            <Button variant="light" size="lg" onClick={handleShow}>
                <img src={GearIcon} width={24} height={24} className="me-2" />
                Settings
            </Button>
            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="settings-form" onSubmit={handleSubmit}>
                        <Form.Group controlId="window-dimensions" className="mb-3">
                            <h5>Window Dimensions</h5>
                            <Form.Label className="mt-2">Width</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter width in pixels..."
                                value={width}
                                onChange={(e) => setWidth(e.target.value)} />
                            <Form.Label className="mt-2">Height</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter height in pixels..."
                                value={height}
                                onChange={(e) => setHeight(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="hf-model">
                            <h5>Model</h5>
                            <Form.Label>Hugging Face Token</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Access Token..."
                                value={accessToken}
                                onChange={(e) => setAccessToken(e.target.value)}
                            />
                            <Form.Label>LLM Model</Form.Label>
                            <AsyncTypeahead
                                id="llm-model"
                                labelKey="label"
                                onChange={setSelectedLLM}
                                onSearch={handleLLMSearch}
                                options={llmOptions}
                                selected={selectedLLM}
                                placeholder="Select an LLM model..."
                                isLoading={isLlmLoading}
                                delay={350}    // Built-in debounce delay
                                minLength={2}
                                filterBy={() => true}
                                promptText="Type at least 2 characters to search..."
                                searchText="Searching Hugging Face..."
                                emptyLabel="No LLMs found."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        form="settings-form"
                        disabled={!width && !height && !(selectedLLM.length > 0)}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Settings;