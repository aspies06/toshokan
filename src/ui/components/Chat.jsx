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

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || isSending) {
            return;
        }

        const userMessage = { id: crypto.randomUUID(), role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsSending(true);

        const assistantId = crypto.randomUUID();
        setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);
        
        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({messages: [{role: 'user', content: text }]}),
            });

            if (!response.ok) {
                throw new Error(`Server responded ${response.status}`);
            }
    
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = ''
    
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
    
                buffer += decoder.decode(value, { stream: true });
                const events = buffer.split('\n\n')
                buffer = events.pop();

                for (const event of events) {
                    if (!event.startsWith('data: ')) continue;
                    const payload = event.slice('data: '.length);

                    if (payload == '[DONE]') continue;

                    const chunkText = JSON.parse(payload);
                    console.log(chunkText);
                    setMessages(prev => 
                        prev.map(m => 
                            m.id == assistantId ? { ...m, content: m.content + chunkText } : m
                        )
                    );
                }
            }
        } catch (error) {
            console.log('Error fetching stream:', error);
        } finally {
            setIsSending(false);
        }
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