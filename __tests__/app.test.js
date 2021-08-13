require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });
//-------------------------------------------------------------------------------------------
    test('returns people', async() => {

      const expectation = [
        {
          id:1,
          name: 'Evon',
          cool_factor: -100,
          loves_music: false
        },
        {
          id:2,
          name: 'Justin',
          cool_factor: 10,
          loves_music: true
        },
        {
          id:3,
          name: 'Juli',
          cool_factor: 100,
          loves_music: true,
      
        }
      ];

      const data = await fakeRequest(app)
        .get('/people')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
//-------------------------------------------------------------------------------------------
    
    test('returns by id', async() => {

      const expectation = { 
        id:1,
        name: 'Evon',
        cool_factor: -100,
        loves_music: false
      }
      ;

      const data = await fakeRequest(app)
        .get('/people/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
//-------------------------------------------------------------------------------------------




  });
});







