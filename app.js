require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // 确保路径正确
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json()); // 用于解析 JSON 请求体

// Socket.io 连接处理
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// 认证和消息路由
app.use(authRoutes);

const port = process.env.PORT || 3000; // 使用环境变量或默认端口3000

// 引入 googleService
const googleService = require('./googleService');


app.post('/analyze-text', async(req, res) => {
    try {
        const text = req.body.text;
        const analysisResults = await googleService.analyzeText(text);
        res.json(analysisResults);
    } catch (error) {
        console.error('Error processing the /analyze-text request:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/', (req, res) => {
    res.send('Welcome to the Chat App!');
});

app.get('/api/messages', async(req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/register', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/auth/login', async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (isMatch) {
                // 生成JWT等逻辑...
                res.send('登录成功');
            } else {
                res.status(401).send('认证失败');
            }
        } else {
            res.status(401).send('认证失败');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('服务器内部错误');
    }
});

// 设置监听的端口
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
    } else {
        console.error(`Failed to start server: ${error}`);
    }
});