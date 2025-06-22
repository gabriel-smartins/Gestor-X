import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';
import {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} from '../../controllers/supplierController.js';

import * as SupplierModule from '../../models/Supplier.js';
import * as ProductModule from '../../models/Product.js';

describe('Fornecedor - Controladores', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addSupplier', () => {
    it('deve retornar 400 se o fornecedor já existir', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { name: 'Fornecedor A', email: 'a@email.com' },
      });
      const res = httpMocks.createResponse();

      jest
        .spyOn(SupplierModule.default, 'findOne')
        .mockResolvedValue({ email: 'a@email.com' });

      await addSupplier(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().error).toMatch(/Fornecedor já existe/i);
    });

    it('deve retornar 201 ao adicionar fornecedor com sucesso', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          name: 'Fornecedor B',
          email: 'b@email.com',
          phone: '9999-9999',
          address: 'Rua X',
        },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(SupplierModule.default, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(SupplierModule.default.prototype, 'save')
        .mockResolvedValue({ name: 'Fornecedor B' });

      await addSupplier(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().message).toMatch(/criado com sucesso/i);
    });

    it('deve retornar 500 em erro inesperado', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: {},
      });
      const res = httpMocks.createResponse();

      jest
        .spyOn(SupplierModule.default, 'findOne')
        .mockRejectedValue(new Error('Erro simulado'));

      await addSupplier(req, res);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('getSuppliers', () => {
    it('deve retornar 201 com a lista de fornecedores', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      jest
        .spyOn(SupplierModule.default, 'find')
        .mockResolvedValue([{ name: 'F1' }, { name: 'F2' }]);

      await getSuppliers(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().suppliers.length).toBe(2);
    });

    it('deve retornar 500 em erro', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      jest
        .spyOn(SupplierModule.default, 'find')
        .mockRejectedValue(new Error('Erro simulado'));

      await getSuppliers(req, res);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('updateSupplier', () => {
    it('deve retornar 404 se fornecedor não for encontrado', async () => {
      const req = httpMocks.createRequest({
        params: { id: '123' },
        body: { name: 'Novo' },
      });
      const res = httpMocks.createResponse();

      jest
        .spyOn(SupplierModule.default, 'findById')
        .mockResolvedValue(null);

      await updateSupplier(req, res);

      expect(res.statusCode).toBe(404);
    });

    it('deve retornar 201 ao atualizar fornecedor', async () => {
      const req = httpMocks.createRequest({
        params: { id: '123' },
        body: {
          name: 'Novo',
          email: 'novo@email.com',
          phone: '9999-9999',
          address: 'Rua Nova',
        },
      });
      const res = httpMocks.createResponse();

      jest
        .spyOn(SupplierModule.default, 'findById')
        .mockResolvedValue({ _id: '123' });

      jest
        .spyOn(SupplierModule.default, 'findByIdAndUpdate')
        .mockResolvedValue({ updated: true });

      await updateSupplier(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().success).toBe(true);
    });
  });


  describe('deleteSupplier', () => {
    it('deve retornar 400 se houver produtos associados', async () => {
      const req = httpMocks.createRequest({ params: { id: '123' } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, 'countDocuments')
        .mockResolvedValue(2);

      await deleteSupplier(req, res);

      expect(res.statusCode).toBe(400);
    });

    it('deve retornar 404 se fornecedor não for encontrado', async () => {
      const req = httpMocks.createRequest({ params: { id: '123' } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, 'countDocuments')
        .mockResolvedValue(0);
      jest
        .spyOn(SupplierModule.default, 'findByIdAndDelete')
        .mockResolvedValue(null);

      await deleteSupplier(req, res);

      expect(res.statusCode).toBe(404);
    });

    it('deve retornar 201 ao deletar com sucesso', async () => {
      const req = httpMocks.createRequest({ params: { id: '123' } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, 'countDocuments')
        .mockResolvedValue(0);
      jest
        .spyOn(SupplierModule.default, 'findByIdAndDelete')
        .mockResolvedValue({ name: 'Fornecedor A' });

      await deleteSupplier(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().success).toBe(true);
    });

    it('deve retornar 500 se ocorrer erro inesperado', async () => {
      const req = httpMocks.createRequest({ params: { id: '123' } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, 'countDocuments')
        .mockRejectedValue(new Error('Erro inesperado'));

      await deleteSupplier(req, res);

      expect(res.statusCode).toBe(500);
    });
  });
});
