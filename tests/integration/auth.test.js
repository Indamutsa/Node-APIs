const request = require('supertest');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');

let server;

//This is called a test suites
describe('authorization middleware', () => {

    //For every test operation below in this function, we want to start the server and close it
    //Because it would make sure the server does not stay on and the next time crashes because
    //port conflict

    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        await Genre.remove();
        server.close();
    });

    let token;
    const execute = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await execute();
        expect(res.status).toBe(401);
    });


    it('should return 400 if no token is invalid', async () => {
        token = 'a';
        const res = await execute();
        expect(res.status).toBe(400);
    });


    it('should return 200 if token is valid', async () => {
        const res = await execute();
        expect(res.status).toBe(200);
    });
})