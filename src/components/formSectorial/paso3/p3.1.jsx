import { useState, useEffect, useContext, useCallback } from "react";
import { FormularioContext } from "../../../context/FormSectorial";

export const Subpaso_Tres = ({ esquemaDatos, id, stepNumber }) =>
{
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [ datos, setDatos ] = useState(esquemaDatos || []);
  const [ showErrorMessage, setShowErrorMessage ] = useState(false);
  const currentYear = new Date().getFullYear();
  const yearDifferences = datos.map(data => currentYear - data.anio);
  const [guardadoConExito, setGuardadoConExito] = useState(Array(datos.length).fill(false));
  
console.log('datos',datos )
console.log('esquema', esquemaDatos)

  useEffect(() =>
  {
    if (esquemaDatos)
    {
      setDatos(esquemaDatos);
    }
  }, [ esquemaDatos ]);

  const handleInputChange = useCallback((index, campo, value) =>
  {
    const newDatos = [ ...datos ];
    const numericValue = value === '' ? null : Number(value);
    if (isNaN(numericValue))
    {
      setShowErrorMessage("Por favor, ingrese un número válido.");
      return;
    }
    newDatos[ index ][ campo ] = numericValue;
    setDatos(newDatos);
  }, [ datos ]);

  const handleBlur = useCallback(async (index, campo, value) =>
  {
    setShowErrorMessage('');

    const numericValue = value === '' ? null : Number(value);

    if (numericValue !== null && !isNaN(numericValue))
    {
      const idDelDato = datos[ index ].id;
      const payload = {
        id: idDelDato,
        [ campo ]: numericValue,
      };

      try
      {
        await handleUpdatePaso(id, stepNumber, payload);
        setDatos((datosAnteriores) =>
          datosAnteriores.map((dato, i) =>
            i === index ? { ...dato, [ campo ]: numericValue } : dato
          )
        );   
        setGuardadoConExito((exitosAnteriores) =>
        exitosAnteriores.map((exito, i) => i === index ? true : exito)
      );
      } catch (error)
      {
        // Maneja los errores y muestra un mensaje adecuado.
        console.error("Error al actualizar:", error);
        setShowErrorMessage("Error al guardar los cambios. Intente de nuevo.");
      }
    } else
    {
      // Muestra un mensaje de error si el valor no es un número válido.
      setShowErrorMessage("Por favor, ingrese un número válido.");
    }
  }, [ datos, handleUpdatePaso, id, stepNumber, setShowErrorMessage ]);

  const getPlaceholder = (rowIndex) =>
  {
    switch (rowIndex)
    {
      case 0:
      case 1:
        return "Unidades";
      case 2:
        return "Recursos (M$)"; default:
        return "";
    }
  };

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
              {datos.map((data, index) => (
                <th key={index} scope="col" className="text-sans-p text-center border-start">
                  <u>{data.anio}</u>
                  <p className="text-sans-h6-grey">(año n-{yearDifferences[ index ]})</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          {[ 'universo_cobertura', 'cobertura_efectivamente_abordada', 'recursos_ejecutados' ].map((item, rowIndex) => (
              <tr key={rowIndex} className="mt-2">
                <th scope="row" className="text-sans-p-bold align-self-center">{rowIndex + 1}</th>
                <th scope="row" className="text-sans-p-bold pt-2">{item.replace(/_/g, ' ')}</th>
                {datos.map((data, colIndex) => (
                  <td key={`${rowIndex}- ${colIndex}`} className="border-start px-1">
                    <input
                      type="number"
                      value={data[ item ] || ""}
                      placeholder={getPlaceholder(rowIndex)}
                      onChange={(e) => handleInputChange(colIndex, item, e.target.value)}
                      onBlur={(e) => handleBlur(colIndex, item, e.target.value)}
                      className={`form-control mx-auto px-0 mb-4 text-center ${guardadoConExito[colIndex] ? 'input-success' : ''}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr >
              <th scope="row">4</th>
              <th scope="row" className="text-sans-p-bold">Total<br />M$/Cobertura <br />efectiva</th>
              {datos.map((data, index) => (
                <td key={`total-${index}`} className="border-start px-3 text-center " ><p className="text-sans-h6-primary">{data.total_cobertura_efectiva}</p></td>
              ))}
            </tr>
          </tbody>
        </table>
        {showErrorMessage && (
          <div className="error-message text-sans-h6-darkred">
            Debes llenar todos los campos para poder enviar el formulario.
          </div>
        )}
      </div>
    </div >
  );
}