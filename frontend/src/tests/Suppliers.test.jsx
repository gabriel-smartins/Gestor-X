import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Suppliers from '../components/Suppliers';
import { AuthProvider } from '../context/AuthContext';

jest.mock('../utils/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ data: { suppliers: [] } }),
    post: jest.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

const renderWithContext = () =>
  render(
    <AuthProvider>
      <Suppliers />
    </AuthProvider>
  );

describe('Suppliers Component', () => {
  it('deve preencher e submeter o formulário corretamente', async () => {
    renderWithContext();

    fireEvent.click(await screen.findByText('+ Novo Fornecedor'));

    fireEvent.change(screen.getByPlaceholderText('Nome do fornecedor'), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByPlaceholderText('Email do fornecedor'), { target: { value: 'teste@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contato fornecedor'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByPlaceholderText('Endereço do fornecedor'), { target: { value: 'Rua Teste' } });

    fireEvent.click(screen.getByText('Adicionar fornecedor'));

    await waitFor(() => {
      expect(require('../utils/api').default.post).toHaveBeenCalled();
    });
  });
});
