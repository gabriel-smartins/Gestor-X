import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Supplier from '../../models/Supplier.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'testDB' });
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Supplier Model', () => {
  it('deve criar um fornecedor válido', async () => {
    const supplierData = {
      name: 'Fornecedor Exemplo',
      email: 'contato@exemplo.com',
      phone: '11999999999',
      address: 'Rua das Flores, 123',
    };

    const supplier = new Supplier(supplierData);
    const saved = await supplier.save();

    expect(saved._id).toBeDefined();
    expect(saved.name).toBe('Fornecedor Exemplo');
    expect(saved.email).toBe('contato@exemplo.com');
    expect(saved.phone).toBe('11999999999');
    expect(saved.address).toBe('Rua das Flores, 123');
    expect(saved.createdAt).toBeDefined();
  });

  it('deve falhar se o nome não for informado', async () => {
    try {
      const supplier = new Supplier({});
      await supplier.save();
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.name).toBeDefined();
      expect(err.errors.name.message).toMatch(/Nome de fornecedor obrigatorio/);
    }
  });

  it('deve falhar se o nome tiver menos de 2 caracteres', async () => {
    try {
      const supplier = new Supplier({ name: 'A' });
      await supplier.save();
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.name).toBeDefined();
      expect(err.errors.name.message).toMatch(/pelo menos 2 caracteres/);
    }
  });

  it('deve permitir criar sem email, telefone ou endereço', async () => {
    const supplier = new Supplier({ name: 'Fornecedor Simples' });
    const saved = await supplier.save();

    expect(saved._id).toBeDefined();
    expect(saved.name).toBe('Fornecedor Simples');
    expect(saved.email).toBeUndefined();
    expect(saved.phone).toBeUndefined();
    expect(saved.address).toBeUndefined();
  });
});
