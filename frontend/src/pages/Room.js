import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import ProblemPanel from "../components/ProblemPanel";
import VideoChat from "../components/VideoChat";
import AIHelper from "../components/AIHelper";
import socket from "../socket";
import axios from "axios";

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.username || "");
  const [hasJoined, setHasJoined] = useState(!!location.state?.username);
  const [tempName, setTempName] = useState("");

  const [users, setUsers] = useState(0);
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  
  // States that CodeEditor will update so AIHelper can read them
  const [code, setCode] = useState("// Loading...");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    if (!hasJoined) return;
    
    socket.emit("join_room", { roomId, username });

    socket.on("user-count", (count) => {
      setUsers(count);
    });

    // Fetch problems from our MongoDB backend API
    axios.get("http://localhost:5000/api/questions")
      .then(res => {
        setProblems(res.data);
        if (res.data.length > 0) setActiveProblem(res.data[0]);
      })
      .catch(err => console.error("Could not fetch problems:", err));

    return () => {
      socket.off("user-count");
      socket.emit("leave-room", { roomId });
    };
  }, [roomId, username, hasJoined]);

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => alert("Room link copied!"))
      .catch(err => alert("Could not copy link: " + err.message));
  };

  const [activeLeftTab, setActiveLeftTab] = useState("problem");
  const [activeRightTab, setActiveRightTab] = useState("chat");

  if (!hasJoined) {
    return (
      <div style={modalStyles.container}>
        <div style={modalStyles.glassCard}>
          <h2 style={{color: "white", marginTop: 0}}>Join Session</h2>
          <p style={{color: "#aaa", fontSize: "14px"}}>You have been invited to collaborate in room:<br/><strong style={{color:"#58a6ff"}}>{roomId}</strong></p>
          <input 
             placeholder="Enter your Display Name" 
             value={tempName} 
             onChange={e => setTempName(e.target.value)} 
             style={modalStyles.input}
             autoFocus
             onKeyDown={(e) => {
               if (e.key === 'Enter' && tempName.trim()) {
                 setUsername(tempName); setHasJoined(true);
               }
             }}
          />
          <button 
             onClick={() => { if(tempName.trim()) { setUsername(tempName); setHasJoined(true); } }} 
             style={modalStyles.button}
          >
            Enter Room
          </button>
        </div>
      </div>
    );
  }

  if (!activeProblem) return <div style={{color:"white", padding:"20px"}}>Loading coding environment...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#0d1117", color: "white", overflow: "hidden" }}>
      
      {/* HEADER */}
      <header className="room-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", background: "#161b22", borderBottom: "1px solid #30363d", height: "50px" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <h2 style={{ margin: 0, color: "#58a6ff", fontSize: "20px" }}>AI CollabCode</h2>
          <span style={{ fontSize: "14px", color: "#8b949e" }}>Room: {roomId} | Users: {users} | You: <span style={{color: "#fff", fontWeight: "bold"}}>{username}</span></span>
          
          <div style={{ marginLeft: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#8b949e" }}>Problem:</span>
            <select 
              value={activeProblem._id} 
              onChange={(e) => setActiveProblem(problems.find(p => p._id === e.target.value))}
              className="premium-select"
              style={{ padding: "6px 12px", background: "#21262d", color: "#c9d1d9", border: "1px solid #30363d", borderRadius: "6px", cursor: "pointer", fontSize: "14px", outline: "none" }}
            >
              {problems.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="premium-btn primary" onClick={copyLink} style={{ padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "500", fontSize: "14px", transition: "all 0.2s" }}>
          Copy Invitation
        </button>
      </header>

      {/* MAIN LAYOUT: Grid */}
      <div className="room-main">
        
        {/* LEFT PANEL: Problem & AI Helper */}
        <div className="room-left-panel">
          <div className="panel-tabs">
            <button className={`tab-button ${activeLeftTab === "problem" ? "active" : ""}`} onClick={() => setActiveLeftTab("problem")}>Problem</button>
            <button className={`tab-button ${activeLeftTab === "ai" ? "active" : ""}`} onClick={() => setActiveLeftTab("ai")}>AI Tutor ✨</button>
          </div>
          <div className="panel-content">
            {activeLeftTab === "problem" && <ProblemPanel problem={activeProblem} />}
            {activeLeftTab === "ai" && <AIHelper code={code} language={language} questionContext={activeProblem?.description} />}
          </div>
        </div>

        {/* CENTER PANEL: Code Editor */}
        <div className="room-center-panel">
          <CodeEditor 
            problem={activeProblem} 
            roomId={roomId} 
            sharedCode={code} 
            setSharedCode={setCode}
            sharedLanguage={language}
            setSharedLanguage={setLanguage}
          />
        </div>

        {/* RIGHT PANEL: Communications */}
        <div className="room-right-panel">
          <div className="panel-tabs">
            <button className={`tab-button ${activeRightTab === "chat" ? "active" : ""}`} onClick={() => setActiveRightTab("chat")}>Room Chat</button>
            <button className={`tab-button ${activeRightTab === "video" ? "active" : ""}`} onClick={() => setActiveRightTab("video")}>Video</button>
          </div>
          <div className="panel-content" style={{ padding: 0 }}>
             <div style={{ display: activeRightTab === "video" ? "block" : "none", height: "100%" }}>
                <VideoChat roomId={roomId} username={username} />
             </div>
             <div style={{ display: activeRightTab === "chat" ? "flex" : "none", height: "100%", flexDirection: "column" }}>
                <Chat roomId={roomId} username={username} />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const modalStyles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d1117",
    color: "white",
    fontFamily: "system-ui, -apple-system, sans-serif"
  },
  glassCard: {
    background: "#161b22",
    borderRadius: "12px",
    padding: "30px",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #30363d",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #30363d",
    background: "#0d1117",
    color: "white",
    fontSize: "16px",
    marginTop: "20px",
    marginBottom: "20px",
    boxSizing: "border-box",
    outline: "none"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#238636",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default Room;