import { useContext, useEffect } from "react";
import { FormularioContext } from '../../context/FormSectorial';
import { useObservacionesSubdere } from "../../hooks/formulario/useObSubdereSectorial";
import CustomTextarea from "../../components/forms/custom_textarea";
import successIcon from '../../static/icons/success.svg';
import { useNavigate } from "react-router-dom";

const ResumenOS = () => {
	const { data } = useContext(FormularioContext);
	const { observaciones, fetchObservaciones, updateObservacion } = useObservacionesSubdere(data ? data.id : null);
	const navigate = useNavigate();

  useEffect(() => {
    const obtenerObservaciones = async () => {
      try {
        await fetchObservaciones();
      } catch (error) {
        console.error("Error al obtener observaciones en ResumenOS:", error);
      }
    };
    obtenerObservaciones();
  }, [data, fetchObservaciones]);

	const handleBackButtonClick = () => {
    navigate(-1);
  };
  const handleClickOSCerrada = () => {
    navigate(`/home/observaciones_subdere/${data.competencia_id}/`);
  };

	const handleEnviarClick = async () => {
    try {
      await updateObservacion({ observacion_enviada: true });
      navigate( `/home/success_observaciones_subdere/${data.id}/`);

    } catch (error) {
      console.error("Error al enviar observaciones:", error);
    }
  };

	const titulosPasos = {
		1: "Descripción de la Institución",
		2: "Arquitectura del Proceso",
		3: "Cobertura de la Competencia",
		4: "Indicadores de Desempeño",
		5: "Costeo de la Competencia",
	};

  return (
    <div className="container col-11">
      <p className="text-sans-h1 text-center">Resumen observaciones </p>

      {Object.keys(observaciones).map((pasoKey) => {
        // Excluir claves no deseadas
        if (
					pasoKey === 'observacion_enviada' || 
					pasoKey === 'fecha_envio' || 
					pasoKey === 'id') {
          return null;
        }

        const pasoNumber = pasoKey.replace('observacion_paso', ''); 
        const observacion = observaciones[pasoKey];

				if (Array.isArray(observacion) && observacion.length === 0) {
          return null; // No mostrar nada si es un array vacío
        }

        return (
          <div key={pasoKey} className="mb-5">
						<hr/>
						<div className="d-flex justify-content-between align-items-center mb-3">
							<div className="d-flex">
								<p className="text-sans-p-semibold">Paso {pasoNumber}:</p>
								<p className="text-sans-p ms-2">{titulosPasos[pasoNumber]}</p>
							</div>
							{observacion && !Array.isArray(observacion) && (
							<>
								<img className="icono-s" src={successIcon} alt="Éxito" />
								<p className="text-sans-p-blue me-3">Listo</p>
							</>
							)}
							{observacion != null && (Array.isArray(observacion) ? observacion.length === 0 : observacion.trim() === "") && (
								<p className="text-sans-p me-3">No dejaste observaciones en este paso.</p>
							)}
						</div>
            {observacion && !Array.isArray(observacion) && (
              <CustomTextarea
                label="Observaciones (Opcional)"
                type="text"
                id={`paso${pasoNumber}`}
                name={`paso${pasoNumber}`}
                value={observacion}
                readOnly
                className="form-control"
              />
            )}
          </div>
        );
      })}

      {!observaciones.observacion_enviada && (
        <>
          <h2 className="text-sans-h2">Esta todo listo para que envies las observaciones</h2>
          <p className="text-sans-p">Asegurate que las observaciones que ingresaste son suficientes, ya que una vez que las envíes, no podrás editarlas.</p>
        </>
      )}
			<div className="d-flex justify-content-between p-2 mb-5 pb-5">
				<button className="d-flex btn-secundario-s"  onClick={handleBackButtonClick}>
					<i className="material-symbols-rounded me-2">arrow_back_ios</i>
					<p className="text-decoration-underline mb-0">Atrás</p>
				</button>
        <div>
          {observaciones.observacion_enviada ? (
            <button 
            className="d-flex btn-primario-s text-decoration-underline" 
            onClick={handleClickOSCerrada}>
              Volver a Observaciones
            </button>
          ) : (
            <button className="d-flex btn-primario-s" onClick={handleEnviarClick}>
              <p className="text-decoration-underline mb-0">Enviar Observaciones</p>
              <i className="material-symbols-rounded me-2">arrow_forward_ios</i>
            </button>
          )}
        </div>
			</div>
    </div>
  );
}

export default ResumenOS;