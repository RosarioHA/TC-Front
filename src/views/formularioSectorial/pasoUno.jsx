import { useContext } from 'react';
import { Avance } from "../../components/tables/Avance";
import { FormularioContext } from '../../context/FormSectorial';
import { Subpaso_uno } from '../../components/formSectorial/paso1/p1.1';
// import { Subpaso_unopuntodos} from '../../components/formSectorial/paso1/p1.2'

const PasoUno = () =>
{
  const { pasoData, loadingPaso, errorPaso } = useContext(FormularioContext);

  console.log('data paso uno', pasoData);

  if (loadingPaso)
  {
    return <div>Cargando...</div>;
  }

  if (errorPaso)
  {
    const errorMessage = errorPaso.message || "Error desconocido";
    return <div>Error al cargar los datos: {errorMessage}</div>;
  }

  if (!pasoData)
  {
    return <div>No hay datos disponibles para el Paso 1</div>;
  }

  // Accediendo a los datos del paso uno directamente
  const { nombre_paso, avance , p_1_1_ficha_descripcion_organizacional
  } = pasoData;


  return (
    <div className="container vh-100">
      <div className="d-flex">
        <h3 className="mt-3">{nombre_paso}</h3>
        <Avance avance={avance} />
      </div>
      <span className="text-sans-h6-primary">Texto de apoyo</span>
      <div className="me-5 pe-5">
        <Subpaso_uno pasoData= {p_1_1_ficha_descripcion_organizacional}/>
      </div>
      {/* <div className="me-5 pe-5">
        <Subpaso_unopuntodos/>
      </div> */}
    </div>
  );
};

export default PasoUno;
