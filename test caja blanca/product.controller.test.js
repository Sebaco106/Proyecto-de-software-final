const mongoose = require('mongoose');
const { getProduct, createProduct, getProductById, updateProduct, deleteProduct } = require('./product.controller');
const { productModel } = require("../models/product.model");

jest.mock('../models/product.model');

describe('Pruebas de cobertura de decisiones, condición y flujo de datos para el controlador de productos', () => {
  beforeAll(() => {
    console.error = jest.fn(); // Mockea console.error
  });

  afterAll(async () => {
    console.error.mockRestore(); // Restaura console.error después de todas las pruebas
    await mongoose.connection.close(); // Cierra la conexión a MongoDB después de todas las pruebas
  });

  describe('createProduct', () => {
    it('Debería manejar errores al crear un producto', async () => {
      productModel.prototype.save = jest.fn().mockRejectedValue(new Error('Error al registrar el producto'));
      const req = { body: { name: 'Producto', salePrice: 10, purchasePrice: 5, quantity: 1, productType: 'Repuesto de laptops y computadoras' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al registrar el producto' });
      expect(console.error).toHaveBeenCalledWith('Error creating product:', expect.any(Error));
    });

    // Prueba de flujo de datos: Verifica el estado de las variables
    it('Debería asignar correctamente los valores de las variables al crear un producto', async () => {
      const req = { body: { name: 'Nuevo Producto', salePrice: 15, purchasePrice: 10, quantity: 3, productType: 'Repuesto de celulares' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      productModel.prototype.save = jest.fn().mockResolvedValue(req.body);

      await createProduct(req, res);
      expect(productModel.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });

  describe('updateProduct', () => {
    it('Debería actualizar un producto', async () => {
      const product = {
        save: jest.fn().mockResolvedValue({ name: 'Producto Actualizado', quantity: 5 }),
        name: 'Producto',
        salePrice: 10,
        purchasePrice: 5,
        quantity: 1,
        productType: 'Repuesto de laptops y computadoras'
      };
      productModel.findById = jest.fn().mockResolvedValue(product);
      const req = { params: { id: '1' }, body: { name: 'Producto Actualizado', quantity: 5 } };
      const res = { json: jest.fn() };

      await updateProduct(req, res);
      expect(product.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Producto Actualizado', quantity: 5 }));
    });

    it('Debería manejar el caso en que el producto no existe', async () => {
      productModel.findById = jest.fn().mockResolvedValue(null);
      const req = { params: { id: '1' }, body: { name: 'Producto Actualizado', quantity: 5 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await updateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
    });

    // Prueba de flujo de datos: Verifica el estado de las variables al actualizar un producto
    it('Debería asignar correctamente los valores de las variables al actualizar un producto', async () => {
      const product = {
        save: jest.fn().mockResolvedValue({ name: 'Producto Actualizado', quantity: 5 }),
        name: 'Producto',
        salePrice: 10,
        purchasePrice: 5,
        quantity: 1,
        productType: 'Repuesto de laptops y computadoras'
      };
      productModel.findById = jest.fn().mockResolvedValue(product);
      const req = { params: { id: '1' }, body: { name: 'Producto Actualizado', quantity: 5 } };
      const res = { json: jest.fn() };

      await updateProduct(req, res);
      expect(product.save).toHaveBeenCalled();
      expect(product.name).toBe('Producto Actualizado');
      expect(product.quantity).toBe(5);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Producto Actualizado', quantity: 5 }));
    });
  });
});