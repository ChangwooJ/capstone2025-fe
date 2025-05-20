import styled, { css } from 'styled-components';

export const theme = {
  colors: {
    primary: '#72dac8',
    primaryDark: '#5bc4b0',
    secondary: '#2c3e50',
    text: {
      primary: '#2c3e50',
      secondary: '#495057',
      light: '#6c757d',
      white: '#ffffff'
    },
    background: {
      main: '#ffffff',
      light: '#f8f9fa',
      dark: '#e9ecef'
    },
    border: '#e9ecef',
    error: '#dc3545',
    success: '#28a745'
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.05)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.08)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem'
  },
  typography: {
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
    fontSize: {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  transitions: {
    default: 'all 0.2s ease'
  }
} as const;

export const AuthContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 2rem auto;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.main};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
  margin-top: 5%;
`;

export const AuthTitle = styled.h1`
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${theme.colors.background.light};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.medium};
  transition: ${theme.transitions.default};

  &:focus-within {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }
`;

export const InputIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm};
  color: ${theme.colors.text.light};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  background: transparent;
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.primary};

  &::placeholder {
    color: ${theme.colors.text.light};
  }

  &:focus {
    outline: none;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};

  ${({ variant = 'primary' }) => css`
    background-color: ${variant === 'primary' ? theme.colors.primary : theme.colors.background.main};
    color: ${variant === 'primary' ? theme.colors.text.white : theme.colors.primary};
    border: ${variant === 'secondary' ? `2px solid ${theme.colors.primary}` : 'none'};

    &:hover {
      background-color: ${variant === 'primary' ? theme.colors.primaryDark : theme.colors.background.light};
      transform: translateY(-1px);
    }
  `}
`;

export const SwitchText = styled.p`
  text-align: center;
  margin-top: ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
`;

export const SwitchButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  padding: 0;
  margin-left: ${theme.spacing.xs};

  &:hover {
    text-decoration: underline;
  }
`;

export const ErrorMessage = styled.p`
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.sm};
  margin-top: ${theme.spacing.xs};
  text-align: center;
`; 