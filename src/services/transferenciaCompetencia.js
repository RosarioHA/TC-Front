import axios from 'axios' ; 


export const apiTransferenciaCompentencia = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
}); 

// Agregar un interceptor para añadir el token a las cabeceras de las solicitudes
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
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        const response = await axios.post('api/token/refresh/', { refresh: refreshToken });
        const newAccessToken = response.data.access;
        localStorage.setItem('userToken', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiTransferenciaCompentencia(originalRequest);
      } catch (e) {
        console.error('Error al intentar refrescar el token:', e);
        // Limpia el localStorage aquí
        localStorage.removeItem('userToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        // Manejo adicional, como redireccionar al usuario, debería hacerse fuera del interceptor
      }
    }

    return Promise.reject(error);
  }
);