import IndicadoresDesempeno from "../../tables/IndicadoresDesempeno";

const Subpaso_CuatroPuntoUno = () => {
  return (
    <div className="mt-4">
      <h6 className="text-sans-h6-primary">Los indicadores de desempeño, deben incluir una descripción de los componentes del indicador, asi como los medios utilizados para su calculo y sus medios de verificación. Si la competencia esta asociada a un programa que cuente con evaluación ex ante, se debe considerar la información incluida en su versión mas actualizada.</h6>
      <h6 className="text-sans-h6-primary mt-3">De no contar la competencia con indicadores de desempeño asociados, este apartado debe ser omitido.</h6>
      <h6 className="text-sans-h6-primary mt-3">Si el ejercicio de la competencia tiene mas de un indicador de desempeño, se deben añadir las tablas correspondientes.</h6>
      <div className="my-5">
        <IndicadoresDesempeno />
      </div>
    </div>
  )
};

export default Subpaso_CuatroPuntoUno;