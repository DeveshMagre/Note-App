import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import DbCon from './config/db.js';
import AuthRoutes from './routes/Auth.js';
import NotesRoutes from './routes/Notes.js';
import cookieParser from 'cookie-parser';
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});


export default io;

DbCon();

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(cookieParser());
app.use(express.json());

app.use('/auth', AuthRoutes);
app.use('/notes', NotesRoutes);

app.get('/', (req, res) => {
    res.send('Hello from backend');
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("newNote", () => {
        io.emit("refreshNotes"); 
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`);
});
