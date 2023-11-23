import { useState } from "react"
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia";

export const useLogin = () =>
{

  const [ data, setData ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(null);


  const login = async ({ rut, password }) =>
  {
    setLoading(true);
    try
    {
      const response = await apiTransferenciaCompentencia.post('login/', {
        rut: rut,
        password: password
      });
      setData(response.data);
      localStorage.setItem('useToken', response.data.token);
      localStorage.setItem('refreshToken', response.data[ 'refresh-token' ]);
    } catch (error)
    {
      if (error.response)
      {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        setError(error.response);
      } else
      {
        console.error('Error:', error.message);
        setError(error);
      }
    } finally
    {
      setLoading(false);
    }
  };


  return { data, loading, error, login };
}