import { useContext, useEffect } from "react";
import { FormularioContext } from '../../context/FormSectorial';
import { useObservacionesSubdere } from "../../hooks/formulario/useObSubdereSectorial";
import CustomTextarea from "../../components/forms/custom_textarea";
import { SubirArchivo } from "../../components/commons/subirArchivo";
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
    <div className="container col-10 col-xxl-11">
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
          <p className="text-sans-p">Asegúrate que las observaciones que ingresaste son suficientes, ya que una vez que las envíes, no podrás editarlas.</p>
        </>
      )}

      {/* DOCUMENTOS ANTECEDENTES ADICIONALES SECTOR:
        aqui usuario SUBDERE ve los AA subidos por el sector correspondiente
        pendiente conecciones GET con el backend*/}
      <div className="my-4">
        <p className="text-sans-h5 mb-1">Antecedentes Adicionales subidos por el sector</p>
        <div>
          <div className="d-flex justify-content-between py-3 fw-bold">
            <div className="d-flex mb-2">
              <div className="ms-4">#</div>
              <div className="ms-5">Documento</div>
            </div>
            <div className="me-5">Acción</div>
          </div>
        </div>
          <SubirArchivo
            readOnly={true}
          />
        <div className="my-4">
          <CustomTextarea
            label="Descripción del archivo adjunto (Opcional)"
            placeholder="Describe el archivo adjunto"
            readOnly={true}
          />
        </div>
        <p className="text-sans-p">
          Asegúrate que los datos ingresados son correctos, ya que una vez que envíes el formulario, 
          no podrás editarlo a menos que SUBDERE requiera información adicional.</p>
      </div>

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