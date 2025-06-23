import Product from "../models/Product.js";
import Order from "../models/Order.js";

const addOrder = async (req, res) => {
  try {
    const { productId, quantity} = req.body;
    const userId = req.user._id;
    const product = await Product.findById({_id: productId});
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

    
      product.stock += parseInt(quantity);
      await product.save();

      const totalPrice = product.price * quantity;
    
    const order = new Order({
      user: userId,
      product: productId,
      quantity,
      totalPrice
    });
    await order.save();
   return res
      .status(201)
      .json({ success: true, message: "Pedido criado com sucesso",
      order
       });
      
  } catch (error) {
    
    res.status(500).json({ success: false, error: "Erro de servidor" });
  }
};

const getOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    let query = {};
    if (userRole === 'user') {
      query = { user: id };
    } 
    const orders = await Order.find(query)
      .populate({
        path: 'product',
        populate: {
          path: 'category',
          select: 'name'
        },
        select: 'name'
      }).populate({
        path: "user",
        select: "name address"
      })
      .sort({ orderDate: -1 });

    return res.status(200).json({success: true, orders});
  } catch (err) {
    return res.status(500).json({ success:false, error: 'Falha ao buscar pedidos' });
  }
};

export {addOrder, getOrders}