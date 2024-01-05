const express = require("express");
const app = express();
const http = require("http")
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server)

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

server.listen(3000, () => {
    console.log('listening on port *:3000')
});

io.on('conection', (socket) => {
    console.log("a user conected")
    socket.on('disconnect', () => {
        console.log("user disconnected")
    })
})

io.on('connection', (socket) => {
socket.on("message", (msg) => {
    io.emit("message", msg)
})
});
