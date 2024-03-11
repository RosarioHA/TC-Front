import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FormularioContext } from '../../context/FormSectorial';
import { useObservacionesSubdere } from "../../hooks/formulario/useObSubdereSectorial";
import CustomTextarea from "../../components/forms/custom_textarea";
import successIcon from '../../static/icons/success.svg';
import { useNavigate } from "react-router-dom";

const ResumenOS = () => {
  const {id} = useParams();
	const { data } = useContext(FormularioContext);
	const { observaciones, fetchObservaciones, updateObservacion } = useObservacionesSubdere(data ? data.id : null);
	const navigate = useNavigate();
	console.log("observaciones en ResumenOS", observaciones)
  console.log("id en ResumenOS", id)

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

	const handleEnviarClick = async () => {
    try {
      // Aquí actualizas el valor de observacion_enviada a true
      await updateObservacion({ observacion_enviada: true });
      navigate( `/home/success_observaciones_subdere/${data.id}/`);

    } catch (error) {
      console.error("Error al enviar observaciones:", error);
      // Manejar el error si es necesario
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
          <div key={pasoKey}>
						<hr/>
						<div className="d-flex justify-content-between align-items-center mb-3">
							<div className="d-flex">
								<p className="text-sans-p-semibold">Paso {pasoNumber}:</p>
								<p className="text-sans-p ms-2">{titulosPasos[pasoNumber]}</p>
							</div>
							{console.log("Valor de observacion:", observacion)}
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

			<h2 className="text-sans-h2 mt-5">Esta todo listo para que envies las observaciones</h2>
			<p className="text-sans-p">Asegurate que las observaciones que ingresaste son suficientes, ya que una vez que las envíes, no podrás editarlas.</p>
			<div className="d-flex justify-content-between p-2 mb-5 pb-5">
				<button className="d-flex btn-secundario-s"  onClick={handleBackButtonClick}>
					<i className="material-symbols-rounded me-2">arrow_back_ios</i>
					Atrás
				</button>
				<button className="d-flex btn-primario-s" onClick={handleEnviarClick}>
					Enviar Observaciones
					<i className="material-symbols-rounded me-2">arrow_forward_ios</i>
				</button>
			</div>
    </div>
  );
}

export default ResumenOS;