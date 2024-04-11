import axios from 'axios';

// Define la baseURL utilizando la variable de entorno
const baseURL = import.meta.env.VITE_REACT_APP_API_URL;

// Crea la instancia de axios con la baseURL
export const apiTransferenciaCompentencia = axios.create({
  baseURL: baseURL,
});

// Interceptor para añadir el token a las cabeceras de las solicitudes
apiTransferenciaCompentencia.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar la expiración del token
apiTransferenciaCompentencia.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        // Utiliza la baseURL definida al principio para formar la URL completa
        const response = await axios.post(`${baseURL}/api/token/refresh/`, { refresh: refreshToken });
        const newAccessToken = response.data.access;
        localStorage.setItem('userToken', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiTransferenciaCompentencia(originalRequest);
      } catch (refreshError) {
        console.error('Error al intentar refrescar el token:', refreshError);
        // Limpia el localStorage aquí
        localStorage.removeItem('userToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        // Puedes considerar redireccionar al usuario para iniciar sesión nuevamente
      }
    }

    return Promise.reject(error);
  }
);
