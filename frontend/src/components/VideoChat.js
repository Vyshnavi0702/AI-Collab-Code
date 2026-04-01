import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import socket from '../socket';

function VideoChat({ roomId, username }) {
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callerUsername, setCallerUsername] = useState("");
  
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
    }).catch(err => {
      console.warn("Media devices permission denied or not available:", err);
    });

    socket.on("receive_call", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerUsername(data.username || "Someone");
      setCallerSignal(data.signal);
    });
    
    return () => {
      socket.off("receive_call");
    };
  }, []);

  useEffect(() => {
    if (stream && myVideo.current) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      socket.emit("call_user", {
        room: roomId,
        signal: data,
        username: username
      });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    peer.on("close", () => {
      setCallAccepted(false);
      setReceivingCall(false);
    });

    socket.on("call_accepted", (data) => {
      setCallAccepted(true);
      peer.signal(data.signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      socket.emit("answer_call", { signal: data, to: caller, room: roomId });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    peer.on("close", () => {
      setCallAccepted(false);
      setReceivingCall(false);
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const endCall = () => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    setCallAccepted(false);
    setReceivingCall(false);
  };

  return (
    <div style={{ padding: "10px", border: "1px solid #333", borderRadius: "8px", background:"#1e1e1e", color: "white", display: "flex", flexDirection: "column", height: "100%" }}>
      <h3 style={{margin: "0 0 10px 0", fontSize: "16px"}}>Meeting</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, overflowY: "auto" }}>
        {stream && (
          <div style={{position: "relative"}}>
             <video playsInline muted ref={myVideo} autoPlay style={{ width: "100%", borderRadius: "8px", backgroundColor: "black" }} />
             <span style={{position:"absolute", bottom: 5, left: 10, background:"rgba(0,0,0,0.5)", padding:"2px 8px", borderRadius:"4px", fontSize:"12px"}}>{username} (You)</span>
          </div>
        )}
        {callAccepted && (
          <div style={{position: "relative"}}>
             <video playsInline ref={userVideo} autoPlay style={{ width: "100%", borderRadius: "8px", backgroundColor: "black" }} />
             <span style={{position:"absolute", bottom: 5, left: 10, background:"rgba(0,0,0,0.5)", padding:"2px 8px", borderRadius:"4px", fontSize:"12px"}}>Peer</span>
          </div>
        )}
      </div>
      
      {callAccepted ? (
        <div style={{ marginTop: "10px" }}>
           <button onClick={endCall} style={{ background: "#dc3545", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%" }}>End Call</button>
        </div>
      ) : receivingCall ? (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <p style={{fontSize: "14px", margin: "0 0 5px 0"}}>{callerUsername} is calling...</p>
          <div style={{display: "flex", gap: "10px"}}>
             <button onClick={answerCall} style={{ background: "#28a745", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", flex: 1 }}>Join</button>
             <button onClick={endCall} style={{ background: "#dc3545", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", flex: 1 }}>Decline</button>
          </div>
        </div>
      ) : (
         <div style={{ marginTop: "10px" }}>
           <button onClick={callUser} style={{ background: "#007bff", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%" }}>Start Call</button>
         </div>
      )}
    </div>
  );
}

export default VideoChat;
