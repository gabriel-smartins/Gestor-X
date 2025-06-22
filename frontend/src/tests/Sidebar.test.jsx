import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { BrowserRouter } from 'react-router-dom';

describe('Sidebar Component', () => {
  beforeEach(() => {
    localStorage.setItem('ims_user', JSON.stringify({ role: 'admin' }));
  });

  it('deve renderizar links extras para admin', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('Usuários')).toBeInTheDocument();
    expect(screen.getByText('Categorias')).toBeInTheDocument();
    expect(screen.getByText('Fornecedores')).toBeInTheDocument();
  });

  it('deve renderizar apenas links básicos para employee', () => {
    localStorage.setItem('ims_user', JSON.stringify({ role: 'employee' }));

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.queryByText('Usuários')).not.toBeInTheDocument();
    expect(screen.queryByText('Categorias')).not.toBeInTheDocument();
    expect(screen.getByText('Produtos')).toBeInTheDocument();
  });
});
