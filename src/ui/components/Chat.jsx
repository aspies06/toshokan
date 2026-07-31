import { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../style/Chat.css';

/**
 * A ChatGPT/Gemini-style chat UI: a scrollable message history on top and a
 * text input with a send button pinned to the bottom.
 *
 * NOTE: LLM interaction is not implemented yet. Sending a message currently
 * only appends it to local state; wire up the actual model call inside
 * `sendMessage` once that backend code exists.
 *
 * @param {*} collectionId - The collection id whose sources should ground the chat (unused for now)
 * @returns {JSX.Element} - The rendered Chat component
 */
function Chat({ collectionId })
{
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Keep the view scrolled to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        const text = input.trim();
        if (!text || isSending) {
            return;
        }

        const userMessage = { id: Date.now(), role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // TODO: replace this with a real call to the LLM backend once it
        // exists (e.g. window.electronAPI.sendChatMessage(collectionId, text)).
        setIsSending(true);
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, role: 'assistant', content: '(LLM response placeholder)' }
            ]);
            setIsSending(false);
        }, 500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.length === 0 && (
                    <p className="chat-empty-state">Ask a question about this collection's sources to get started.</p>
                )}
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`chat-message ${message.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}
                    >
                        {message.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
                <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    variant="primary"
                    onClick={sendMessage}
                    disabled={!input.trim() || isSending}
                >
                    Send
                </Button>
            </div>
        </div>
    );
}

export default Chat;