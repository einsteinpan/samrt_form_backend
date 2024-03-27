const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const authRoutes = require('./routes/authRoutes'); // 确保路径正确

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;

module.exports = app;

require('./db');

app.use(express.json());

app.use(authRoutes);

// 修正了这里的路由处理器
app.get('/', (req, res) => {
    res.send('Hello, World!');
}); // 添加了缺失的大括号和分号

io.on('connection', (socket) => {
    console.log('A user connected');

    // 监听来自客户端的消息
    socket.on('chat message', (msg) => {
        // 广播消息给所有客户端
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// 使用server.listen而不是app.listen
server.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});