import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Order from '../../models/Order.js';
import User from '../../models/User.js';
import Product from '../../models/Product.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe('Order Model', () => {
  it('deve criar um pedido válido', async () => {
    const fakeUser = await User.create({
      name: 'Usuário Teste',
      email: 'teste@email.com',
      password: 'senha123',
      role: 'user',
      address: 'Rua Falsa, 123'
    });

    const fakeProduct = await Product.create({
      name: 'Produto Teste',
      price: 50,
      stock: 10,
      category: new mongoose.Types.ObjectId(), // ou uma categoria válida
      supplier: new mongoose.Types.ObjectId()
    });

    const order = await Order.create({
      user: fakeUser._id,
      product: fakeProduct._id,
      quantity: 2,
      totalPrice: 100
    });

    expect(order._id).toBeDefined();
    expect(order.quantity).toBe(2);
    expect(order.totalPrice).toBe(100);
    expect(order.user.toString()).toBe(fakeUser._id.toString());
    expect(order.product.toString()).toBe(fakeProduct._id.toString());
  });

  it('deve falhar se campos obrigatórios estiverem ausentes', async () => {
    try {
      await Order.create({});
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.user).toBeDefined();
      expect(err.errors.product).toBeDefined();
      expect(err.errors.quantity).toBeDefined();
      expect(err.errors.totalPrice).toBeDefined();
    }
  });
});
