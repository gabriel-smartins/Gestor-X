import Supplier from "../models/Supplier.js";
import Product from "../models/Product.js";


const addSupplier = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

 
    let existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res
        .status(400)
        .json({ success: false, error: "Fornecedor já existe" });
    }


    const newSupplier = new Supplier({
      name,
      email,
      phone,
      address,
    });
    const supplier = await newSupplier.save();

    res
      .status(201)
      .json({ success: true, message: "Fornecedor criado com sucesso!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(201).json({ success: true, suppliers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Server error " + error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const supplier = await Supplier.findById({ _id: id });
    if (!supplier) {
      res.status(404).json({ success: false, error: "Fornecedor não encotrado" });
    }

    const updateUser = await Supplier.findByIdAndUpdate(
      { _id: id },
      { name, email, phone, address }
    );

    res.status(201).json({ success: true, updateUser });
  } catch (error) {
    console.error("Erro ao editar funcionario:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error " + error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const productCount = await Product.countDocuments({ supplier: id });
    if (productCount > 0) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Não é possível deletar fornecedor associado a um produto",
        });
    }

    const supplier = await Supplier.findByIdAndDelete({ _id: id });
    if (!supplier) {
      res
        .status(404)
        .json({ success: false, error: "document not found " + error.message });
    }
    res.status(201).json({ success: true, supplier });
  } catch (error) {
    console.error("Erro editar funcionario:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error " + error.message });
  }
};

export { addSupplier, getSuppliers, updateSupplier, deleteSupplier };
