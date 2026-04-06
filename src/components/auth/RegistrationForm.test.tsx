import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegistrationForm from './RegistrationForm';
import { useAuth } from '@/contexts/auth-context';

// Redefinimos el mock de useAuth para cada test
vi.mock('@/contexts/auth-context', () => ({
  useAuth: vi.fn(),
}));

describe('RegistrationForm', () => {
  const mockSignUp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      signUp: mockSignUp,
    });
  });

  it('debe renderizar los campos de email y contraseña', () => {
    render(<RegistrationForm />);
    expect(screen.getByTestId('email_input')).toBeInTheDocument();
    expect(screen.getByTestId('password_input')).toBeInTheDocument();
    expect(screen.getByTestId('submit_button')).toBeInTheDocument();
  });

  it('debe mostrar errores de validación para campos vacíos', async () => {
    render(<RegistrationForm />);
    const submitButton = screen.getByTestId('submit_button');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Ingresa un correo electrónico válido')).toBeInTheDocument();
      expect(
        screen.getByText('La contraseña debe tener al menos 6 caracteres')
      ).toBeInTheDocument();
    });
  });

  it('debe validar el formato del email', async () => {
    render(<RegistrationForm />);
    const emailInput = screen.getByTestId('email_input');
    const submitButton = screen.getByTestId('submit_button');

    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Ingresa un correo electrónico válido')).toBeInTheDocument();
    });
  });

  it('debe manejar errores devueltos por Supabase', async () => {
    mockSignUp.mockResolvedValue({ error: { message: 'El usuario ya existe' } });
    render(<RegistrationForm />);

    fireEvent.change(screen.getByTestId('email_input'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('password_input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('submit_button'));

    await waitFor(() => {
      expect(screen.getByTestId('form_error')).toHaveTextContent('El usuario ya existe');
    });
  });

  it('debe mostrar mensaje de éxito y llamar a signUp con datos correctos', async () => {
    mockSignUp.mockResolvedValue({ error: null });
    render(<RegistrationForm />);

    fireEvent.change(screen.getByTestId('email_input'), { target: { value: 'nuevo@test.com' } });
    fireEvent.change(screen.getByTestId('password_input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('submit_button'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('nuevo@test.com', 'password123');
    });
  });
});
