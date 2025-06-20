import Product from "../models/Product.js";
import Order from "../models/Order.js";

const getSummary = async (req, res) => {
    try {
  
      const totalProducts = await Product.countDocuments();

   
      const stockResult = await Product.aggregate([
        { $group: { _id: null, totalStock: { $sum: '$stock' } } }
      ]);
      const totalStock = stockResult[0]?.totalStock || 0;

 
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const ordersToday = await Order.countDocuments({
        orderDate: { $gte: startOfDay, $lte: endOfDay }
      });


 
      const outOfStock = await Product.find({ stock: 0 })
        .select('name category stock')
        .populate('category', 'name');

      const highestSaleResult = await Order.aggregate([
        { $group: { _id: '$product', totalQuantity: { $sum: '$quantity' } } },
        { $sort: { totalQuantity: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $lookup: {
            from: 'categories',
            localField: 'product.category',
            foreignField: '_id',
            as: 'product.category'
          }
        },
        { $unwind: '$product.category' },
        {
          $project: {
            name: '$product.name',
            category: '$product.category.name',
            totalQuantity: 1
          }
        }
      ]);
      const highestSaleProduct = highestSaleResult[0] || { message: 'Sem dados de pedidos' };


      const lowStock = await Product.find({ stock: { $gt: 0, $lt: 5 } })
        .select('name category stock')
        .populate('category', 'name');

      const dashboardData = {
        totalProducts,
        totalStock,
        ordersToday,
        outOfStock,
        highestSaleProduct,
        lowStock
      };
      return res.status(200).json(dashboardData);
    } catch (error) {
      res.status(500).json({success:false, message: 'Erro ao buscar dados do dashboard ', error });
    }
  }

export { getSummary }