import { useState, useEffect } from "react";

export const Subpaso_TresOS = ({ esquemaDatos }) => {
  const [ datos, setDatos ] = useState([]);

  useEffect(() => {
    if (esquemaDatos) {
      setDatos(esquemaDatos);
    }
  }, [esquemaDatos]);

  if (!esquemaDatos) {
    return <div>Cargando datos...</div>;
  }

  if (!datos || datos.length === 0) {
    return <div>No hay datos para mostrar.</div>;
  }

  const headers = datos.map(data => data.anio);

  const getPlaceholder = (rowIndex) => {
    switch (rowIndex) {
      case 0:
      case 1:
        return "Unidades";
      case 2:
        return "Recursos (M$)";
      default:
        return "";
    }
  };

  const currentYear = new Date().getFullYear();
  const yearDifferences = headers.map(year => currentYear - year);

  return (
    <div className="mt-4">
      <span className="my-4 text-sans-h4">3.1 Cobertura financiera de los últimos 5 años</span>
      <div className="text-sans-h6-primary">
        <h6>
          En función a lo descrito se debe cuantificar el universo de cobertura y la cobertura efectivamente abordada en los últimos 5 años. Luego cuantificar los recursos ejecutados anualmente (en M$) respecto a la cobertura efectivamente abordada.<br /><br />
          En caso de que un año no se hayan ejecutado recursos, llenar con 0.
        </h6>
      </div>
      <div className="my-4">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col" className="text-sans-p-bold px-2 pb-5">#</th>
              <th scope="col" className="text-sans-p-bold px-2 pb-5 ">Año de ejercicio</th>
              {headers.map((year, index) => (
                <th key={index} scope="col" className="text-sans-p text-center border-start ">
                  <u>{year}</u>
                  <p className="text-sans-h6-grey">(año n-{yearDifferences[ index ]})</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[ 'Universo de cobertura', 'Cobertura efectivamente abordada', 'Recursos ejecutados anualmente en M$' ].map((item, rowIndex) => (
              <tr key={rowIndex} className="mt-2">
                <th scope="row" className="text-sans-p-bold align-self-center">{rowIndex + 1}</th>
                <th scope="row" className="text-sans-p-bold pt-2">{item}</th>
                {datos.map((data, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className="border-start px-1">
                    <input
                      type="number"
                      value={data[ item.toLowerCase().replace(/ /g, '_') ] || ""}
                      placeholder={getPlaceholder(rowIndex)}
                      className="form-control mx-auto px-0 mb-4 text-center"
                      disabled
                    />
                  </td>
                ))}
              </tr>
            ))}
            {/* Última fila que muestra resultados en lugar de inputs */}
            <tr >
              <th scope="row">4</th>
              <th scope="row" className="text-sans-p-bold">Total<br />M$/Cobertura <br />efectiva</th>
              {datos.map((data, index) => (
                <td key={`total-${index}`} className="border-start px-3 text-center " ><p className="text-sans-h6-primary">{data.total_cobertura_efectiva}</p></td>
              ))}
            </tr>
          </tbody>
        </table> 
      </div>
    </div>
  );
};