import { useContext, useEffect } from "react";
import { FormularioContext } from '../../context/FormSectorial';
import { useObservacionesSubdere } from "../../hooks/formulario/useObSubdereSectorial";

const ResumenOS = () => {
	const { data } = useContext(FormularioContext);
	const { observaciones, fetchObservaciones } = useObservacionesSubdere(data ? data.id : null);

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

  console.log("ID en ResumenOS:", data ? data.id : "No hay ID");
  console.log("observaciones subdere en resumen os", observaciones);

  return (
    <div className="container">
      <p className="text-sans-h1">Resumen observaciones </p>
			<hr/>
    </div>
  );
}

export default ResumenOS;