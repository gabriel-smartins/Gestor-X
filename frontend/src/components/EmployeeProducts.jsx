import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/api";

const EmployeeProducts = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    productId: "",
    quantity: 1,
    total: 0,
    stock: 0,
    price: 0,
  });
  const [loading, setLoading] = useState(false);

  const userId = "dummy-user-id";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setCategories(response.data.categories);
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      }
    } catch (error) {
      alert("Erro ao buscar produtos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterProducts = (e) => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleChangeCategory = (e) => {
    const categoriaId = e.target.value;
    setSelectedCategory(categoriaId);
    if (categoriaId) {
      setFilteredProducts(
        products.filter((product) => product.category._id === categoriaId)
      );
    } else {
      setFilteredProducts(products);
    }
  };

  const handleOrderClick = (product) => {
    setOrderData({
      productId: product._id,
      quantity: 1,
      total: product.price,
      price: product.price,
      stock: product.stock,
    });
    setIsModalOpen(true);
  };

const IncreaseQuantity = (e) => {
  const novaQtd = parseInt(e.target.value);
  setOrderData((prev) => ({
    ...prev,
    quantity: novaQtd,
    total: novaQtd * parseInt(orderData.price),
  }));
};

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/order/add", orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setIsModalOpen(false);
        setOrderData({ productId: "", quantity: 1, total: 0 });
        fetchProducts();
        alert("Pedido realizado com sucesso");
      }
    } catch (err) {
      alert("Erro ao realizar pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>

      {loading && <p className="text-gray-500 mb-4">Carregando...</p>}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <select
          value={selectedCategory}
          onChange={handleChangeCategory}
          className="w-full sm:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Todas as Categorias</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          onChange={handleFilterProducts}
          placeholder="Pesquisar produtos..."
          className="w-full sm:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Categoria</th>
              <th className="p-2 text-left">Preço</th>
              <th className="p-2 text-left">Estoque</th>
              <th className="p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filterProducts.map((product, index) => (
              <tr key={product._id} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.category.name}</td>
                <td className="p-2">R$ {product.price}</td>
                <td className="p-2">{product.stock}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleOrderClick(product)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:bg-green-300"
                    disabled={loading || product.stock === 0}
                  >
                    Fazer Pedido
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filterProducts.length === 0 && !loading && (
          <p className="text-center p-4 text-gray-500">Nenhum produto encontrado.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Fazer Pedido</h2>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  min="1"
                  value={orderData.quantity}
                  onChange={IncreaseQuantity}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <strong>Total: R$ {orderData.total}</strong>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
                  disabled={loading}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProducts;
