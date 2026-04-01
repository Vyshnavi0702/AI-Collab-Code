import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";

function CodeEditor({ problem, roomId, sharedCode, setSharedCode, sharedLanguage, setSharedLanguage }) {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    socket.on("receive_code", (newCode) => {
      setSharedCode(newCode);
    });
    return () => {
      socket.off("receive_code");
    };
  }, [roomId, setSharedCode]);

  useEffect(() => {
    if (problem && problem.baseCode && problem.baseCode[sharedLanguage]) {
       if (sharedCode === "// Loading..." || sharedCode === "// Start coding here" || !sharedCode) {
           setSharedCode(problem.baseCode[sharedLanguage]);
       }
    }
  }, [problem, sharedLanguage]);

  const handleChange = (value) => {
    setSharedCode(value);
    socket.emit("code_change", {
      room: roomId,
      code: value
    });
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSharedLanguage(newLang);
    if (problem && problem.baseCode && problem.baseCode[newLang]) {
       const templateCode = problem.baseCode[newLang];
       setSharedCode(templateCode);
       socket.emit("code_change", { room: roomId, code: templateCode });
    }
  };

  const runCode = async () => {
    if (!problem) return;
    setIsRunning(true);
    setOutput("Executing against test cases...");
    setTestResults(null);

    try {
      const response = await axios.post("http://localhost:5000/api/execute", {
        code: sharedCode,
        language: sharedLanguage,
        testCases: problem.testCases
      });
      
      const { allPassed, results } = response.data;
      setTestResults(results);
      if (allPassed) {
         setOutput("✅ Accepted! All test cases passed.");
      } else {
         setOutput("❌ Wrong Answer. Some test cases failed.");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Error running code. Please check your syntax and backend connection.";
      setOutput("Error: " + errMsg);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#1e1e1e", width: "100%" }}>
      {/* Editor Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#333", color: "white" }}>
        <div>
          <label style={{marginRight: "10px", fontSize: "14px"}}>Language:</label>
          <select value={sharedLanguage} onChange={handleLanguageChange} style={{ padding: "4px", borderRadius: "4px", background: "#444", color: "white", border: "1px solid #555" }}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c++">C++</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
             onClick={runCode} 
             disabled={isRunning}
             style={{ background: isRunning ? "#555" : "#0e639c", color: "white", padding: "6px 16px", border: "none", borderRadius: "4px", cursor: isRunning ? "not-allowed" : "pointer", fontWeight: "bold" }}>
            {isRunning ? "Running..." : "Run Code"}
          </button>
          <button 
             onClick={runCode} 
             disabled={isRunning}
             style={{ background: isRunning ? "#555" : "#2ea043", color: "white", padding: "6px 16px", border: "none", borderRadius: "4px", cursor: isRunning ? "not-allowed" : "pointer", fontWeight: "bold" }}>
            Submit
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div style={{ flex: 1, borderBottom: "1px solid #333", overflow: "hidden" }}>
        <Editor
          height="100%"
          width="100%"
          language={sharedLanguage === "c++" ? "cpp" : sharedLanguage}
          theme="vs-dark"
          value={sharedCode}
          onChange={handleChange}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>

      {/* Output Console */}
      <div style={{ height: "250px", background: "#1e1e1e", color: "#d4d4d4", padding: "10px", overflowY: "auto", borderTop: "2px solid #333" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#c586c0" }}>Console Output</h4>
        <div style={{ fontFamily: "monospace", fontSize: "14px", whiteSpace: "pre-wrap" }}>
          {output}
        </div>
        {testResults && (
           <div style={{marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px"}}>
               {testResults.map((tr, idx) => (
                  <div key={idx} style={{ padding: "10px", borderRadius: "6px", background: tr.passed ? "rgba(46,160,67,0.15)" : "rgba(248,81,73,0.15)", border: `1px solid ${tr.passed ? "#2ea043" : "#f85149"}` }}>
                     <div style={{fontWeight: "bold", color: tr.passed ? "#3fb950" : "#ff7b72"}}>
                        Test Case {tr.testCase}: {tr.passed ? "Passed" : "Failed"}
                     </div>
                     <div style={{fontSize: "13px", marginTop: "5px", wordBreak: "break-all"}}>
                        <strong>Input:</strong> {tr.input}<br/>
                        <strong>Expected:</strong> {tr.expectedOutput}<br/>
                        <strong>Output:</strong> {tr.actualOutput}
                        {tr.stderr && <span style={{color: "#ff7b72"}}><br/><strong>Error:</strong> {tr.stderr}</span>}
                     </div>
                  </div>
               ))}
           </div>
        )}
      </div>
    </div>
  );
}

export default CodeEditor;