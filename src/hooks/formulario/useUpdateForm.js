import { useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useUpdateForm = () =>
{
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(null);
  const [ success, setSuccess ] = useState(false);
  const [ response, setResponse ] = useState(null);

  const patchStep = async (id, stepNumber, data, formData = null) =>
  {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try
    {
      const url = `/formulario-sectorial/${id}/paso-${stepNumber}/`;
      let headers = {};

      let payload = data;
      if (formData)
      {
        payload = formData;
        headers[ 'Content-Type' ] = 'multipart/form-data';
      } else
      {
        headers[ 'Content-Type' ] = 'application/json';
        payload = JSON.stringify(data);
      }

      const response = await apiTransferenciaCompentencia.patch(url, payload, { headers });
      setResponse(response.data);
      setSuccess(true);
    } catch (error)
    {
      setError(error.response ? error.response.data : error.message);
    } finally
    {
      setLoading(false);
    }
  };
  return { patchStep, loading, error, success, response };
};

