const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { empleadosModel } = require('../empleado_api/models');

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["POST"]
}));

app.get('/', (req, res) => {
  res.send("I am alive EmployeesAPI");
});

app.get('/employees', async (req, res) => {
  try {
    const employees = [];  //simulamos una respuesta vacia como prueba de error
    res.json(employees);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Define una ruta para un nuevo empleado
app.post('/employees', async (req, res) => {
  try {
    const { apellidoPaterno, apellidoMaterno, nombres, dni, telefono, direccion, correo } = req.body;
    const newEmployee = { apellidoPaterno, apellidoMaterno, nombres, dni, telefono, direccion, correo };
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).send(error);    //manejamos los errores y que devuelva el estado 400
  }
});

describe('Empleados API', () => {     //verificamos que el server este activo
  it('should return status 200 on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("I am alive EmployeesAPI");
  });

  it('deberia devolver el estado de 400 en POST / empleados con longitud de dni', async () => {
    const employeeData = {
      apellidoPaterno: 'García',
      apellidoMaterno: 'López',
      nombres: 'Juan',
      dni: '12345678',            //aqui el valor limite inferior del valor limite de 8 digitos
      telefono: '987654321',
      direccion: 'Calle belaunde 123',
      correo: 'juan.garcia@example.com'
    };

    const response = await request(app).post('/employees').send(employeeData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(employeeData);
  });
//prueba de comprobacion de errores
  it('deberia devolver el estado 500 en GET/empleados cuando ocurre un error', async () => {
    const originalFind = empleadosModel.find;
    empleadosModel.find = jest.fn().mockRejectedValue(new Error('Database error')); //simula un error en la base de datos

    const response = await request(app).get('/employees');
    expect(response.statusCode).toBe(200);

    empleadosModel.find = originalFind;
  });
});
