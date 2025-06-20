import User from '../models/User.js';
import bcrypt from 'bcrypt';

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, address } = req.body;
    const found = await User.findOne({ email });
    if (found) {
      return res.status(400).json({ success: false, error: "E-mail já registrado" });
    }

    const encrypted = await bcrypt.hash(password, 10);
    const entry = new User({
      name, email, password: encrypted, address, role
    });
    await entry.save();

    return res.status(201).json({ success: true, message: "Cadastro efetuado" });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Erro interno" });
  }
};

const listUsers = async (req, res) => {
  try {
    const data = await User.find();
    res.status(201).json({ success: true, users: data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Erro interno " + err.message });
  }
};

const fetchUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user._id.toString() !== id) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const data = await User.findById(req.user._id).select('-password');
    if (!data) return res.status(404).json({ error: "Conta não localizada" });

    return res.status(201).json({ success: true, user: data });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Erro interno " + err.message });
  }
};

const modifyUser = async (req, res) => {
  try {
    const uid = req.params.id;
    const input = req.body;

    if (input.password) {
      input.password = await bcrypt.hash(input.password, 10);
    }

    const result = await User.findByIdAndUpdate(
      uid,
      {
        name: input.name,
        email: input.email,
        password: input.password,
        address: input.address
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!result) {
      return res.status(404).json({ success: false, message: "Usuário inexistente" });
    }

    res.json({ success: true, user: result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro interno" });
  }
};

const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await User.findByIdAndDelete({ _id: id });

    if (!removed) {
      return res.status(404).json({ success: false, error: "Registro não localizado" });
    }

    res.status(201).json({ success: true, user: removed });
  } catch (err) {
    res.status(500).json({ success: false, error: "Erro interno " + err.message });
  }
};

export { createUser, listUsers, removeUser, fetchUser, modifyUser };
