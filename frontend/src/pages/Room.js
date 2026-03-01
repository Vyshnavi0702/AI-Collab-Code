import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import ProblemPanel from "../components/ProblemPanel";
import socket from "../socket";

function Room() {

  const { roomId } = useParams();
  const location = useLocation();

  const username = location.state?.username || "Anonymous";

  const [users, setUsers] = useState(0);

  useEffect(() => {

    socket.emit("join-room", { roomId, username });

    socket.on("user-count", (count) => {
      setUsers(count);
    });

    return () => {
      socket.off("user-count");
    };

  }, [roomId, username]);

  const copyLink = () => {

    const url = window.location.href;

    navigator.clipboard.writeText(url);

    alert("Room link copied!");

  };

  return (

    <div style={{padding:"20px"}}>

      {/* HEADER */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>

        <div>
          <h2>Room ID: {roomId}</h2>
          <p>Users Online: {users}</p>
          <p>You are: {username}</p>
        </div>

        <button onClick={copyLink}>
          Copy Room Link
        </button>

      </div>

      {/* MAIN LAYOUT */}

      <div style={{display:"flex", gap:"20px", marginTop:"20px"}}>

        {/* PROBLEM PANEL */}

        <div style={{flex:2}}>
          <ProblemPanel />
        </div>

        {/* CODE EDITOR */}

        <div style={{flex:3}}>
          <CodeEditor />
        </div>

        {/* CHAT */}

        <div style={{flex:1}}>
          <Chat roomId={roomId} username={username} />
        </div>

      </div>

    </div>

  );

}

export default Room;