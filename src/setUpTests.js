import '@testing-library/jest-dom';
import 'text-encoding-utf-8';
import { TextDecoder, TextEncoder } from 'util';


if (!global.TextDecoder) {
global.TextDecoder = TextDecoder;
}

if (!global.TextEncoder) {
global.TextEncoder = TextEncoder;
}

global.fetch = jest.fn();

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  GithubAuthProvider: jest.fn(() => {}),
  TwitterAuthProvider: jest.fn(() => {}),
  GoogleAuthProvider: jest.fn(() => {}),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('./contexts/AuthContext', () => ({
  AuthContext: {
    Consumer: jest.fn(),
    Provider: jest.fn(),
  },
  useAuth: () => ({
    currentUser: null,
    login: jest.fn(),
    logout: jest.fn(),
    signup: jest.fn(),
    resetPassword: jest.fn(),
  }),
}));

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};