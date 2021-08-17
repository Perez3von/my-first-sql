require('dotenv').config();

const { execSync } = require('child_process');
//const exp = require('constants');
//const { send } = require('process');

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
          loves_music: false,
          color:'blue'
        },
        {
          id:2,
          name: 'Justin',
          cool_factor: 10,
          loves_music: true,
          color:'red'
        },
        {
          id:3,
          name: 'Juli',
          cool_factor: 100,
          loves_music: true,
          color:'red'
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
        loves_music: false,
        color:'blue'
      }
      ;

      const data = await fakeRequest(app)
        .get('/people/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    //-------------------------------------------------------------------------------------------
    test('creates person with post', async() => {

      const person = { 
        name: 'Miya',
        cool_factor: 98,
        loves_music: true,
        shirt_color:3
      }
  ;

      const data = await fakeRequest(app)
        .post('/people')
        .send(person)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.name).toEqual(person.name);
      expect(data.body.shirt_color).toEqual(person.shirt_color);
      expect(data.body.id).toBeGreaterThan(0);
    });
    //-------------------------------------------------------------------------------------------
    test('PUT ', async() => {

      const person = { 
        name: 'Jerry',
        cool_factor: 33,
        loves_music: false,
        shirt_color:1
      };

      const data = await fakeRequest(app)
        .put('/people/1')
        .send(person)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.name).toEqual(person.name);
      expect(data.body.cool_factor).toEqual(person.cool_factor);
      expect(data.body.loves_music).toEqual(person.loves_music);
      expect(data.body.shirt_color).toEqual(person.shirt_color);


    });
    //-------------------------------------------------------------------------------------------
  });
});







