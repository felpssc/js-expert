const request = require('supertest');

const { Api } = require('./Api');

const { deepStrictEqual } = require('assert');

describe('API Suite test', () => {
  describe('/contact', () => {
    it('should request the contact page and return HTTP Status 200', async () => {
      const response = await request(new Api().handle)
        .get('/contact')
        .expect(200);

      deepStrictEqual(response.text, 'Contact us page');
    });
  })

  describe('/hello', () => {
    it('should request an inexistent route and redirect to /hello', async () => {
      const response = await request(new Api().handle)
        .get('/inexistent')
        .expect(200);

      deepStrictEqual(response.text, 'Hello World');
    });
  });

  describe('/login', () => {
    it('should login successfully', async () => {
      const response = await request(new Api().handle)
        .post('/login')
        .send({
          username: 'admin',
          password: 'admin'
        })
        .expect(200);

      deepStrictEqual(response.text, 'Login successful');
    });

    it("should fail to login with wrong credentials", async () => {
      const response = await request(new Api().handle)
        .post('/login')
        .send({
          username: 'admin',
          password: 'wrong'
        })
        .expect(401);

      deepStrictEqual(response.status, 401);
    });
  });
});