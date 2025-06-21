import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import { useNavigate } from "react-router-dom";

const Summary = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalStock: 0,
    ordersToday: 0,
    revenue: 0,
    outOfStock: [],
    highestSaleProduct: null,
    lowStock: [],
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
          },
        });
        setDashboardData(response.data);
      } catch (err) {
        if (!err?.response?.data?.success) {
          navigate("/login");
        }
        alert("Erro ao carregar dados: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Página Inicial</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">Total de Produtos</h2>
          <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">Total em Estoque</h2>
          <p className="text-2xl font-bold">{dashboardData.totalStock}</p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">Pedidos Hoje</h2>
          <p className="text-2xl font-bold">{dashboardData.ordersToday}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Produtos Fora de Estoque
          </h3>
          {dashboardData.outOfStock.length > 0 ? (
            <ul className="space-y-2">
              {dashboardData.outOfStock.map((product, index) => (
                <li key={index} className="text-gray-600">
                  {product.name}{" "}
                  <span className="text-gray-400">({product.category.name})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum produto fora de estoque.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Produtos com Baixo Estoque
          </h3>
          {dashboardData.lowStock.length > 0 ? (
            <ul className="space-y-2">
              {dashboardData.lowStock.map((product, index) => (
                <li key={index} className="text-gray-600">
                  <strong>{product.name}</strong> - {product.stock} unidades{" "}
                  <span className="text-gray-400">({product.category.name})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum produto com baixo estoque.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
