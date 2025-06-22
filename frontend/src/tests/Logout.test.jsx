import React from 'react';
import { render } from '@testing-library/react';
import Logout from '../components/Logout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

jest.mock('../context/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('Logout Component', () => {
  it('deve chamar logout e redirecionar para /login', () => {
    const logoutMock = jest.fn();
    const navigateMock = jest.fn();

    useAuth.mockReturnValue({ logout: logoutMock });
    useNavigate.mockReturnValue(navigateMock);

    render(<Logout />);

    expect(logoutMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});
