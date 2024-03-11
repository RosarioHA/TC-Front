import { useState} from 'react';
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const usePatchGorePaso = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const patchData = async (id, stepNumber, data, formData = null) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const url = `/formulario-gore/${id}/paso-${stepNumber}/`;
      let headers = {};
  
      let payload = data;
      if (formData) {
        payload = formData;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        headers['Content-Type'] = 'application/json';
        payload = JSON.stringify(data);
      }
  
      const response = await apiTransferenciaCompentencia.patch(url, payload, { headers });
      setResponse(response.data);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return { patchData, isLoading, error, response };
};