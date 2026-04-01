import { io } from "socket.io-client";

const socket = io("https://ai-collab-backend-t7iv.onrender.com");

export default socket;