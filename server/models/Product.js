import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
    minlength: [2, 'O nome do produto deve ter pelo menos 2 caracteres'],
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'O preço é obrigatório'],
    min: [0, 'O preço não pode ser negativo'],
  },
  stock: {
    type: Number,
    required: [true, 'A quantidade em estoque é obrigatória'],
    min: [0, 'O estoque não pode ser negativo'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'A categoria é obrigatória'],
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'O fornecedor é obrigatório'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
