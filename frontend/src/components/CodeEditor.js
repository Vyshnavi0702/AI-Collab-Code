import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import socket from "../socket";

function CodeEditor() {

  const { roomId } = useParams();

  const [code, setCode] = useState("// Start coding here");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");

  useEffect(() => {

    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("code-update");
    };

  }, [roomId]);

  const handleChange = (value) => {

    setCode(value);

    socket.emit("code-change", {
      roomId: roomId,
      code: value
    });

  };

  const runCode = async () => {

  setOutput("Running...");

  try {

    const response = await axios.post(
      "http://localhost:5000/run",
      {
        code: code
      }
    );

    setOutput(response.data.output);

  } catch (error) {

    console.error(error);
    setOutput("Error running code");

  }

};
  return (
    <div>

      <div style={{ marginBottom: "10px" }}>

        <label>Select Language: </label>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python3">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <button
          onClick={runCode}
          style={{ marginLeft: "10px" }}
        >
          Run Code
        </button>

      </div>

      <Editor
        height="60vh"
        language={language}
        value={code}
        onChange={handleChange}
      />

      <div style={{ marginTop: "20px" }}>
        <h3>Output</h3>
        <pre>{output}</pre>
      </div>

    </div>
  );

}

export default CodeEditor;