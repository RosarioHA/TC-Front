import { useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia";

export const useAmbitos = () => {
    const [ambitos, setAmbitos] = useState([]);
    const [loadingAmbitos,setLoadingAmbitos]= useState(true); 
    const [ errorAmbitos, setErrorAmbitos] = useState(null); 

  useEffect(() => {
    const fetchAmbitos = async () => {
      try {
        const responseAmbitos = await apiTransferenciaCompentencia.get('ambitos/');
        setAmbitos(responseAmbitos.data)
        setLoadingAmbitos(false);
      } catch (error) {
        setErrorAmbitos(error);
        setLoadingAmbitos(false)
        console.error('Error al obtener datos de Ambitos:', error);
      }
    };

    fetchAmbitos();
  }, []);

  return {ambitos, loadingAmbitos, errorAmbitos};
};