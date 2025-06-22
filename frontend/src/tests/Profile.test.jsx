import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../components/Profile';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/api';

jest.mock('../context/AuthContext');
jest.mock('../utils/api');

describe('Profile Component', () => {
  const mockUser = {
    userId: '123',
  };

  const mockUserData = {
    success: true,
    user: {
      name: 'Gabriel',
      email: 'gabriel@email.com',
      address: 'Rua XPTO',
      password: 'hashedPassword',
    },
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    axiosInstance.get.mockResolvedValueOnce({ data: mockUserData });
  });

  it('deve renderizar os dados do usuário', async () => {
    render(<Profile />);

    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Gabriel')).toBeInTheDocument();
      expect(screen.getByDisplayValue('gabriel@email.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Rua XPTO')).toBeInTheDocument();
    });
  });

  it('deve habilitar os campos ao clicar em "Editar perfil"', async () => {
    render(<Profile />);

    await waitFor(() => screen.getByText('Editar perfil'));

    fireEvent.click(screen.getByText('Editar perfil'));

    expect(screen.getByRole('textbox', { name: /Nome/i })).not.toBeDisabled();
    expect(screen.getByRole('textbox', { name: /Email/i })).not.toBeDisabled();
  });

  it('deve enviar os dados ao clicar em "Salvar"', async () => {
    axiosInstance.put.mockResolvedValueOnce({
      data: {
        success: true,
        user: mockUserData.user,
      },
    });

    render(<Profile />);

    await waitFor(() => screen.getByText('Editar perfil'));
    fireEvent.click(screen.getByText('Editar perfil'));

    const nameInput = screen.getByLabelText('Nome');
    fireEvent.change(nameInput, { target: { value: 'Gabriel Teste' } });

    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith(
        '/users/123',
        expect.objectContaining({ name: 'Gabriel Teste' }),
        expect.any(Object) 
      );
    });
  });

  it('deve cancelar a edição ao clicar em "Cancelar"', async () => {
    render(<Profile />);

    await waitFor(() => screen.getByText('Editar perfil'));
    fireEvent.click(screen.getByText('Editar perfil'));

    const nameInput = screen.getByLabelText('Nome');
    fireEvent.change(nameInput, { target: { value: 'Outro Nome' } });

    fireEvent.click(screen.getByText('Cancelar'));

    expect(nameInput).toBeDisabled(); 
  });
});
