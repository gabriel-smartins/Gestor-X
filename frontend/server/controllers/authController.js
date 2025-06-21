import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Conta não localizada",
      });
    }

    const passwordValid = await bcrypt.compare(password, existingUser.password);
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "E-mail ou senha incorretos",
      });
    }

    const authToken = jwt.sign(
      {
        userId: existingUser._id,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Acesso autorizado",
      token: authToken,
      user: {
        userId: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Erro ao autenticar",
    });
  }
};

export const confirmUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Usuário autenticado com sucesso",
      user: req.user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Erro interno ao verificar usuário",
    });
  }
};
