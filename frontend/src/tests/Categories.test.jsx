import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Categories from '../components/Categories';
import axiosInstance from '../utils/api';

jest.mock('../utils/api');

beforeEach(() => {
  localStorage.setItem('ims_token', 'mock-token');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Categories Component', () => {
  it('deve exibir categorias após o carregamento', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        categories: [
          { _id: '1', name: 'Eletrônicos' },
          { _id: '2', name: 'Roupas' }
        ]
      }
    });

    render(<Categories />);

    expect(screen.getByText(/Gerenciar Categorias/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
      expect(screen.getByText('Roupas')).toBeInTheDocument();
    });
  });

  it('deve adicionar uma nova categoria', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { success: true, categories: [] } }); // primeiro fetch
    axiosInstance.post.mockResolvedValueOnce({ data: { success: true } }); // post
    axiosInstance.get.mockResolvedValueOnce({ // segundo fetch
      data: {
        success: true,
        categories: [{ _id: '3', name: 'Nova Categoria' }]
      }
    });

    render(<Categories />);

    fireEvent.change(screen.getByPlaceholderText(/Insira o nome da categoria/i), {
      target: { value: 'Nova Categoria' }
    });

    fireEvent.submit(screen.getByRole('button', { name: /adicionar categoria/i }));

    await waitFor(() => {
      expect(screen.getByText('Nova Categoria')).toBeInTheDocument();
    });
  });

  it('deve deletar uma categoria', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        categories: [{ _id: '1', name: 'Apagar Isso' }]
      }
    });

    axiosInstance.delete.mockResolvedValueOnce({ data: { success: true } });

    render(<Categories />);

    await waitFor(() => {
      expect(screen.getByText('Apagar Isso')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Deletar/i));

    await waitFor(() => {
      expect(screen.queryByText('Apagar Isso')).not.toBeInTheDocument();
    });
  });

  it('deve filtrar categorias ao digitar na busca', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        categories: [
          { _id: '1', name: 'Doces' },
          { _id: '2', name: 'Frutas' }
        ]
      }
    });

    render(<Categories />);

    await waitFor(() => {
      expect(screen.getByText('Doces')).toBeInTheDocument();
      expect(screen.getByText('Frutas')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Pesquisar por categorias/i), {
      target: { value: 'doces' }
    });

    expect(screen.queryByText('Frutas')).not.toBeInTheDocument();
    expect(screen.getByText('Doces')).toBeInTheDocument();
  });
});
