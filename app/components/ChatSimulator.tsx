import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { v4 as uuidv4 } from 'uuid';
import { sendChatMessage } from '../services/chatService';

interface Message { from: 'user' | 'assistant'; text: string; }

const ChatSimulator: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generar sessionId único
    const id = uuidv4();
    setSessionId(id);
    // Mensaje inicial con promociones
    (async () => {
      const reply = await sendChatMessage('__INIT__', id);
      setMessages([{ from: 'assistant', text: reply }]);
      scrollToBottom();
    })();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;
    const userMsg: Message = { from: 'user', text: input };
    setMessages((prev: Message[]): Message[] => [...prev, userMsg]);
    setInput('');
    scrollToBottom();

    const replyText = await sendChatMessage(input, sessionId);
    setMessages((prev: Message[]): Message[] => [...prev, { from: 'assistant', text: replyText }]);
    scrollToBottom();
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', height: '500px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{ background: msg.from === 'user' ? '#DCF8C6' : '#EEE', padding: '8px', borderRadius: '8px', display: 'inline-block' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '8px', borderTop: '1px solid #ccc', display: 'flex' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' ? handleSend() : undefined}
          placeholder="Escribe tu mensaje..."
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSend} style={{ marginLeft: '8px', padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#0070f3', color: '#fff' }}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatSimulator; 