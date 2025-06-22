import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Product from '../../models/Product.js';

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

describe('Product Model', () => {
  it('deve criar um produto válido', async () => {
    const mockProduct = new Product({
      name: 'Notebook',
      description: 'Um notebook potente',
      price: 3500,
      stock: 10,
      category: new mongoose.Types.ObjectId(),
      supplier: new mongoose.Types.ObjectId(),
    });

    const savedProduct = await mockProduct.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe('Notebook');
    expect(savedProduct.price).toBe(3500);
    expect(savedProduct.stock).toBe(10);
    expect(savedProduct.isDeleted).toBe(false);
    expect(savedProduct.createdAt).toBeDefined();
    expect(savedProduct.lastUpdated).toBeDefined();
  });

  it('deve falhar se campos obrigatórios estiverem ausentes', async () => {
    try {
      const invalidProduct = new Product({});
      await invalidProduct.save();
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.name).toBeDefined();
      expect(err.errors.price).toBeDefined();
      expect(err.errors.stock).toBeDefined();
      expect(err.errors.category).toBeDefined();
      expect(err.errors.supplier).toBeDefined();
    }
  });

  it('deve falhar se o preço for negativo', async () => {
    try {
      const invalidProduct = new Product({
        name: 'Produto Inválido',
        price: -100,
        stock: 5,
        category: new mongoose.Types.ObjectId(),
        supplier: new mongoose.Types.ObjectId(),
      });
      await invalidProduct.save();
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.price).toBeDefined();
      expect(err.errors.price.message).toMatch(/preço não pode ser negativo/i);
    }
  });

  it('deve falhar se o estoque for negativo', async () => {
    try {
      const invalidProduct = new Product({
        name: 'Produto Inválido',
        price: 100,
        stock: -1,
        category: new mongoose.Types.ObjectId(),
        supplier: new mongoose.Types.ObjectId(),
      });
      await invalidProduct.save();
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.stock).toBeDefined();
      expect(err.errors.stock.message).toMatch(/estoque não pode ser negativo/i);
    }
  });
});
