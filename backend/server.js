require('dotenv').config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const Question = require("./models/Question");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ai-collab-code";
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---

// Root route
app.get("/", (req, res) => {
  res.send("AI Collab Backend Running 🚀");
});

// Fetch all questions
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find({});
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Fetch a single question by ID
app.get("/api/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch question" });
  }
});

// AI Help Endpoint
app.post("/api/ai-help", async (req, res) => {
  const { code, language, error, questionContext, prompt } = req.body;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey === "dummy_key") {
    // Simulated AI Fallback
    let simulatedResponse = "**[Simulated AI Mode]** Please add a real Gemini API Key to `backend/.env` for a real LLM connection!\n\n";
    
    if (questionContext && questionContext.toLowerCase().includes("palindrome")) {
       if (code && (code.includes("len(s)/2") || code.includes("s[0] == 1"))) {
           simulatedResponse += "I noticed an error in your Python code! `len(s)/2` results in a float, which causes a TypeError in `range()`. Use integer division `len(s)//2` instead. Also, `s[0] == 1` compares a string character to an integer.";
       } else {
           simulatedResponse += "Hint: A palindrome reads the same forwards and backwards! Try reversing the string or using two pointers.";
       }
    } else if (questionContext && questionContext.includes("Two Sum")) {
       simulatedResponse += "Hint for Two Sum: Try using a Dictionary/Hash Map to store numbers and their indices as you iterate!";
    } else {
       simulatedResponse += "Your code looks interesting! Keep trying.";
    }

    return res.json({ response: simulatedResponse });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const fullPrompt = `You are a helpful coding assistant working in a LeetCode-style environment. 
User's Question Context: ${questionContext}
User's Code Language: ${language}
User's Current Code:
${code}
User's Current Error (if any): ${error || "None"}
User's Chat Message: ${prompt}

Provide a concise, helpful response. Do not give the full answer immediately unless asked. Just help them debug or explain the concept.`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    res.json({ response: text });
  } catch (err) {
    const errorMsg = err.message || "Failed to fetch response from AI.";
    console.error("AI Error:", errorMsg);
    res.status(500).json({ error: errorMsg });
  }
});

// Execute Code Endpoint using LOCAL Execution (Since Piston is whitelisted)
app.post("/api/execute", async (req, res) => {
  const { code, language, testCases } = req.body;
  const execMap = {
    javascript: { ext: "js", cmd: "node" },
    python: { ext: "py", cmd: "python" } // Or python3 on linux
  };

  if (!execMap[language]) {
      return res.status(400).json({ error: `Language ${language} not currently supported for local execution.` });
  }

  const { ext, cmd } = execMap[language];
  const filename = `temp_${Date.now()}.${ext}`;
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, code);

  try {
    const results = [];
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        let argsArray = [];
        
        if (typeof testCase.input === "string") {
            argsArray = testCase.input.match(/(?:[^\s"]+|"[^"]*")+/g).map(s => s.replace(/(^"|"$)/g, '')) || [];
        }

        const argsStr = argsArray.map(a => `\\"${a}\\"`).join(" "); // simple escaping
        const commandLine = `${cmd} ${filename} ${argsStr}`;

        const output = await new Promise((resolve) => {
           const child = exec(commandLine, { cwd: __dirname, timeout: 3000 }, (error, stdout, stderr) => {
               resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
           });
           // provide stdin so that if the user writes input() it doesn't hang the process until timeout
           child.stdin.write(testCase.input + "\\n");
           child.stdin.end();
        });

        const expected = (testCase.expectedOutput || "").trim();
        results.push({
            testCase: i + 1,
            input: testCase.input,
            expectedOutput: expected,
            actualOutput: output.stdout,
            passed: output.stdout === expected,
            stderr: output.stderr
        });
    }

    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

    const allPassed = results.every(r => r.passed);
    res.json({ allPassed, results });

  } catch (err) {
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    const errorMsg = err.message || "Local execution failed";
    console.error("Execution error:", errorMsg);
    res.status(500).json({ error: errorMsg });
  }
});

const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log("User joined room:", roomId);
  });

  // Chat messages
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // Code collaboration
  socket.on("code_change", (data) => {
    socket.to(data.room).emit("receive_code", data.code);
  });

  // WebRTC Signaling
  socket.on("call_user", (data) => {
    // Notify others in the room about the call
    socket.to(data.room).emit("receive_call", { signal: data.signal, from: socket.id });
  });

  socket.on("answer_call", (data) => {
    // accept the call and send signal back
    io.to(data.to).emit("call_accepted", { signal: data.signal, from: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// IMPORTANT: Use Render port
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});