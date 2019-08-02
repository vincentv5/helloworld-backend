const app = require('../app');
const request = require('supertest');


describe("app.post('/user/register')",()=> {

	it('return a json object of the user data',async ()=> {
		const result = await request(app)
		.post('/user/register')
		.send({
			email:'email@gmail.com',
			password:'myscrete'
		});

		expect(result.body)
		.toEqual({email:"email@gmail.com",password:"myscrete"});
		expect(result.statusCode).toBe(200);
		expect(result.body).toHaveProperty('_id');
		expect(result.body).toHaveProperty('email');
		expect(result.body).toHaveProperty('password')

	} )
})