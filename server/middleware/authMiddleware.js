import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: "Não autorizado - Token ausente ou inválido" });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, error: "Não autorizado - Token inválido" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "Usuário não encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erro no authMiddleware:', error);
    return res.status(500).json({ success: false, message: "Erro na validação do token" });
  }
};

export default authMiddleware;
