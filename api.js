// 引入 axios
const axios = require('axios');

// 建立函數來調用語言模型
async function callLanguageModel(data) {
    const config = {
        method: 'post',
        url: 'YOUR_LANGUAGE_MODEL_API_ENDPOINT', // 替換成您的語言模型 API 端點
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY', // 替換成您的 API 金鑰，如果需要的話
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        const response = await axios(config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error calling the language model API:', error);
        return null;
    }
}

// 導出函數以在其他檔案中使用
module.exports = { callLanguageModel };