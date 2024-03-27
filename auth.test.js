const request = require('supertest');
const app = require('./app'); // 请根据你的项目结构调整路径

describe('Authentication API', () => {
    describe('POST /api/register', () => {
        it('should register a new user and return user data', async() => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    username: 'testuser',
                    password: 'password123',
                    email: 'test@example.com'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('user');
            // 这里添加更多断言，根据你API的实际响应格式
        });
    });

    describe('POST /api/login', () => {
        it('should authenticate the user and return a token', async() => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    username: 'testuser',
                    password: 'password123'
                });
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('token');
            // 添加更多断言，根据你API的实际响应格式
        });
    });
});