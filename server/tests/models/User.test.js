import mongoose from 'mongoose';
import User from '../../models/User.js';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

it('deve falhar ao salvar usuário com email duplicado', async () => {

    await User.syncIndexes();

  const user1 = new User({
    name: 'Usuário 1',
    email: 'duplicado@email.com',
    password: 'senha1',
  });

  const user2 = new User({
    name: 'Usuário 2',
    email: 'duplicado@email.com',
    password: 'senha2',
  });

  await user1.save();

  let erro = null;
  try {
    await user2.save();
  } catch (e) {
    erro = e;
  }

  expect(erro).not.toBeNull();
  expect(erro.message).toMatch(/duplicate key error/);
});
