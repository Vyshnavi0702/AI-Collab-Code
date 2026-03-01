import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const joinRoom = () => {

    if(roomId.trim() !== "" && username.trim() !== ""){

      navigate(`/room/${roomId}`, {
        state: { username }
      });

    } else {
      alert("Enter username and room ID");
    }

  };

  return (
    <div style={{textAlign:"center", marginTop:"100px"}}>

      <h1>AI Collaborative Coding Platform</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
      />

      <br/><br/>

      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e)=>setRoomId(e.target.value)}
      />

      <br/><br/>

      <button onClick={joinRoom}>
        Join Room
      </button>

    </div>
  );
}

export default Home;