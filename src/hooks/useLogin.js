import { useState } from "react";
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia";

export const useLogin = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async ({ rut, password }) => {
    if (!rut || !password) {
      setError("RUT y contraseña son necesarios.");
      return; // Evitar la ejecución si los campos necesarios están vacíos
    }

    setLoading(true);
    setError(null); // Limpiar errores anteriores antes de una nueva solicitud
    try {
      const response = await apiTransferenciaCompentencia.post('login/', {
        rut,
        password
      });
      setData(response.data);
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('refreshToken', response.data['refresh-token']);
    } catch (error) {
      const errMsg = error.response ? error.response.data.error || "Error al conectar con el servidor" : "Error en la conexión con el servidor. Intenta de nuevo más tarde.";
      console.error('Error en login:', errMsg);
      setError(errMsg); 
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, login };
}
