import { useEffect, useContext } from "react";
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { FormularioContext } from "../../context/FormSectorial";
import { Subpaso_CuatroUno } from "../../components/formSectorial/paso4/p4.1";
import { MonoStepers } from "../../components/stepers/MonoStepers";

const PasoCuatro = () =>
{
  const { updateStepNumber, pasoData, data } = useContext(FormularioContext);
  const stepNumber = 4;

  useEffect(() =>
  {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber, stepNumber ]);

  if (!pasoData) return <div>No hay datos disponibles para el Paso 4</div>;

  const { paso4: paso4Data, indicador_desempeno, lista_indicadores } = pasoData;
  if (!paso4Data) return <div>No hay información de paso 4 disponible</div>;

  const id = data?.id;

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso4Data.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container vh-100">
          <div className="d-flex">
            <h3 className="mt-3">{paso4Data.nombre_paso}</h3>
            <Avance avance={paso4Data.avance} />
          </div>
          <div className="mt-4">
            <h6 className="text-sans-h6-primary">Los indicadores de desempeño, deben incluir una descripción de los componentes del indicador, asi como los medios utilizados para su calculo y sus medios de verificación. Si la competencia esta asociada a un programa que cuente con evaluación ex ante, se debe considerar la información incluida en su versión mas actualizada.</h6>
            <h6 className="text-sans-h6-primary mt-3">De no contar la competencia con indicadores de desempeño asociados, este apartado debe ser omitido.</h6>
            <h6 className="text-sans-h6-primary mt-3">Si el ejercicio de la competencia tiene mas de un indicador de desempeño, se deben añadir las tablas correspondientes.</h6>
            <div className="my-5">
              <div className="">
                {/* Componente adicional en blanco para un nuevo indicador */}
                {indicador_desempeno  && (
                  <Subpaso_CuatroUno
                    data={pasoData}
                    id={id}
                    stepNumber={stepNumber}
                    listaIndicadores={lista_indicadores}
                    readOnly={false}
                  />
                )}
              </div>
            </div>
          </div>
          {/*Botones navegacion*/}
          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso4Data.numero_paso} id={id} />
          </div>
        </div>
      </div>
    </>
  )
};

export default PasoCuatro;
