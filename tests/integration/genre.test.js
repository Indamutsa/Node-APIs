//This will run the server every time but the server will be already on
//So it will crash, so we need the server everytime a test is done
// let server = require('../../index');

//This module is like jest but it can communicate with http and other external dependencies
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;


//-----------------------------This is the integration test for api /api/genres
describe('/api/genres', () => {

    //For every test operation below in this function, we want to start the server and close it
    //Because it would make sure the server does not stay on and the next time crashes because
    //port conflict
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        server.close();
        //After closing the server we need to clean the database, pretty after each test operation
        await Genre.remove({});
    });

    //Here we test the above api that returns all genres
    describe('GET /', () => {
        it('should return all genres', async () => {

            //We insert in the database which will be cleaned afterwards
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            //We get the repsonse from the http api provides
            const response = await request(server).get('/api/genres');

            //We test the response if it came with 200 Ok
            expect(response.status).toBe(200);

            //We the size of the array returned
            expect(response.body.length).toBe(2);

            //We check if the array contains the above inserted elements
            expect(response.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(response.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    //The first test  ||  Here we test returning the single genre
    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            //We create an object and populate
            const genre = new Genre({ name: 'genre1' });

            //We save it
            await genre.save();

            //We retrieve the response
            const response = await request(server).get('/api/genres/' + genre._id);

            //We expect http 200
            expect(response.status).toBe(200);

            //We expect a name property
            expect(response.body).toHaveProperty('name', genre.name);
        });
    });

    //The first test  ||  Here we test returning the single genre
    describe('GET /:id', () => {
        it('should return a 404 if invalid id is passed', async () => {

            //We retrieve the response
            const response = await request(server).get('/api/genres/1');

            //We expect http 200
            expect(response.status).toBe(404);
        });
    });

    //Testing the AUTHENTICATION and AUTHORIZATION while posting , or adding in the database
    describe('POST /', () => {
        //-------------------------------------------------------------------------

        //Writing the clean test
        //Define the path, and then in each test, we change one parameter that clearly aligns
        //with the name of the test.

        //-----------------------------------------------------------------------        

        let token;
        let name;

        //This is our happy path
        const execute = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(() => {
            //We first need to login to do anything, so we first generate the token to use
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        //The first test || Return 401, if the client is not logged in || unauthorized
        it('should return 401 if the client is not logged in', async () => {

            //This is the value we only need to change, so we change it here
            token = '';

            const res = await execute();

            expect(res.status).toBe(401);
        });

        //The first test || Return 400, if genre is invalid(less than 5 characters) || 400: Bad request
        it('should return 400 if the genre is less than 5 characters', async () => {
            name = '1234';

            const res = await execute();
            expect(res.status).toBe(400);
        });

        //The first test || Return 400, if genre is invalid(less than 5 characters) || 400: Bad request
        it('should return 400 if the genre is more than 50 characters', async () => {


            name = new Array(52).join('a');

            const res = await execute();

            expect(res.status).toBe(400);
        });

        //To make sure it is saving the genre that is valid
        it('should save genre if it is valid', async () => {

            //We first need to login to do anything, so we first generate the token to use

            //This is the original with repetitive code -- execute and token was automated
            token = new User().generateAuthToken();

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'genre1' });

            const genre = await Genre.find({ name: 'genre1' });

            expect(res.status).toBe(200);
            expect(genre).not.toBeNull();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});


