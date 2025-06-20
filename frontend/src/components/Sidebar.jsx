import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart, FaTruck, FaChartBar, FaUsers, FaCog, FaSignOutAlt, FaTable } from 'react-icons/fa';

const Sidebar = () => {
  const menuItems = [
    { name: 'Início', path: '/', icon: <FaHome />, isParent: true },
    { name: 'Produtos', path: '/admin-dashboard/products', icon: <FaBox />, isParent: false },
    { name: 'Categorias', path: '/admin-dashboard/categories', icon: <FaTable />, isParent: false },
    { name: 'Pedidos', path: '/admin-dashboard/orders', icon: <FaShoppingCart />, isParent: false },
    { name: 'Fornecedores', path: '/admin-dashboard/supplier', icon: <FaTruck />, isParent: false },
    { name: 'Usuários', path: '/admin-dashboard/users', icon: <FaUsers />, isParent: false },
    { name: 'Perfil', path: '/admin-dashboard/profile', icon: <FaCog />, isParent: true },
    { name: 'Sair', path: '/logout', icon: <FaSignOutAlt />, isParent: true },
  ];

  const userMenuItems = [
    { name: 'Produtos', path: '/employee-dashboard', icon: <FaBox />, isParent: true },
    { name: 'Pedidos', path: '/employee-dashboard/orders', icon: <FaShoppingCart />, isParent: false },
    { name: 'Perfil', path: '/employee-dashboard/profile', icon: <FaCog />, isParent: false },
    { name: 'Sair', path: '/logout', icon: <FaSignOutAlt />, isParent: true },
  ];

  const [itemsToRender, setItemsToRender] = useState(userMenuItems);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('ims_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user?.role === 'admin') {
          setItemsToRender(menuItems);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar o usuário do localStorage:', error);
    }
  }, []);

  return (
    <div className="fixed h-screen bg-gray-800 text-white w-16 md:w-64 flex flex-col">
      <div className="h-16 flex items-center justify-center md:justify-start md:pl-6">
        <span className="hidden md:block text-xl font-bold">Gestor-X</span>
        <span className="block md:hidden text-xl font-bold">IMS</span>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 p-2">
          {itemsToRender.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end={item.isParent}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-gray-600' : 'hover:bg-gray-700'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="ml-4 hidden md:block">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
