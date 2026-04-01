# AI CollabCode 🚀

[![Deployment Status](https://img.shields.io/badge/Deployment-Live-success)](https://ai-collab-code.vercel.app)

**AI CollabCode** is a professional, real-time collaborative coding platform designed to provide a premium LeetCode-style environment. It features a modern 3-panel grid layout, seamless real-time code execution, integrated communication tools, and a built-in AI tutor to assist in problem-solving.

🔗 **Live Demo:** [https://ai-collab-code.vercel.app](https://ai-collab-code.vercel.app)

---

## ✨ Features

- **Real-Time Collaborative Editing:** Code simultaneously with your peers using the integrated Monaco Editor, synchronized instantly via WebSockets.
- **Multi-Language Support:** Write, run, and test code in JavaScript, Python, Java, and C++.
- **Integrated Video & Text Chat:** Communicate seamlessly with your peers through built-in WebRTC video/audio chat and text messaging.
- **AI Coding Assistant:** Get instant guidance, hints, and explanations from a powerful AI Tutor powered by Google GenAI.
- **Premium UI/UX:** A clean, distraction-free, dark-themed 3-panel grid layout separating the Problem/AI, Code Editor, and Communication tools.
- **Robust Code Execution:** Backend code execution engine to compile, run, and evaluate code against predefined test cases in real-time.
- **Problem Library:** Access a curated list of coding problems, complete with descriptions, base templates, and test cases.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js
- **Code Editor:** Monaco Editor (`@monaco-editor/react`)
- **Real-Time Communication:** Socket.io-client, Simple-Peer (WebRTC)
- **Routing:** React Router DOM
- **HTTP Client:** Axios

### Backend
- **Environment:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **WebSockets:** Socket.io
- **AI Integration:** Google Generative AI (`@google/generative-ai`)

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### Prerequisites
- [Node.js](https://nodejs.org/)
- MongoDB (Local or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Vyshnavi0702/AI-Collab-Code.git
cd AI-Collab-Code
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the necessary environment variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
node server.js
```

*(Optional) Seed the database with sample problems:*
```bash
node seed.js
```

### 3. Frontend Setup
Open a new terminal instance and navigate to the frontend directory:
```bash
cd ../frontend
npm install
```

Start the React development server:
```bash
npm start
```

The application will be running at `http://localhost:3000`.

---

## 📂 Project Structure

```
AI-Collab-Code/
├── backend/
│   ├── models/        # Mongoose schemas (Problem, Room, etc.)
│   ├── package.json
│   ├── seed.js        # Script to seed database with problems
│   └── server.js      # Main Express/Socket.io server
├── frontend/
│   ├── src/
│   │   ├── components/# Reusable UI components (Chat, CodeEditor, VideoChat, AIHelper)
│   │   ├── pages/     # Main views (Home, Room)
│   │   ├── App.js     # React Router setup
│   │   └── socket.js  # Socket.io client initialization
│   └── package.json
└── README.md
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is open-source and available under the ISC License.
