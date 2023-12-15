import { useContext } from 'react';
import { Avance } from "../../components/tables/Avance";
import { FormularioContext } from '../../context/FormSectorial';
import { Subpaso_uno } from '../../components/formSectorial/paso1/p1.1';
import { Subpaso_dos} from '../../components/formSectorial/paso1/p1.2'
import { Subpaso_tres } from '../../components/formSectorial/paso1/p1.3';
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";

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
  const { id, nombre_paso, avance, p_1_1_ficha_descripcion_organizacional, p_1_3_marco_regulatorio_y_funcional_competencia, numero_paso } = pasoData;


  return (
    <>
      <div className="container-fluid ">
        <div className="d-flex">
          <h3 className="mt-3">{nombre_paso}</h3>
          <Avance avance={avance} />
        </div>
        <span className="text-sans-h6-primary">Texto de apoyo</span>
        <div className="container-fluid me-5 pe-5">
          <Subpaso_uno pasoData={p_1_1_ficha_descripcion_organizacional}/>
        </div>
        <div className="container-fluid me-5 pe-5">
        <Subpaso_dos/>
        </div>
        <div className="container-fluid me-5 pe-5">
          <Subpaso_tres pasoData={p_1_3_marco_regulatorio_y_funcional_competencia} />
        </div>
       <div className="container me-5 pe-5">
          <ButtonsNavigate step={numero_paso} id={id}/>
      </div>
      </div>     
    </>
  );
};

export default PasoUno;
