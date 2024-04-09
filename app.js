const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const authRoutes = require('./routes/authRoutes'); // 确保路径正确
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;

const Message = require('./models/Message');

const bcrypt = require('bcrypt');
const User = require('./models/User');


module.exports = app;

require('./db');


app.get('/', (req, res) => {
    res.send('Welcome to the Chat App!');
});


app.use(express.json());

app.use(authRoutes);

// 修正了这里的路由处理器
// app.get('/api/messages', (req, res) => {
//     const sampleMessages = [
//         { id: 1, message: "Hello from the server!" },
//         { id: 2, message: "Here's another message." }
//     ];
//     res.json(sampleMessages);
// });



app.get('/api/messages', async(req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



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



app.post('/register', async(req, res) => {
    try {
        // 哈希密码
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // 创建新用户
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        // 保存用户并返回结果
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/auth/login', async(req, res) => {
    console.log(req.body); // 查看请求体
    try {
        const user = await User.findOne({ username: req.body.username });
        console.log(user); // 检查数据库中是否找到用户
        if (user) {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            console.log(isMatch); // 检查密码是否匹配
            if (isMatch) {
                // ... 生成JWT的代码 ...
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




// 使用server.listen而不是app.listen
server.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

app.post('/api/messages', async(req, res) => {
    try {
        const newMessage = new Message({ message: req.body.message });
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error("Failed to save message:", error);
        res.status(400).json({ message: "Failed to save message" });
    }
});