require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 8000;

// Routers
const userrouter = require("./routes/userRoutes");
const gameLogic = require('./gamelogic/gameLogic');

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

app.use("/user", userrouter);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DataBase connected successfully");
        const server = http.createServer(app);
        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // Initialize game logic with Socket.io
        gameLogic(io);

        server.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.log('Invalid database connection:', error);
    });
