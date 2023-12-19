import { useContext } from 'react'; 
import { FormularioContext } from '../../context/FormSectorial';
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { Subpaso_dosPuntoUno } from "../../components/formSectorial/paso2/p2.1";
import { Subpaso_dosPuntoDos } from "../../components/formSectorial/paso2/p2.2";
import { Subpaso_dosPuntoTres } from "../../components/formSectorial/paso2/p2.3";
import { Subpaso_dosPuntoCuatro } from "../../components/formSectorial/paso2/p2.4";
import { Subpaso_dosPuntoCinco } from "../../components/formSectorial/paso2/p2.5";

const pasoDos = () => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pasoData, loadingPaso, errorPaso } = useContext(FormularioContext); 
  console.log('data paso dos', pasoData);
  // const { pasoData, loadingPaso, errorPaso } = useContext(FormularioContext); 
  // console.log('data paso dos', pasoData);

  if (loadingPaso) return <div>Cargando...</div>;
  if (errorPaso) return <div>Error: {errorPaso.message || "Error desconocido"}</div>;
  if (!pasoData) return <div>No hay datos disponibles para el Paso 1</div>;

  return (
  <div className="container vh-100">
    <div className="d-flex">
      <h3 className="mt-3">Arquitectura del Proceso</h3>
      <Avance/>
    </div>
    <span className="text-sans-h6-primary">Texto de apoyo</span>

    <div className="container-fluid me-5 pe-5 my-5">
      <Subpaso_dosPuntoUno />
    </div>
    <div className="container-fluid me-5 pe-5 my-5">
      <Subpaso_dosPuntoDos />
    </div>
    <div className="container-fluid me-5 pe-5 my-5">
      <Subpaso_dosPuntoTres />
    </div>
    <div className="container-fluid me-5 pe-5 my-5">
      <Subpaso_dosPuntoCuatro />
    </div>
    <div className="container-fluid me-5 pe-5 my-5">
      <Subpaso_dosPuntoCinco />
    </div>

    {/*Botones navegacion  */}
    <div className="container me-5 pe-5">
      <ButtonsNavigate step="" id=""/>
    </div>
</div> 
  )
};

export default pasoDos