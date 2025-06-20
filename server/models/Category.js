import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome da categoria obrigatorio'],
    unique: true,
    trim: true,
    minlength: [2, 'Categoria deve possuir pelo menos 2 caracteres'],
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model('Category', categorySchema);
export default Category;