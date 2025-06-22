import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Category from '../../models/Category.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Category.deleteMany();
});

describe('Category Model Test', () => {

  it('deve criar uma categoria válida', async () => {
    const validCategory = new Category({
      name: 'Eletrônicos',
      description: 'Tudo sobre tecnologia',
    });

    const savedCategory = await validCategory.save();

    expect(savedCategory._id).toBeDefined();
    expect(savedCategory.name).toBe('Eletrônicos');
    expect(savedCategory.description).toBe('Tudo sobre tecnologia');
  });

  it('deve lançar erro ao salvar sem nome', async () => {
    const category = new Category({ description: 'Sem nome' });

    let err;
    try {
      await category.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.name.message).toBe('Nome da categoria obrigatorio');
  });

  it('deve lançar erro se nome tiver menos de 2 caracteres', async () => {
    const category = new Category({ name: 'A' });

    let err;
    try {
      await category.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.name.message).toBe('Categoria deve possuir pelo menos 2 caracteres');
  });

  it('deve lançar erro ao tentar criar duas categorias com o mesmo nome', async () => {
    const category1 = new Category({ name: 'Roupas' });
    const category2 = new Category({ name: 'Roupas' });

    await category1.save();

    let err;
    try {
      await category2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000);
  });

});
