import { useState, useEffect, useRef } from "react";
import socket from "../socket";

function Chat({ roomId, username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      room: roomId,
      username: username,
      message: message
    };

    socket.emit("send_message", msgData);
    setMessages((prevMessages) => [...prevMessages, msgData]);
    setMessage("");
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#1e1e1e", color: "white" }}>
      <h3 style={{ margin: 0, padding: "10px", borderBottom: "1px solid #333", background: "#252526", fontSize: "16px" }}>Room Chat</h3>
      
      <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {messages.map((msg, index) => {
          const isMe = msg.username === username;
          return (
            <div key={index} style={{
              alignSelf: isMe ? "flex-end" : "flex-start",
              background: isMe ? "#0e639c" : "#3c3c3c",
              padding: "6px 10px",
              borderRadius: "6px",
              maxWidth: "85%",
              wordBreak: "break-word"
            }}>
              {!isMe && <div style={{ fontSize: "11px", color: "#cccccc", marginBottom: "2px" }}>{msg.username}</div>}
              <div style={{ fontSize: "13px" }}>{msg.message}</div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div style={{ padding: "10px", borderTop: "1px solid #333", display: "flex", gap: "8px", background: "#252526" }}>
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #3e3e42", background: "#3c3c3c", color: "white" }}
        />
        <button onClick={sendMessage} style={{ background: "#0e639c", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;