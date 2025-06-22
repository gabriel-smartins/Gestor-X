import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Orders from '../components/Orders';
import axiosInstance from '../utils/api';
import { useAuth } from '../context/AuthContext';

jest.mock('../utils/api');
jest.mock('../context/AuthContext');

describe('Orders Component', () => {
  const mockOrders = [
    {
      _id: '1',
      user: { name: 'João' },
      product: { name: 'Teclado', category: { name: 'Periféricos' } },
      quantity: 2,
      totalPrice: 200,
      orderDate: '2024-05-31T21:00:00.000Z' // aparece como "31 de mai. de 2024"
    }
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { userId: '123', role: 'admin' }
    });

    localStorage.setItem('ims_token', 'fake-token');
  });

  it('deve exibir os dados do pedido', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { success: true, orders: mockOrders }
    });

    render(<Orders />);

    expect(screen.getByText(/Histórico de Reposição/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('João')).toBeInTheDocument();
      expect(screen.getByText('Teclado')).toBeInTheDocument();
      expect(screen.getByText('Periféricos')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText(/R\$\s*200\.00/)).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes('de mai. de 2024'))
      ).toBeInTheDocument(); // flexível para data
    });
  });

  it('deve exibir mensagem quando não houver pedidos', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { success: true, orders: [] }
    });

    render(<Orders />);

    await waitFor(() => {
      expect(screen.getByText(/Nenhuma reposição encontrada/i)).toBeInTheDocument();
    });
  });
});
