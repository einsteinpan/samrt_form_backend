const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // 根据你的项目结构调整路径

const router = express.Router();

// 注册新用户
router.post('/register', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        const newUser = await user.save();
        res.status(201).send({ userId: newUser._id });
    } catch (error) {
        console.error("Register Error:", error); // 添加了错误日志
        res.status(500).send("Error during registration"); // 提供更多具体的错误信息
    }
});

// 用户登录
router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user == null) {
            return res.status(400).send('Cannot find user');
        }

        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success');
        } else {
            res.send('Not Allowed');
        }
    } catch (error) {
        console.error("Login Error:", error); // 添加了错误日志
        res.status(500).send("Error during login"); // 提供更多具体的错误信息
    }
});

module.exports = router;