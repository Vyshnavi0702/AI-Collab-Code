import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function AIHelper({ code, language, questionContext }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm your AI coding assistant. Ask me questions if you get stuck." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("https://ai-collab-backend-t7iv.onrender.com/api/ai-help", {
        code: code,
        language: language,
        questionContext: questionContext,
        prompt: input
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Could not connect to AI. Please check server.";
      setMessages(prev => [...prev, { role: 'ai', content: `**Error:** ${errMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", color: "#c9d1d9" }}>
      
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", padding: "10px 0" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.role === 'user' ? '#0e639c' : '#21262d',
            color: '#c9d1d9',
            padding: "8px 12px",
            borderRadius: "8px",
            maxWidth: "90%",
            border: msg.role === 'user' ? 'none' : '1px solid #30363d',
            fontSize: "14px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)"
          }}>
            {msg.role === 'user' ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
          </div>
        ))}
        {isLoading && <div style={{fontSize: "12px", color:"#8b949e"}}>AI is thinking...</div>}
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "10px", borderTop: "1px solid #30363d", paddingTop: "10px" }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask for help..." 
          style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #30363d", background: "#0d1117", color: "#c9d1d9", outline: "none", transition: "border 0.2s" }}
          onFocus={(e) => e.target.style.border = "1px solid #58a6ff"}
          onBlur={(e) => e.target.style.border = "1px solid #30363d"}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="premium-btn primary" onClick={sendMessage} style={{ padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Send</button>
      </div>
    </div>
  );
}

export default AIHelper;
