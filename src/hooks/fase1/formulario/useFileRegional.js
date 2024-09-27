import {useState} from 'react'; 
import { apiTransferenciaCompentencia } from '../../../services/transferenciaCompetencia';

export const useFileRegional = () => {

  const [ isLoading, setIsLoading] = useState(false); 
  const [ error, setError]= useState(null); 

  const uploadFile = async ( idFormulario, organigramaRegionalId, file) => {
    setIsLoading(true); 
    setError(null); 

    const formData = new FormData(); 
    formData.append('organigrama_regional_id', organigramaRegionalId); // Corregido aquí
    formData.append('documento', file);

    try {
    await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${idFormulario}/update-organigrama-regional/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsLoading(false); 
    }catch (error) {
      setIsLoading(false); 
      setError(error); 
    }

  }

  
  return { uploadFile, isLoading, error}


}
