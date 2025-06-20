import Category from "../models/Category.js";
import Product from "../models/Product.js";


const addCategory = async (req, res) => {
  try {
    const { formCategory, formDescription } = req.body;

    let existingCategory = await Category.findOne({ name: formCategory });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, error: "Categoria já existe" });
    }

  
    const newCategory = new Category({
      name: formCategory,
      description: formDescription,
    });
    const category = await newCategory.save();

    res
      .status(201)
      .json({ success: true, message: "Categoria criada com sucesso!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getCategorys = async (req, res) => {
  console.log("get category");
  try {
    const categories = await Category.find();
    return res.status(201).json({ success: true, categories });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Server error " + error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { formCategory, formDescription } = req.body;

    const category = await Category.findById({ _id: id });
    if (!category) {
      res.status(404).json({ success: false, error: "Categoria não encotrada" });
    }

    const updateCategory = await Category.findByIdAndUpdate(
      { _id: id },
      { name: formCategory, description: formDescription }
    );

    res.status(201).json({ success: true, updateCategory });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Server error " + error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        error: "Não é possível excluir categoria associada a um produto",
      });
    }

    const category = await Category.findByIdAndDelete({ _id: id });
    if (!category) {
      res
        .status(404)
        .json({ success: false, error: "document not found " + error.message });
    }
    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error("Erro para editar categoria:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error " + error.message });
  }
};

export { addCategory, getCategorys, updateCategory, deleteCategory };
