import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";


const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, supplier } = req.body;


    const newProduct = new Product({
        name, description, price, stock, category, supplier
    });
    const product = await newProduct.save();

    res
      .status(201)
      .json({ success: true, message: "Produto criado com sucesso" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Erro de servidor" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false }).populate("category").populate("supplier");
    const categories = await Category.find();
    const suppliers = await Supplier.find();
    res.status(201).json({ success: true, products, categories, suppliers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Erro de servidor" + error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, supplier } = req.body;

    const product = await Product.findById({ _id: id });
    if (!product) {
      res.status(404).json({ success: false, error: "Produto não encotrado" });
    }

    const updateUser = await Product.findByIdAndUpdate(
      { _id: id },
      { name, description, price, stock, category, supplier }
    );

    res.status(201).json({ success: true, updateUser });
  } catch (error) {
    console.error("Erro ao editar:", error);
    res
      .status(500)
      .json({ success: false, error: "Erro de servidor" + error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById({ _id: id });
    if (!product) {
      return res.status(404).json({ success:false, error: 'Produto não encotrado' });
    }


    if (product.isDeleted) {
      return res.status(400).json({ success:false, error: 'Produto ja foi deletado' });
    }

    await Product.updateOne(
      { _id: id },
      { isDeleted: true}
    );

    return res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return res
      .status(500)
      .json({ success: false, error: "Erro de servidor " + error.message });
  }
};

export { addProduct, getProducts, updateProduct, deleteProduct };
