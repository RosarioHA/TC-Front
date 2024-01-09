import { useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia";

export const useAmbitos = () => {
    const [ambitos, setAmbitos] = useState([]);

  useEffect(() => {
    const fetchAmbitos = async () => {
      try {
        const responseAmbitos = await apiTransferenciaCompentencia.get('ambitos/');
        setAmbitos(responseAmbitos.data)
      } catch (error) {
        console.error('Error al obtener datos de Ambitos:', error);
      }
    };

    fetchAmbitos();
  }, []);

  return ambitos;
};