import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de librerías de CSS problemáticas
vi.mock('@csstools/css-calc', () => ({}));
vi.mock('@asamuzakjp/css-color', () => ({}));

// Mock del router de Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock del contexto de autenticación
vi.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    user: null,
    loading: false,
  }),
}));
