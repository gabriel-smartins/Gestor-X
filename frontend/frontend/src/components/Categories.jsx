import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setCategories(response.data.categories);
        setFilteredCategories(response.data.categories);
      }
    } catch (error) {
      alert("Erro ao buscar categorias: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formCategory.trim()) return;

    const token = localStorage.getItem("ims_token");
    const payload = { formCategory, formDescription };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (editingId) {
        const response = await axiosInstance.put(`/category/${editingId}`, payload, config);
        if (response.data.success) {
          fetchCategories();
        }
        setEditingId(null);
      } else {
        const response = await axiosInstance.post("/category/add", payload, config);
        if (response.data.success) {
          fetchCategories();
        }
      }
    } catch (error) {
      alert("Erro ao salvar categoria: " + error.message);
    }

    setFormCategory('');
    setFormDescription('');
  };

  const handleSearchInput = (e) => {
    const termo = e.target.value.toLowerCase();
    setFilteredCategories(
      categories.filter((cat) =>
        cat.name.toLowerCase().includes(termo)
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/category/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setCategories((prev) => prev.filter((category) => category._id !== id));
        setFilteredCategories((prev) => prev.filter((category) => category._id !== id));
      }
    } catch (error) {
      const msg = error.response?.data?.error || error.message;
      alert("Erro ao deletar categoria: " + msg);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormCategory(category.name);
    setFormDescription(category.description);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormCategory('');
    setFormDescription('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Categorias</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="Insira o nome da categoria"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descrição da categoria (opcional)"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className={`flex-1 ${editingId ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-md`}
                >
                  {editingId ? 'Salvar' : 'Adicionar Categoria'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="mb-4">
            <input
              type="text"
              onChange={handleSearchInput}
              placeholder="Pesquisar por categorias..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Nome</th>
                  <th className="p-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{category.name}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        disabled={editingId === category._id}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCategories.length === 0 && (
              <p className="text-center p-4 text-gray-500">Nenhuma categoria encontrada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
