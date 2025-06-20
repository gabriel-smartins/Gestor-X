import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nome de fornecedor obrigatorio"],
    trim: true,
    minlength: [2, "Nome de fornecedor deve ter pelo menos 2 caracteres"],
  },
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;
