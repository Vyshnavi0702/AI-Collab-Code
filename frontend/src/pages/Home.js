import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    if (!username.trim()) {
      alert("Please enter a display name first!"); return;
    }
    // Generate a random 8-character string for the room ID
    const newRoomId = Math.random().toString(36).substring(2, 10);
    navigate(`/room/${newRoomId}`, { state: { username } });
  };

  const joinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      alert("Please enter both a display name and an existing Room ID."); return;
    }
    navigate(`/room/${roomId}`, { state: { username } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <h1 style={styles.title}>AI CollabCode</h1>
        <p style={styles.subtitle}>Real-time Collaborative Coding Platform</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Display Name</label>
          <input 
            style={styles.input} 
            placeholder="e.g. John Doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div style={styles.actionContainer}>
          <div style={styles.actionBox}>
             <h3 style={styles.actionTitle}>Start Fresh</h3>
             <button onClick={createRoom} style={styles.primaryButton}>Create New Room</button>
          </div>
          
          <div style={styles.divider}>
             <span style={styles.dividerText}>OR</span>
          </div>

          <div style={styles.actionBox}>
             <h3 style={styles.actionTitle}>Join Existing</h3>
             <input 
               style={{...styles.input, marginBottom: "10px"}} 
               placeholder="Paste Room ID"
               value={roomId}
               onChange={(e) => setRoomId(e.target.value)}
             />
             <button onClick={joinRoom} style={styles.secondaryButton}>Join Room</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "white",
    fontFamily: "system-ui, -apple-system, sans-serif"
  },
  glassCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "450px",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxSizing: "border-box"
  },
  title: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 10px 0",
    background: "linear-gradient(to right, #00c6ff, #0072ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    textAlign: "center",
    color: "#aaa",
    marginBottom: "30px",
    fontSize: "14px"
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#ccc"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(0,0,0,0.2)",
    color: "white",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box"
  },
  actionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  actionBox: {
    background: "rgba(0,0,0,0.2)",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  actionTitle: {
    margin: "0 0 15px 0",
    fontSize: "16px",
    color: "#ddd"
  },
  primaryButton: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(to right, #00c6ff, #0072ff)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  secondaryButton: {
    width: "100%",
    padding: "12px",
    background: "#2c5364",
    color: "white",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  divider: {
    textAlign: "center",
    margin: "5px 0",
    color: "#888",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "2px"
  }
};

export default Home;