import { useState, useEffect } from "react";
import socket from "../socket";

function Chat({ roomId, username }) {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    socket.on("receive-message", (data) => {

      console.log("Received message:", data);

      setMessages((prevMessages) => [...prevMessages, data]);

    });

    return () => {
      socket.off("receive-message");
    };

  }, []);

  const sendMessage = () => {

    if (message.trim() === "") return;

    console.log("Sending message:", message);

    socket.emit("send-message", {
      roomId: roomId,
      username: username,
      message: message
    });

    setMessage("");

  };

  return (
    <div style={{
  border:"1px solid gray",
  padding:"10px",
  height:"500px",
  display:"flex",
  flexDirection:"column"
}}>

      <h3>Chat</h3>

      <div style={{
  flex:1,
  overflowY:"scroll",
  marginBottom:"10px"
}}>

        {messages.map((msg, index) => (
          <div key={index}>
            <b>{msg.username}:</b> {msg.message}
          </div>
        ))}

      </div>

      <input
        type="text"
        placeholder="Type message"
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>
        Send
      </button>

    </div>
  );

}

export default Chat;