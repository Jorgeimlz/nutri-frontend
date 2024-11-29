const API_BASE_URL = 'https://recomendacionesnutri.onrender.com/api';

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register/`,
    LOGIN: `${API_BASE_URL}/auth/login/`,
    USER: `${API_BASE_URL}/auth/user/`,
    MACRONUTRIENTES: `${API_BASE_URL}/auth/mis-macronutrientes/`,
  },
  INGREDIENTES: {
    LIST: `${API_BASE_URL}/ingredientes/`,
  },
  RECETAS: {
    BASE: `${API_BASE_URL}/recetas/`,
    NUTRICIONALES: `${API_BASE_URL}/recetas/recomendaciones-nutricionales/`,
    RECOMENDACIONES: `${API_BASE_URL}/recetas/recomendaciones/`,
    DETAILS: (id: number) => `${API_BASE_URL}/recetas/${id}/`,
  },
};
