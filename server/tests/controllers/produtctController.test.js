import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../../controllers/productController.js';

import * as ProductModule from '../../models/Product.js';
import * as CategoryModule from '../../models/Category.js';
import * as SupplierModule from '../../models/Supplier.js';

describe('Produto - Controladores', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addProduct', () => {
    it('deve retornar 201 ao criar produto com sucesso', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          name: 'Celular',
          description: 'Smartphone',
          price: 1999,
          stock: 10,
          category: '123',
          supplier: '456',
        },
      });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default.prototype, 'save')
        .mockResolvedValue({ name: 'Celular' });

      await addProduct(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        success: true,
        message: 'Produto criado com sucesso',
      });
    });

    it('deve retornar 500 se save falhar', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: {},
      });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default.prototype, 'save')
        .mockRejectedValue(new Error('Falha simulada'));

      await addProduct(req, res);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('getProducts', () => {
    it('deve retornar 201 com produtos, categorias e fornecedores', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      jest.spyOn(ProductModule.default, 'find').mockReturnValue({
        populate: () => ({
          populate: () => ['Produto A', 'Produto B'],
        }),
      });

      jest
        .spyOn(CategoryModule.default, 'find')
        .mockResolvedValue(['Categoria A']);
      jest
        .spyOn(SupplierModule.default, 'find')
        .mockResolvedValue(['Fornecedor A']);

      await getProducts(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        success: true,
        products: ['Produto A', 'Produto B'],
        categories: ['Categoria A'],
        suppliers: ['Fornecedor A'],
      });
    });

    it('deve retornar 500 em erro inesperado', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, 'find')
        .mockImplementation(() => {
          throw new Error('Falha');
        });

      await getProducts(req, res);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('updateProduct', () => {
    it('deve retornar 201 ao atualizar produto existente', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        params: { id: '123' },
        body: {
          name: 'Novo Nome',
          description: 'Nova descrição',
          price: 100,
          stock: 5,
          category: 'Cat1',
          supplier: 'Sup1',
        },
      });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, 'findById')
        .mockResolvedValue({ _id: '123' });

      jest
        .spyOn(ProductModule.default, 'findByIdAndUpdate')
        .mockResolvedValue({ updated: true });

      await updateProduct(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        success: true,
        updateUser: { updated: true },
      });
    });

    it('deve retornar 404 se produto não existir', async () => {
      const req = httpMocks.createRequest({ params: { id: '123' } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, 'findById')
        .mockResolvedValue(null);

      await updateProduct(req, res);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('deleteProduct', () => {
    it('deve retornar 201 ao deletar produto', async () => {
      const req = httpMocks.createRequest({ params: { id: '789' } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, 'findById')
        .mockResolvedValue({ _id: '789', isDeleted: false });

      jest
        .spyOn(ProductModule.default, 'updateOne')
        .mockResolvedValue({ acknowledged: true });

      await deleteProduct(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toHaveProperty('success', true);
    });

    it('deve retornar 404 se produto não for encontrado', async () => {
      const req = httpMocks.createRequest({ params: { id: '999' } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, 'findById')
        .mockResolvedValue(null);

      await deleteProduct(req, res);

      expect(res.statusCode).toBe(404);
    });

    it('deve retornar 400 se produto já estiver deletado', async () => {
      const req = httpMocks.createRequest({ params: { id: '789' } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, 'findById')
        .mockResolvedValue({ _id: '789', isDeleted: true });

      await deleteProduct(req, res);

      expect(res.statusCode).toBe(400);
    });

    it('deve retornar 500 em erro inesperado', async () => {
      const req = httpMocks.createRequest({ params: { id: 'error' } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, 'findById')
        .mockRejectedValue(new Error('Falha'));

      await deleteProduct(req, res);

      expect(res.statusCode).toBe(500);
    });
  });
});
