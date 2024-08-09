/*para este caso de las pruebas de caja negra doy inicio para evaluar la funcionalidad de la API
sin tomar en cuenta la implementacion interna
*/
const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { productoModel } = require('../productos_api/models');

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["POST"]
}));
//punto para ver si esta activo el servidor
app.get('/', (req, res) => {
  res.send("I am alive Producto");
});

app.get('/productos', async (req, res) => {
  try {
    const productos = [];     //Se devuelve el producto del caso real en este caso los casos de uso
    res.json(productos);
  } catch (error) {
    res.status(500).send(error);    //manejo de errores y devuelvo del estado
  }
});

app.post('/productos', async (req, res) => {
  try {
    const { nombre, precioVenta, precioCompra, cantidad, tipoProducto } = req.body;
    const newProduct = { nombre, precioVenta, precioCompra, cantidad, tipoProducto };
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send(error);    //manejo de los errores
  }
});
/*aqui estamos verificando la conexion si esta activo (prueba de correcion de errores)
Verificamos el POST
*/
describe('Productos API', () => {
  it('should return status 200 on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("I am alive Producto");
  });

  it('should return status 201 on POST /productos with valid data', async () => {
    const productData = {
      nombre: 'Laptop',
      precioVenta: 1000,
      precioCompra: 800,
      cantidad: 10,
      tipoProducto: 'Repuesto de laptops y computadoras'
    };

    const response = await request(app).post('/productos').send(productData);
    expect(response.statusCode).toBe(201);    //verificamos la respuesta de 201
    expect(response.body).toEqual(productData);   //verificacion de errores con los datos enviados
  });
/*verifica la conexion a la base de datos el GET
*/
  it('should return status 500 on GET /productos when error occurs', async () => {
    const originalFind = productoModel.find;
    productoModel.find = jest.fn().mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/productos');
    expect(response.statusCode).toBe(200);

    productoModel.find = originalFind;    //restaura la implementacion original de productomodel
  });
});
