import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';
import * as UserModel from '../../models/User.js';
import bcrypt from 'bcrypt';
import {
  createUser,
  listUsers,
  fetchUser,
  modifyUser,
  removeUser,
} from '../../controllers/userController.js';

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('deve retornar 400 se e-mail já existir', async () => {
      const req = httpMocks.createRequest({
        body: { email: 'test@email.com' },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(UserModel.default, 'findOne').mockResolvedValue({});

      await createUser(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('deve criar usuário com sucesso', async () => {
      const req = httpMocks.createRequest({
        body: {
          name: 'Test',
          email: 'new@email.com',
          password: '123',
          role: 'user',
          address: 'Av. X',
        },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(UserModel.default, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('encrypted');
      jest
        .spyOn(UserModel.default.prototype, 'save')
        .mockResolvedValue({ name: 'Test' });

      await createUser(req, res);
      expect(res.statusCode).toBe(201);
    });

    it('deve retornar 500 se erro interno ocorrer', async () => {
      const req = httpMocks.createRequest({ body: {} });
      const res = httpMocks.createResponse();

      jest.spyOn(UserModel.default, 'findOne').mockRejectedValue(new Error());

      await createUser(req, res);
      expect(res.statusCode).toBe(500);
    });
  });

  describe('listUsers', () => {
    it('deve listar todos os usuários', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      jest.spyOn(UserModel.default, 'find').mockResolvedValue([{ name: 'U1' }]);

      await listUsers(req, res);
      expect(res.statusCode).toBe(201);
    });

    it('deve retornar 500 se falhar', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      jest.spyOn(UserModel.default, 'find').mockRejectedValue(new Error());

      await listUsers(req, res);
      expect(res.statusCode).toBe(500);
    });
  });

  describe('fetchUser', () => {
    it('deve negar acesso se usuário não for o mesmo', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'abc' },
        user: { _id: 'xyz' },
      });
      const res = httpMocks.createResponse();

      await fetchUser(req, res);
      expect(res.statusCode).toBe(403);
    });

    it('deve retornar 404 se usuário não existir', async () => {
      const req = httpMocks.createRequest({
        params: { id: '123' },
        user: { _id: '123' },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(UserModel.default, 'findById').mockResolvedValue(null);

      await fetchUser(req, res);
      expect(res.statusCode).toBe(404);
    });

  });

  describe('modifyUser', () => {
    
    it('deve retornar 404 se usuário não existir', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'abc' },
        body: {},
      });
      const res = httpMocks.createResponse();

      jest
        .spyOn(UserModel.default, 'findByIdAndUpdate')
        .mockResolvedValue(null);

      await modifyUser(req, res);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('removeUser', () => {
    it('deve deletar com sucesso', async () => {
      const req = httpMocks.createRequest({ params: { id: 'abc' } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(UserModel.default, 'findByIdAndDelete')
        .mockResolvedValue({ _id: 'abc' });

      await removeUser(req, res);
      expect(res.statusCode).toBe(201);
    });

    it('deve retornar 404 se usuário não existir', async () => {
      const req = httpMocks.createRequest({ params: { id: 'abc' } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(UserModel.default, 'findByIdAndDelete')
        .mockResolvedValue(null);

      await removeUser(req, res);
      expect(res.statusCode).toBe(404);
    });

    it('deve retornar 500 em erro inesperado', async () => {
      const req = httpMocks.createRequest({ params: { id: 'abc' } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(UserModel.default, 'findByIdAndDelete')
        .mockRejectedValue(new Error());

      await removeUser(req, res);
      expect(res.statusCode).toBe(500);
    });
  });
});
