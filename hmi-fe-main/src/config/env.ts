// Environment configuration
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    timeout: 10000,
  },
  app: {
    name: 'HMI Frontend',
    version: '1.0.0',
  },
} as const;

// Environment helper
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production'; 