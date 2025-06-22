import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Summary from '../components/Summary';
import { BrowserRouter } from 'react-router-dom';
import axiosInstance from '../utils/api';

jest.mock('../utils/api');

const mockDashboardData = {
  totalProducts: 10,
  totalStock: 250,
  ordersToday: 5,
  revenue: 1500,
  outOfStock: [
    { name: 'Coca-Cola', category: { name: 'Bebidas' } },
  ],
  lowStock: [
    { name: 'Água', stock: 3, category: { name: 'Bebidas' } },
  ],
  highestSaleProduct: null
};

describe('Summary Component', () => {
  beforeEach(() => {
    localStorage.setItem('ims_token', 'fake-token');
    axiosInstance.get.mockResolvedValueOnce({ data: mockDashboardData });
  });

  it('deve exibir os dados do dashboard', async () => {
    render(
      <BrowserRouter>
        <Summary />
      </BrowserRouter>
    );

    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Total de Produtos')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();

      expect(screen.getByText('Total em Estoque')).toBeInTheDocument();
      expect(screen.getByText('250')).toBeInTheDocument();

      expect(screen.getByText('Pedidos Hoje')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();

      expect(screen.getByText('Coca-Cola')).toBeInTheDocument();
      expect(screen.getByText('Água')).toBeInTheDocument();
      expect(screen.getByText(/unidades/i)).toBeInTheDocument();
    });
  });
});

