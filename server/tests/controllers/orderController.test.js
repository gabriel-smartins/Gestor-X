import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';
import { addOrder, getOrders } from '../../controllers/orderController.js';
import * as ProductModule from '../../models/Product.js';
import * as OrderModule from '../../models/Order.js';

describe('Pedidos - Controladores', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addOrder', () => {
    it('deve retornar 201 ao criar pedido com sucesso', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          productId: 'prod123',
          quantity: 2
        },
        user: { _id: 'user123' },
      });
      const res = httpMocks.createResponse();

      const fakeProduct = {
        stock: 5,
        price: 50,
        save: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(ProductModule.default, 'findById').mockResolvedValue(fakeProduct);
      jest.spyOn(OrderModule.default.prototype, 'save').mockResolvedValue(true);

      await addOrder(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toMatchObject({
        success: true,
        message: 'Pedido criado com sucesso',
        order: expect.objectContaining({
          quantity: 2,
          totalPrice: 100
        }),
      });
    });

    it('deve retornar 404 se o produto não for encontrado', async () => {
      const req = httpMocks.createRequest({
        body: { productId: 'inexistente', quantity: 1 },
        user: { _id: 'user123' },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(ProductModule.default, 'findById').mockResolvedValue(null);

      await addOrder(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().error).toMatch(/Produto não encontrado/);
    });

    it('deve retornar 500 se ocorrer erro inesperado', async () => {
      const req = httpMocks.createRequest({
        body: { productId: 'qualquer', quantity: 1 },
        user: { _id: 'user123' },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(ProductModule.default, 'findById').mockRejectedValue(new Error('Erro simulado'));

      await addOrder(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData().success).toBe(false);
    });
  });

  describe('getOrders', () => {
    it('deve retornar 200 com todos os pedidos se for admin', async () => {
      const req = httpMocks.createRequest({
        params: {},
        user: { role: 'admin' },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(OrderModule.default, 'find').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(['pedido1', 'pedido2']),
      });

      await getOrders(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ success: true, orders: ['pedido1', 'pedido2'] });
    });

    it('deve retornar 200 com pedidos do usuário se for comum', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'user123' },
        user: { role: 'user' },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(OrderModule.default, 'find').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(['pedidoUser']),
      });

      await getOrders(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ success: true, orders: ['pedidoUser'] });
    });

    it('deve retornar 500 se falhar ao buscar pedidos', async () => {
      const req = httpMocks.createRequest({
        params: {},
        user: { role: 'admin' },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(OrderModule.default, 'find').mockImplementation(() => {
        throw new Error('Erro de banco');
      });

      await getOrders(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData().error).toMatch(/Falha ao buscar pedidos/);
    });
  });
});
