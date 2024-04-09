// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // 确保路径正确
const router = express.Router();

// 用户登录
router.post('/login', async(req, res) => {
    // 根据用户名查找用户
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        // 生成JWT
        const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '24h' });
        res.json({ token: token });
    } else {
        res.status(400).send('用户名或密码错误');
    }
});

module.exports = router;