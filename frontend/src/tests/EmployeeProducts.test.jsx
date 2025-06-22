import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeeProducts from '../components/EmployeeProducts';
import axiosInstance from '../utils/api';

jest.mock('../utils/api');

beforeEach(() => {
  localStorage.setItem('ims_token', 'fake-token');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('EmployeeProducts Component', () => {
  it('deve exibir título e filtros', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        categories: [{ _id: '1', name: 'Bebidas' }],
        products: [
          { _id: 'p1', name: 'Coca-Cola', category: { _id: '1', name: 'Bebidas' }, price: 5, stock: 10 }
        ]
      }
    });

    render(<EmployeeProducts />);

    expect(screen.getByText(/Produtos/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Coca-Cola/i)).toBeInTheDocument();
    });
  });

  it('deve abrir o modal ao clicar em "Fazer Pedido"', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        categories: [{ _id: '1', name: 'Bebidas' }],
        products: [
          { _id: 'p1', name: 'Coca-Cola', category: { _id: '1', name: 'Bebidas' }, price: 5, stock: 10 }
        ]
      }
    });

    render(<EmployeeProducts />);

    await waitFor(() => {
      expect(screen.getByText(/Coca-Cola/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Fazer Pedido/i }));

    expect(screen.getByText(/Confirmar/i)).toBeInTheDocument();
  });

  it('deve cancelar o pedido ao clicar em "Cancelar"', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        categories: [{ _id: '1', name: 'Bebidas' }],
        products: [
          { _id: 'p1', name: 'Coca-Cola', category: { _id: '1', name: 'Bebidas' }, price: 5, stock: 10 }
        ]
      }
    });

    render(<EmployeeProducts />);

    await waitFor(() => {
      expect(screen.getByText(/Coca-Cola/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Fazer Pedido/i }));

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Confirmar/i)).not.toBeInTheDocument();
    });
  });

  it('deve enviar o pedido ao clicar em "Confirmar"', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        categories: [{ _id: '1', name: 'Bebidas' }],
        products: [
          { _id: 'p1', name: 'Coca-Cola', category: { _id: '1', name: 'Bebidas' }, price: 5, stock: 10 }
        ]
      }
    });

    axiosInstance.post.mockResolvedValueOnce({
      data: { success: true }
    });

    render(<EmployeeProducts />);

    await waitFor(() => {
      expect(screen.getByText(/Coca-Cola/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Fazer Pedido/i }));

    fireEvent.change(screen.getByLabelText(/Quantidade/i), { target: { value: '2' } });

    fireEvent.click(screen.getByRole('button', { name: /Confirmar/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Confirmar/i)).not.toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/order/add',
      expect.objectContaining({ productId: 'p1', quantity: 2 }),
      expect.any(Object)
    );
  });

  it('deve filtrar produtos ao digitar na busca', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        categories: [{ _id: '1', name: 'Bebidas' }],
        products: [
          { _id: 'p1', name: 'Coca-Cola', category: { _id: '1', name: 'Bebidas' }, price: 5, stock: 10 },
          { _id: 'p2', name: 'Pepsi', category: { _id: '1', name: 'Bebidas' }, price: 4, stock: 15 }
        ]
      }
    });

    render(<EmployeeProducts />);

    await waitFor(() => {
      expect(screen.getByText(/Coca-Cola/i)).toBeInTheDocument();
      expect(screen.getByText(/Pepsi/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Pesquisar produtos/i), {
      target: { value: 'Pepsi' }
    });

    expect(screen.queryByText(/Coca-Cola/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Pepsi/i)).toBeInTheDocument();
  });
});
