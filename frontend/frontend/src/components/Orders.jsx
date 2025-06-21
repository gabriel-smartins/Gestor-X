import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/order/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
          },
        });
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user.userId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {user.role === "admin" ? "Histórico de Reposição" : "Minhas Reposições"}
      </h1>

      {loading && <p className="text-gray-500 mb-4">Carregando dados...</p>}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">#</th>
              {user.role === "admin" && (
                <th className="p-2 text-left">Usuário</th>
              )}
              <th className="p-2 text-left">Produto</th>
              <th className="p-2 text-left">Categoria</th>
              <th className="p-2 text-left">Quantidade</th>
              <th className="p-2 text-left">Custo Total</th>
              <th className="p-2 text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{index + 1}</td>
                {user.role === "admin" && (
                  <td className="p-2">{order.user?.name || "N/A"}</td>
                )}
                <td className="p-2">{order.product.name}</td>
                <td className="p-2">{order.product.category.name}</td>
                <td className="p-2">{order.quantity}</td>
                <td className="p-2">R$ {order.totalPrice.toFixed(2)}</td>
                <td className="p-2">
                  {new Date(order.orderDate).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && !loading && (
          <p className="text-center p-4 text-gray-500">
            Nenhuma reposição encontrada.
          </p>
        )}
      </div>
    </div>
  );
};

export default Orders;
