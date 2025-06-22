import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Products from '../components/Products';
import axiosInstance from '../utils/api';

jest.mock('../utils/api');

beforeEach(() => {
  localStorage.setItem('ims_token', 'fake-token');

  axiosInstance.get.mockResolvedValueOnce({
    data: {
      success: true,
      categories: [{ _id: 'cat1', name: 'Acessórios' }],
      suppliers: [{ _id: 'sup1', name: 'Dell' }, { _id: 'sup2', name: 'HP' }],
      products: [],
    },
  });

  axiosInstance.post.mockResolvedValue({
    data: { success: true, message: 'Produto criado com sucesso!' },
  });
});

test('Products Component › deve enviar um novo produto ao submeter o formulário', async () => {
  render(<Products />);

  await screen.findByText('+ Novo Produto');

  fireEvent.click(screen.getByText('+ Novo Produto'));

  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Notebook' } });
  fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Notebook Gamer' } });
  fireEvent.change(screen.getByLabelText('Preço'), { target: { value: '2500' } });
  fireEvent.change(screen.getByLabelText('Estoque'), { target: { value: '20' } });
  fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'cat1' } });
  fireEvent.change(screen.getByLabelText('Fornecedor'), { target: { value: 'sup1' } });

  fireEvent.click(screen.getByRole('button', { name: /^Adicionar Produto$/i }));

  await waitFor(() => {
    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/products/add',
      {
        name: 'Notebook',
        description: 'Notebook Gamer',
        price: 2500,
        stock: 20,
        category: 'cat1',
        supplier: 'sup1',
      },
      expect.any(Object)
    );
  });
});
