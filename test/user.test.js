const request = require('supertest')
const app = require('../app')

// test('should signup a new user', async ()=>{
//     await request(app).post('/users').send({
//         name:'grace',
//         email:"grace@example.com",
//         password:'mypass123'
//     }).expect(201)
// },10000)

test('should signup a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'grace',
        email: 'grace@example.com',
        password: 'mypass123'
      })
      .expect(201)
  
    //console.log('Response:', response.body);  // Log the response for debugging
  
    //expect(response.body).toHaveProperty('id'); // Example check
  }, 10000); // Increase timeout to 10 seconds if needed
  