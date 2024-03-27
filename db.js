const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/chatApp'; // 'chatApp'是数据库名称，根据需要更改
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

.then(() => console.log('MongoDB connected...'))
    .catch((err) => console.error(err));

module.exports = mongoose;