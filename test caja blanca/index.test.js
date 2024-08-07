const request = require('supertest');
const app = require('./index'); 

describe('Test de rutas básicas', () => {
  it('Debería responder con un 200 en la ruta principal', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('Debería responder con un 404 en una ruta no definida', async () => {
    const response = await request(app).get('/ruta-no-existe');
    expect(response.statusCode).toBe(404);
  });
});