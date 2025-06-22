import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Users from '../components/Users';
import axiosInstance from '../utils/api';

jest.mock('../utils/api');

describe('Users Component', () => {
  beforeEach(() => {
    localStorage.setItem('ims_token', 'fake-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve listar usuários corretamente', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        users: [
          { _id: '1', name: 'João', email: 'joao@example.com', role: 'admin' },
        ],
      },
    });

    render(<Users />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('João')).toBeInTheDocument();
      expect(screen.getByText('joao@example.com')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
  });

  it('deve deletar usuário', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        users: [{ _id: '1', name: 'João', email: 'joao@example.com', role: 'admin' }],
      },
    });

    axiosInstance.delete.mockResolvedValueOnce({
      data: { success: true },
    });

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText('João')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Deletar');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/users/1', expect.any(Object));
    });
  });

  it('deve adicionar novo usuário', async () => {
    axiosInstance.get.mockResolvedValue({
      data: {
        success: true,
        users: [],
      },
    });

    axiosInstance.post.mockResolvedValueOnce({
      data: {
        success: true,
        user: {
          _id: '2',
          name: 'Maria',
          email: 'maria@example.com',
          role: 'user',
        },
      },
    });

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText('Gerenciar Usuários')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Insira o nome'), {
      target: { value: 'Maria' },
    });
    fireEvent.change(screen.getByPlaceholderText('Insira o Email'), {
      target: { value: 'maria@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('*******'), {
      target: { value: 'senha123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Insira o endereço'), {
      target: { value: 'Rua 1' },
    });
    fireEvent.change(screen.getByDisplayValue('Selecione o acesso'), {
      target: { value: 'user' },
    });

    fireEvent.click(screen.getByText('Adiconar usuário'));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/users/add',
        {
          name: 'Maria',
          email: 'maria@example.com',
          password: 'senha123',
          address: 'Rua 1',
          role: 'user',
        },
        expect.any(Object)
      );
    });
  });

  it('deve filtrar usuários com base na pesquisa', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        users: [
          { _id: '1', name: 'Carlos', email: 'carlos@example.com', role: 'admin' },
          { _id: '2', name: 'Ana', email: 'ana@example.com', role: 'user' },
        ],
      },
    });

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText('Carlos')).toBeInTheDocument();
      expect(screen.getByText('Ana')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Pesquisar usuários...'), {
      target: { value: 'ana' },
    });

    await waitFor(() => {
      expect(screen.queryByText('Carlos')).not.toBeInTheDocument();
      expect(screen.getByText('Ana')).toBeInTheDocument();
    });
  });
});
