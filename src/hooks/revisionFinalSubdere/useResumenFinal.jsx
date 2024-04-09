import { useEffect, useState, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useResumenFinal = (id) => {
  const [ resumen, setResumen ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  const fetchResumen = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiTransferenciaCompentencia.get(`/revision-final-competencia/${id}/resumen/`);
      setResumen(response.data);
      setError(null); // Limpiar errores previos si la solicitud es exitosa
    } catch (error) {
      setError('No se pudo cargar el resumen del formulario. Por favor, intente nuevamente.');
      setResumen(null); // Opcional: resetear el resumen en caso de error
    } finally {
      setLoading(false);
    }
  }, [ id ]);

  useEffect(() => {
    if (id) { // Asegurarse de que el id es válido antes de intentar cargar los datos
      fetchResumen();
    }
  }, [ fetchResumen, id ]);

  const actualizarFormularioEnviado = async () => {
    try {
      await apiTransferenciaCompentencia.patch(`/revision-final-competencia/${id}/resumen/`, { formulario_enviado: true });
      // Actualizar el estado local directamente para reflejar el cambio, evitando una nueva carga
      setResumen((prevState) => ({
        ...prevState,
        formulario_enviado: true,
      }));
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      // Considerar manejar este error de manera más visible para el usuario, por ejemplo, actualizando el estado `error`
    }
  };

  console.log(resumen)

  return { resumen, loading, error, fetchResumen, actualizarFormularioEnviado };
};
