import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useUpdateEtapa = () =>
{
    const updateEtapa = async (etapaNum, etapaId, datos) =>
    {
        // Validar que los parámetros etapaId y competenciaId no estén indefinidos
        if (!etapaId || !etapaNum)
        {
            console.error("etapaId o competenciaId están indefinidos o son nulos");
            return;
        }

        // Construcción de la URL para la solicitud PATCH
        const url = `/etapa${etapaNum}/${etapaId}/`;
        try
        {
            // Realizar la solicitud PATCH
            const response = await apiTransferenciaCompentencia.patch(url, datos);
            return response.data; // Devolver los datos actualizados
        } catch (error)
        {
            // Manejar los errores
            console.error('Error al actualizar la etapa:', error);

            // Manejo específico de errores, como 404 Not Found
            if (error.response && error.response.status === 404)
            {
                console.error("La ruta no fue encontrada en el servidor");
            } else
            {
                // Manejo de otros tipos de errores
                console.error("Ocurrió un error inesperado:", error.message);
            }
            throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
        }
    };

    return updateEtapa;
};
